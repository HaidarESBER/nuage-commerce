/**
 * Checkout type definitions for Nuage e-commerce
 */

/**
 * Shipping address information
 */
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
}

/**
 * Default shipping address with France as default country
 */
export const defaultShippingAddress: ShippingAddress = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  country: "France",
};

/**
 * Checkout form data submitted by user
 */
export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  notes?: string;
}

/**
 * Validation error for a form field
 */
export interface FieldError {
  field: keyof ShippingAddress | "notes";
  message: string;
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns true if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate French postal code (5 digits)
 * @param postalCode - Postal code to validate
 * @returns true if valid French postal code
 */
export function isValidFrenchPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^[0-9]{5}$/;
  return postalCodeRegex.test(postalCode);
}

/**
 * Validate French phone number
 * Accepts formats: 0612345678, 06 12 34 56 78, +33612345678
 * @param phone - Phone number to validate
 * @returns true if valid phone format
 */
export function isValidPhone(phone: string): boolean {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, "");
  // French phone: 10 digits starting with 0, or +33 with 9 digits
  const phoneRegex = /^(0[1-9][0-9]{8}|\+33[1-9][0-9]{8})$/;
  return phoneRegex.test(cleaned);
}
