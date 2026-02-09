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
  Button,
} from "@react-email/components";
import { Order } from "@/types/order";

interface ShippingNotificationEmailProps {
  order: Order;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

/**
 * Shipping Notification Email Template
 *
 * Sent when order status changes to "shipped".
 * Includes tracking information.
 */
export function ShippingNotificationEmail({
  order,
  trackingNumber,
  trackingUrl,
  estimatedDelivery,
}: ShippingNotificationEmailProps) {
  const { orderNumber, items, shippingAddress } = order;

  return (
    <Html>
      <Head />
      <Preview>Votre commande {orderNumber} a été expédiée - Nuage</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={brandName}>Nuage</Heading>
            <Text style={tagline}>L'Art de la Détente</Text>
          </Section>

          {/* Success Message */}
          <Section style={section}>
            <Heading style={h1}>Votre commande est en route ! 📦</Heading>
            <Text style={text}>
              Bonne nouvelle ! Votre commande a été expédiée et est en chemin vers vous.
            </Text>
            <Text style={orderNumberText}>
              Numéro de commande : <strong>{orderNumber}</strong>
            </Text>
          </Section>

          {trackingNumber && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>Informations de suivi</Heading>
                <Text style={text}>
                  Numéro de suivi : <strong>{trackingNumber}</strong>
                </Text>
                {estimatedDelivery && (
                  <Text style={text}>
                    Livraison estimée : <strong>{estimatedDelivery}</strong>
                  </Text>
                )}
                {trackingUrl && (
                  <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <Link
                      href={trackingUrl}
                      style={trackingButton}
                    >
                      Suivre mon colis
                    </Link>
                  </div>
                )}
              </Section>
            </>
          )}

          <Hr style={hr} />

          {/* Items Summary */}
          <Section style={section}>
            <Heading style={h2}>Articles expédiés</Heading>
            {items.map((item, index) => (
              <Text key={index} style={itemText}>
                • {item.productName} × {item.quantity}
              </Text>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Shipping Address */}
          <Section style={section}>
            <Heading style={h2}>Adresse de livraison</Heading>
            <Text style={address}>
              {shippingAddress.firstName} {shippingAddress.lastName}
              <br />
              {shippingAddress.address}
              <br />
              {shippingAddress.addressLine2 && (
                <>
                  {shippingAddress.addressLine2}
                  <br />
                </>
              )}
              {shippingAddress.postalCode} {shippingAddress.city}
              <br />
              {shippingAddress.country}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Support */}
          <Section style={section}>
            <Text style={text}>
              <strong>Besoin d'aide ?</strong>
              <br />
              Notre équipe est là pour vous. Répondez simplement à cet email ou
              contactez-nous à support@nuage.fr
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Merci pour votre confiance !
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Nuage. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles using brand colors
const main = {
  backgroundColor: "#F7F5F3",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
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

const itemText = {
  fontSize: "14px",
  color: "#2C2C2C",
  margin: "0 0 8px 0",
  lineHeight: "20px",
};

const address = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#2C2C2C",
  margin: "0",
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

export default ShippingNotificationEmail;
