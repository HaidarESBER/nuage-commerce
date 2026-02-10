import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ShippingNotificationEmail } from "@/emails/ShippingNotificationEmail";
import { Order } from "@/types/order";

// Initialize Resend with API key from environment (lazy initialization)
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
};

/**
 * POST /api/send-shipping-email
 *
 * Sends shipping notification email to customer when order is shipped
 *
 * Body:
 * - order: Order object with tracking information
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

    // Check if Resend is configured
    try {
      const resend = getResend();
      // Send email using Resend
      const { data, error } = await resend.emails.send({
        from: "Nuage <commandes@nuage.fr>", // Update with your verified domain
        to: [order.shippingAddress.email],
        subject: `Votre commande ${order.orderNumber} a été expédiée !`,
        react: ShippingNotificationEmail({
          order,
          trackingNumber: order.trackingNumber,
          trackingUrl: order.trackingUrl,
          estimatedDelivery: order.estimatedDelivery,
        }),
      });

      if (error) {
        console.error("Error sending shipping email:", error);
        return NextResponse.json(
          { error: "Failed to send email", details: error },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, messageId: data?.id },
        { status: 200 }
      );
    } catch (resendError) {
      console.error("Resend configuration error:", resendError);
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Unexpected error in send-shipping-email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
