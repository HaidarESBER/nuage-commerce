import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import { Order } from "@/types/order";

interface OrderConfirmationEmailProps {
  order: Order;
}

/**
 * Order Confirmation Email Template
 *
 * Sent immediately after order is placed.
 * Uses brand colors and elegant French style.
 */
export function OrderConfirmationEmail({ order }: OrderConfirmationEmailProps) {
  const { orderNumber, items, subtotal, shipping, total, shippingAddress } = order;

  return (
    <Html>
      <Head />
      <Preview>Votre commande {orderNumber} a été confirmée - Nuage</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={brandName}>Nuage</Heading>
            <Text style={tagline}>L'Art de la Détente</Text>
          </Section>

          {/* Success Message */}
          <Section style={section}>
            <Heading style={h1}>Merci pour votre commande !</Heading>
            <Text style={text}>
              Votre commande a été confirmée avec succès. Nous préparons vos articles avec soin.
            </Text>
            <Text style={orderNumberText}>
              Numéro de commande : <strong>{orderNumber}</strong>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Order Items */}
          <Section style={section}>
            <Heading style={h2}>Détails de votre commande</Heading>
            {items.map((item, index) => (
              <div key={index} style={itemRow}>
                <div style={itemInfo}>
                  <Text style={itemName}>{item.productName}</Text>
                  <Text style={itemQuantity}>Quantité : {item.quantity}</Text>
                </div>
                <Text style={itemPrice}>
                  {((item.price * item.quantity) / 100).toFixed(2)} €
                </Text>
              </div>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Totals */}
          <Section style={section}>
            <div style={totalRow}>
              <Text style={totalLabel}>Sous-total</Text>
              <Text style={totalValue}>{(subtotal / 100).toFixed(2)} €</Text>
            </div>
            <div style={totalRow}>
              <Text style={totalLabel}>Frais de livraison</Text>
              <Text style={totalValue}>
                {(shipping / 100).toFixed(2)} €
              </Text>
            </div>
            <div style={totalRow}>
              <Text style={totalLabelBold}>Total</Text>
              <Text style={totalValueBold}>{(total / 100).toFixed(2)} €</Text>
            </div>
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

          {/* Next Steps */}
          <Section style={section}>
            <Heading style={h2}>Prochaines étapes</Heading>
            <Text style={text}>
              1. Nous préparons votre commande<br />
              2. Vous recevrez un email dès que votre colis sera expédié<br />
              3. Suivez votre livraison avec le numéro de suivi fourni
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Des questions ? Répondez simplement à cet email.
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

const totalValue = {
  fontSize: "14px",
  color: "#2C2C2C",
  margin: "0",
};

const totalLabelBold = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#2C2C2C",
  margin: "0",
};

const totalValueBold = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#2C2C2C",
  margin: "0",
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

export default OrderConfirmationEmail;
