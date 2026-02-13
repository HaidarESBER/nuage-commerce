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

interface AbandonedCartEmailProps {
  order: Order;
  unsubscribeUrl: string;
}

/**
 * Abandoned Cart Recovery Email Template
 *
 * Sent when a Stripe checkout session expires (24h after creation).
 * Encourages the customer to return and complete their purchase.
 * Uses brand colors matching existing email templates.
 */
export function AbandonedCartEmail({
  order,
  unsubscribeUrl,
}: AbandonedCartEmailProps) {
  const { items, subtotal, shippingAddress } = order;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const firstName = shippingAddress?.firstName || "";

  return (
    <Html>
      <Head />
      <Preview>
        Votre panier vous attend - Nuage
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={brandName}>Nuage</Heading>
            <Text style={tagline}>L&apos;Art de la Detente</Text>
          </Section>

          {/* Main Message */}
          <Section style={section}>
            <Heading style={h1}>Votre panier vous attend</Heading>
            <Text style={text}>
              {firstName ? `Bonjour ${firstName}, ` : "Bonjour, "}
              nous avons remarque que vous n&apos;avez pas finalise votre
              commande. Vos articles sont toujours disponibles et vous
              attendent !
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Order Items */}
          <Section style={section}>
            <Heading style={h2}>Vos articles</Heading>
            {items.map((item, index) => (
              <div key={index} style={itemRow}>
                <div style={itemInfo}>
                  <Text style={itemName}>{item.productName}</Text>
                  <Text style={itemQuantity}>
                    Quantite : {item.quantity}
                  </Text>
                </div>
                <Text style={itemPrice}>
                  {((item.price * item.quantity) / 100).toFixed(2)} &euro;
                </Text>
              </div>
            ))}
          </Section>

          {/* Subtotal */}
          <Section style={section}>
            <div style={totalRow}>
              <Text style={totalLabel}>Sous-total</Text>
              <Text style={totalValueBold}>
                {(subtotal / 100).toFixed(2)} &euro;
              </Text>
            </div>
          </Section>

          <Hr style={hr} />

          {/* Incentive */}
          <Section style={incentiveSection}>
            <Text style={incentiveText}>
              Utilisez le code <strong>BIENVENUE10</strong> pour 10% de
              remise sur votre commande !
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button href={`${siteUrl}/produits`} style={ctaButton}>
              Reprendre mes achats
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Des questions ? Repondez simplement a cet email.
            </Text>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Nuage. Tous droits reserves.
            </Text>
            <Text style={unsubscribeText}>
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                Se desabonner
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles using brand colors (matching OrderConfirmationEmail)
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

const hr = {
  borderColor: "#E5E5E5",
  margin: "24px 0",
};

const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "16px",
  paddingBottom: "16px",
  borderBottom: "1px solid #E5E5E5",
};

const itemInfo = {
  flex: "1",
};

const itemName = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#2C2C2C",
  margin: "0 0 4px 0",
};

const itemQuantity = {
  fontSize: "12px",
  color: "#6B6B6B",
  margin: "0",
};

const itemPrice = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#2C2C2C",
  margin: "0",
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const totalLabel = {
  fontSize: "14px",
  color: "#6B6B6B",
  margin: "0",
};

const totalValueBold = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#2C2C2C",
  margin: "0",
};

const incentiveSection = {
  textAlign: "center" as const,
  marginBottom: "16px",
  padding: "16px",
  backgroundColor: "#F7F5F3",
  borderRadius: "8px",
};

const incentiveText = {
  fontSize: "14px",
  color: "#2C2C2C",
  margin: "0",
};

const ctaSection = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const ctaButton = {
  backgroundColor: "#D4A5A5",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "12px 32px",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
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

const unsubscribeText = {
  fontSize: "11px",
  color: "#999999",
  margin: "16px 0 0 0",
};

const unsubscribeLink = {
  color: "#999999",
  textDecoration: "underline",
};

export default AbandonedCartEmail;
