import { createHmac } from "crypto";

/**
 * Newsletter unsubscribe token utilities.
 * Uses HMAC-SHA256 signed tokens with CRON_SECRET as the key.
 * Separated from newsletter.ts to avoid "use server" constraint on sync functions.
 */

function getHmacKey(): string {
  return process.env.CRON_SECRET || "dev-secret-key";
}

/**
 * Generate a signed unsubscribe token for an email.
 * Token format: base64url(email:hmac)
 */
export function generateUnsubscribeToken(email: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  const hmac = createHmac("sha256", getHmacKey())
    .update(normalizedEmail)
    .digest("base64url");

  const payload = `${normalizedEmail}:${hmac}`;
  return Buffer.from(payload).toString("base64url");
}

/**
 * Verify an unsubscribe token and extract the email.
 * Returns the email if valid, null if invalid.
 */
export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const separatorIndex = decoded.lastIndexOf(":");
    if (separatorIndex === -1) return null;

    const email = decoded.substring(0, separatorIndex);
    const providedHmac = decoded.substring(separatorIndex + 1);

    const expectedHmac = createHmac("sha256", getHmacKey())
      .update(email)
      .digest("base64url");

    if (providedHmac !== expectedHmac) return null;

    return email;
  } catch {
    return null;
  }
}
