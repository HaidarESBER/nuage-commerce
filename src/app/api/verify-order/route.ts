import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/orders";

/**
 * POST /api/verify-order
 *
 * Verifies that an order exists and matches the provided email.
 * Used for order tracking security - ensures only the customer can view their order.
 *
 * Body:
 * - orderNumber: string
 * - email: string
 *
 * Returns:
 * - 200: Order exists and email matches
 * - 400: Missing required fields
 * - 404: Order not found or email doesn't match
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, email } = body as {
      orderNumber: string;
      email: string;
    };

    // Validate inputs
    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Numéro de commande et email requis" },
        { status: 400 }
      );
    }

    // Get order from database
    const order = await getOrderByNumber(orderNumber);

    // Check if order exists
    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    // Verify email matches (case-insensitive)
    const orderEmail = order.shippingAddress.email.toLowerCase();
    const providedEmail = email.toLowerCase().trim();

    if (orderEmail !== providedEmail) {
      return NextResponse.json(
        { error: "L'adresse email ne correspond pas à cette commande" },
        { status: 404 }
      );
    }

    // Success - email matches
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error verifying order:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}
