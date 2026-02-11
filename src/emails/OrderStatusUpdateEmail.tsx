import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import { Order, OrderStatus } from "@/types/order";

interface OrderStatusUpdateEmailProps {
  order: Order;
  newStatus: OrderStatus;
  oldStatus: OrderStatus;
}

interface StatusContent {
  previewText: string;
  heading: string;
  bodyText: string;
  showItems: boolean;
  showTrackingLink: boolean;
}

/**
 * Returns status-specific content for the email template.
 */
function getStatusContent(
  newStatus: OrderStatus,
  orderNumber: string
): StatusContent {
  switch (newStatus) {
    case "confirmed":
      return {
        previewText: `Votre commande ${orderNumber} a été confirmée - Nuage`,
        heading: "Votre commande a été confirmée !",
        bodyText:
          "Nous avons bien reçu votre commande et nous la préparons avec soin. Vous recevrez une notification dès que vos articles seront expédiés.",
        showItems: true,
        showTrackingLink: false,
      };
    case "processing":
      return {
        previewText: `Votre commande ${orderNumber} est en préparation - Nuage`,
        heading: "Votre commande est en préparation",
        bodyText:
          "Vos articles sont en cours de préparation par notre équipe. Nous mettons tout en oeuvre pour que votre commande soit prête dans les meilleurs délais.",
        showItems: false,
        showTrackingLink: false,
      };
    case "delivered":
      return {
        previewText: `Votre commande ${orderNumber} a été livrée - Nuage`,
        heading: "Votre commande a été livrée !",
        bodyText:
          "Votre commande a été livrée avec succès. Nous espérons que vous apprécierez vos articles.",
        showItems: true,
        showTrackingLink: true,
      };
    case "cancelled":
      return {
        previewText: `Votre commande ${orderNumber} a été annulée - Nuage`,
        heading: "Votre commande a été annulée",
        bodyText:
          "Nous sommes désolés de vous informer que votre commande a été annulée. Si vous avez des questions, n'hésitez pas à nous contacter.",
        showItems: false,
        showTrackingLink: false,
      };
    default:
      return {
        previewText: `Mise à jour de votre commande ${orderNumber} - Nuage`,
        heading: "Mise à jour de votre commande",
        bodyText: "Le statut de votre commande a été mis à jour.",
        showItems: false,
        showTrackingLink: false,
      };
  }
}

/**
 * Order Status Update Email Template
 *
 * Sent when order status changes to: confirmed, processing, delivered, or cancelled.
 * For "shipped" status, use ShippingNotificationEmail instead.
 * Follows the same brand styling as OrderConfirmationEmail and ShippingNotificationEmail.
 */
export function OrderStatusUpdateEmail({
  order,
  newStatus,
}: OrderStatusUpdateEmailProps) {
  const { orderNumber, items } = order;
  const content = getStatusContent(newStatus, orderNumber);

  return (
    <Html>
      <Head />
      <Preview>{content.previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={brandName}>Nuage</Heading>
            <Text style={tagline}>L&apos;Art de la D&eacute;tente</Text>
          </Section>

          {/* Status Message */}
          <Section style={section}>
            <Heading style={h1}>{content.heading}</Heading>
            <Text style={text}>{content.bodyText}</Text>
            <Text style={orderNumberText}>
              Num&eacute;ro de commande : <strong>{orderNumber}</strong>
            </Text>
          </Section>

          {/* Items Summary (for confirmed and delivered) */}
          {content.showItems && items.length > 0 && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>
                  {newStatus === "delivered"
                    ? "Articles livrés"
                    : "Récapitulatif de votre commande"}
                </Heading>
                {items.map((item, index) => (
                  <Text key={index} style={itemText}>
                    {item.productName} &times; {item.quantity} &mdash;{" "}
                    {((item.price * item.quantity) / 100).toFixed(2)} &euro;
                  </Text>
                ))}
              </Section>
            </>
          )}

          {/* Tracking Link (for delivered) */}
          {content.showTrackingLink && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>Suivi de commande</Heading>
                <Text style={text}>
                  Consultez le d&eacute;tail de votre commande et son suivi :
                </Text>
                <div style={{ textAlign: "center" as const, marginTop: "16px" }}>
                  <Link
                    href={`https://nuage.fr/suivi/${orderNumber}`}
                    style={trackingButton}
                  >
                    Voir ma commande
                  </Link>
                </div>
              </Section>
            </>
          )}

          {/* Contact section for cancelled */}
          {newStatus === "cancelled" && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Text style={text}>
                  Si cette annulation ne correspond pas &agrave; votre demande ou
                  si vous souhaitez passer une nouvelle commande, n&apos;h&eacute;sitez
                  pas &agrave; nous contacter en r&eacute;pondant &agrave; cet email.
                </Text>
              </Section>
            </>
          )}

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Des questions ? R&eacute;pondez simplement &agrave; cet email.
            </Text>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Nuage. Tous droits r&eacute;serv&eacute;s.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles using brand colors — matches OrderConfirmationEmail and ShippingNotificationEmail
const main = {
  backgroundColor: "#F7F5F3",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const brandName = {
  fontSize: "32px",
  fontWeight: "300",
  color: "#2C2C2C",
  margin: "0 0 8px 0",
  letterSpacing: "0.02em",
};

const tagline = {
  fontSize: "14px",
  color: "#D4A5A5",
  fontStyle: "italic",
  margin: "0",
};

const section = {
  marginBottom: "24px",
};

const h1 = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#2C2C2C",
  margin: "0 0 16px 0",
};

const h2 = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#2C2C2C",
  margin: "0 0 12px 0",
};

const text = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#6B6B6B",
  margin: "0 0 12px 0",
};

const orderNumberText = {
  fontSize: "16px",
  color: "#2C2C2C",
  margin: "0",
  padding: "12px",
  backgroundColor: "#F7F5F3",
  borderRadius: "8px",
  textAlign: "center" as const,
};

const itemText = {
  fontSize: "14px",
  color: "#2C2C2C",
  margin: "0 0 8px 0",
  lineHeight: "20px",
};

const trackingButton = {
  display: "inline-block",
  padding: "12px 32px",
  backgroundColor: "#2C2C2C",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "8px",
  fontWeight: "500",
  fontSize: "14px",
};

const hr = {
  borderColor: "#E5E5E5",
  margin: "24px 0",
};

const footer = {
  textAlign: "center" as const,
  marginTop: "32px",
};

const footerText = {
  fontSize: "12px",
  color: "#6B6B6B",
  margin: "8px 0",
};

export default OrderStatusUpdateEmail;
