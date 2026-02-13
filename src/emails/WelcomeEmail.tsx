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

interface WelcomeEmailProps {
  unsubscribeUrl: string;
}

/**
 * Welcome Email Template for Newsletter Subscribers
 *
 * Sent when a new user subscribes to the newsletter.
 * Uses brand colors matching OrderConfirmationEmail style.
 */
export function WelcomeEmail({ unsubscribeUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenue dans l&apos;univers Nuage !</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={brandName}>Nuage</Heading>
            <Text style={tagline}>L&apos;Art de la Detente</Text>
          </Section>

          {/* Welcome Message */}
          <Section style={section}>
            <Heading style={h1}>Bienvenue dans l&apos;univers Nuage !</Heading>
            <Text style={text}>
              Merci de vous etre inscrit(e) a notre newsletter. Vous recevrez
              en avant-premiere nos offres exclusives, nos nouvelles
              collections et des contenus autour de la culture chicha.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Button
              href={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/produits`}
              style={ctaButton}
            >
              Decouvrir nos produits
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

export default WelcomeEmail;
