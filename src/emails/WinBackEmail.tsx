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

interface WinBackEmailProps {
  firstName: string;
  products: Array<{ name: string; price: number }>;
  unsubscribeUrl: string;
}

/**
 * Win-Back Email Template for Re-engagement Campaigns
 *
 * Sent to customers who haven't ordered in 30+ days.
 * Shows recent/featured products as recommendations.
 * Uses brand colors matching existing email templates.
 */
export function WinBackEmail({
  firstName,
  products,
  unsubscribeUrl,
}: WinBackEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Preview>
        Cela fait un moment... decouvrez nos nouveautes - Nuage
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
            <Heading style={h1}>Cela fait un moment...</Heading>
            <Text style={text}>
              {firstName ? `Bonjour ${firstName}, ` : "Bonjour, "}
              vous nous manquez ! Cela fait un moment depuis votre derniere
              visite. Nous avons de belles nouveautes qui pourraient vous
              plaire.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Product Recommendations */}
          {products.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>Nos dernieres nouveautes</Heading>
              {products.map((product, index) => (
                <div key={index} style={productRow}>
                  <Text style={productName}>{product.name}</Text>
                  <Text style={productPrice}>
                    {(product.price / 100).toFixed(2)} &euro;
                  </Text>
                </div>
              ))}
            </Section>
          )}

          <Hr style={hr} />

          {/* Incentive */}
          <Section style={incentiveSection}>
            <Text style={incentiveText}>
              Code exclusif <strong>RETOUR15</strong> pour 15% de remise sur
              votre prochaine commande !
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button href={`${siteUrl}/produits`} style={ctaButton}>
              Decouvrir les nouveautes
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

const productRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
  paddingBottom: "12px",
  borderBottom: "1px solid #E5E5E5",
};

const productName = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#2C2C2C",
  margin: "0",
  flex: "1",
};

const productPrice = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#D4A5A5",
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

export default WinBackEmail;
