import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { Order, OrderItem } from '@/types/order'
import { ShippingAddress } from '@/types/checkout'

/**
 * Map Supabase snake_case order row to Order interface
 */
function mapToOrderType(dbOrder: Record<string, unknown>): Order {
  const items = (dbOrder.order_items as Record<string, unknown>[]) || []
  return {
    id: dbOrder.id as string,
    orderNumber: dbOrder.order_number as string,
    items: items.map((item): OrderItem => ({
      productId: item.product_id as string,
      productName: item.product_name as string,
      productImage: item.product_image as string,
      price: item.price as number,
      quantity: item.quantity as number,
    })),
    subtotal: dbOrder.subtotal as number,
    shipping: dbOrder.shipping as number,
    total: dbOrder.total as number,
    status: dbOrder.status as Order['status'],
    shippingAddress: {
      firstName: dbOrder.shipping_first_name as string,
      lastName: dbOrder.shipping_last_name as string,
      address: dbOrder.shipping_address as string,
      city: dbOrder.shipping_city as string,
      postalCode: dbOrder.shipping_postal_code as string,
      country: dbOrder.shipping_country as string,
      phone: dbOrder.shipping_phone as string,
      email: dbOrder.shipping_email as string,
    } as ShippingAddress,
    notes: dbOrder.notes as string | undefined,
    trackingNumber: dbOrder.tracking_number as string | undefined,
    trackingUrl: dbOrder.tracking_url as string | undefined,
    estimatedDelivery: dbOrder.estimated_delivery as string | undefined,
    shippedAt: dbOrder.shipped_at as string | undefined,
    deliveredAt: dbOrder.delivered_at as string | undefined,
    stripeSessionId: dbOrder.stripe_session_id as string | undefined,
    stripePaymentIntentId: dbOrder.stripe_payment_intent_id as string | undefined,
    createdAt: dbOrder.created_at as string,
    updatedAt: dbOrder.updated_at as string,
  }
}

/**
 * POST /api/webhooks/stripe
 *
 * Stripe webhook handler for payment lifecycle events.
 * Verifies webhook signature, handles checkout.session.completed
 * and checkout.session.expired events.
 *
 * IMPORTANT: Always returns 200 for known events to prevent Stripe retries.
 * Uses request.text() (not .json()) for signature verification.
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.client_reference_id

        if (!orderId) {
          console.error('Webhook: No client_reference_id in session', session.id)
          return NextResponse.json({ received: true })
        }

        // Only process if payment is complete
        if (session.payment_status !== 'paid') {
          console.log('Webhook: Payment not yet paid for session', session.id)
          return NextResponse.json({ received: true })
        }

        const supabase = createAdminClient()

        // Idempotency check: skip if already confirmed or beyond
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('status')
          .eq('id', orderId)
          .single()

        if (!existingOrder) {
          console.error('Webhook: Order not found:', orderId)
          return NextResponse.json({ received: true })
        }

        const completedStatuses = ['confirmed', 'processing', 'shipped', 'delivered']
        if (completedStatuses.includes(existingOrder.status)) {
          console.log('Webhook: Order already processed, skipping:', orderId)
          return NextResponse.json({ received: true })
        }

        // Update order to confirmed with Stripe payment intent ID
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'confirmed',
            stripe_payment_intent_id: session.payment_intent as string,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)

        if (updateError) {
          console.error('Webhook: Failed to update order:', updateError)
          return NextResponse.json({ received: true })
        }

        console.log('Webhook: Order confirmed:', orderId)

        // Track referral conversion
        // Retrieve visitor ID from order metadata if it was stored during checkout
        if (session.metadata?.visitor_id) {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
          await fetch(`${siteUrl}/api/referral/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              visitorId: session.metadata.visitor_id,
              orderId: orderId,
            }),
          }).catch(err => console.error('Failed to track referral conversion:', err))
        }

        // Send confirmation email
        const { data: orderData } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', orderId)
          .single()

        if (orderData) {
          const mappedOrder = mapToOrderType(orderData)
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

          await fetch(`${siteUrl}/api/send-order-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: mappedOrder }),
          }).catch(err => console.error('Failed to send confirmation email:', err))
        }

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.client_reference_id

        if (!orderId) {
          console.log('Webhook: No client_reference_id in expired session', session.id)
          return NextResponse.json({ received: true })
        }

        const supabase = createAdminClient()

        // Only cancel if still pending_payment
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('status')
          .eq('id', orderId)
          .single()

        if (existingOrder && existingOrder.status === 'pending_payment') {
          await supabase
            .from('orders')
            .update({
              status: 'cancelled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', orderId)

          console.log('Webhook: Expired session, order cancelled:', orderId)
        }

        break
      }

      default:
        console.log('Webhook: Unhandled event type:', event.type)
    }
  } catch (error) {
    // Log error but still return 200 to prevent Stripe retries
    console.error('Webhook: Error processing event:', error)
  }

  return NextResponse.json({ received: true })
}
