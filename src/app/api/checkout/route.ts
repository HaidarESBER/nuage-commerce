import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createOrder } from '@/lib/orders'
import { getAllProducts } from '@/lib/products'
import { OrderItem } from '@/types/order'
import { ShippingAddress } from '@/types/checkout'

interface CheckoutRequestBody {
  items: OrderItem[]
  shippingAddress: ShippingAddress
  shippingCost: number
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json()
    const { items, shippingAddress, shippingCost, notes } = body

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !shippingAddress.email) {
      return NextResponse.json(
        { error: "L'adresse de livraison est requise" },
        { status: 400 }
      )
    }

    // Security: Look up product prices from DB (never trust client prices)
    const allProducts = await getAllProducts()
    const productMap = new Map(allProducts.map(p => [p.id, p]))

    // Verify all products exist and build DB-verified price map
    const dbPriceMap: Record<string, number> = {}
    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Produit introuvable: ${item.productName}` },
          { status: 400 }
        )
      }
      dbPriceMap[item.productId] = product.price
    }

    // Calculate subtotal from DB-verified prices
    const subtotal = items.reduce(
      (sum, item) => sum + dbPriceMap[item.productId] * item.quantity,
      0
    )
    const total = subtotal + shippingCost

    // Create order in DB with pending_payment status
    const order = await createOrder({
      items: items.map(item => ({
        ...item,
        price: dbPriceMap[item.productId], // Use DB-verified price
      })),
      subtotal,
      shipping: shippingCost,
      total,
      shippingAddress,
      notes,
      status: 'pending_payment',
    })

    // Build Stripe line_items from order items
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const line_items = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.productName,
          images: item.productImage
            ? [
                item.productImage.startsWith('http')
                  ? item.productImage
                  : `${siteUrl}${item.productImage}`,
              ]
            : [],
        },
        unit_amount: dbPriceMap[item.productId],
      },
      quantity: item.quantity,
    }))

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_options: shippingCost > 0
        ? [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: shippingCost, currency: 'eur' },
                display_name: 'Livraison',
              },
            },
          ]
        : [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: 0, currency: 'eur' },
                display_name: 'Livraison gratuite',
              },
            },
          ],
      customer_email: shippingAddress.email,
      client_reference_id: order.id,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      locale: 'fr',
      success_url: `${siteUrl}/commande/confirmation/${order.orderNumber}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/panier`,
    })

    // Update order with Stripe session ID via Supabase
    const { updateOrderStripeData } = await import('@/lib/orders')
    try {
      await updateOrderStripeData(order.id, { stripeSessionId: session.id })
    } catch {
      // Non-blocking: order was created, session works, just couldn't save session ID
      console.error('Failed to update order with Stripe session ID')
    }

    return NextResponse.json({
      url: session.url,
      orderNumber: order.orderNumber,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la creation de la session de paiement' },
      { status: 500 }
    )
  }
}
