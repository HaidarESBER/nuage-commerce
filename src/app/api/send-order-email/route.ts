import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmationEmail";
import { Order } from "@/types/order";

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/send-order-email
 *
 * Sends order confirmation email to customer
 *
 * Body:
 * - order: Order object with all order details
 *
 * Returns:
 * - 200: Email sent successfully
 * - 400: Missing order data
 * - 500: Email sending failed
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order } = body as { order: Order };

    // Validate order data
    if (!order || !order.shippingAddress?.email) {
      return NextResponse.json(
        { error: "Order data or email is missing" },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Nuage <commandes@nuage.fr>", // Update with your verified domain
      to: [order.shippingAddress.email],
      subject: `Confirmation de commande ${order.orderNumber}`,
      react: OrderConfirmationEmail({ order }),
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Failed to send email", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in send-order-email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
