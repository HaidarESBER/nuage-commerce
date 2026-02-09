"use client";

import { ShippingAddress } from "@/types/checkout";

interface ShippingFormProps {
  address: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
  errors: Partial<Record<keyof ShippingAddress, string>>;
}

/**
 * ShippingForm component for collecting shipping address
 *
 * Features:
 * - All fields in French
 * - Client-side validation feedback
 * - Controlled inputs
 */
export function ShippingForm({ address, onChange, errors }: ShippingFormProps) {
  const handleChange = (
    field: keyof ShippingAddress,
    value: string
  ) => {
    onChange({ ...address, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-xl text-primary mb-4">
        Adresse de livraison
      </h2>

      {/* Name row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-primary mb-1"
          >
            Prenom *
          </label>
          <input
            type="text"
            id="firstName"
            value={address.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className={`w-full px-4 py-3 rounded-[--radius-button] border ${
              errors.firstName
                ? "border-red-500 focus:ring-red-500"
                : "border-background-secondary focus:ring-accent"
            } bg-background text-primary focus:outline-none focus:ring-2`}
            placeholder="Jean"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-primary mb-1"
          >
            Nom *
          </label>
          <input
            type="text"
            id="lastName"
            value={address.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className={`w-full px-4 py-3 rounded-[--radius-button] border ${
              errors.lastName
                ? "border-red-500 focus:ring-red-500"
                : "border-background-secondary focus:ring-accent"
            } bg-background text-primary focus:outline-none focus:ring-2`}
            placeholder="Dupont"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Contact row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-primary mb-1"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={address.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full px-4 py-3 rounded-[--radius-button] border ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-background-secondary focus:ring-accent"
            } bg-background text-primary focus:outline-none focus:ring-2`}
            placeholder="jean.dupont@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-primary mb-1"
          >
            Telephone *
          </label>
          <input
            type="tel"
            id="phone"
            value={address.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={`w-full px-4 py-3 rounded-[--radius-button] border ${
              errors.phone
                ? "border-red-500 focus:ring-red-500"
                : "border-background-secondary focus:ring-accent"
            } bg-background text-primary focus:outline-none focus:ring-2`}
            placeholder="06 12 34 56 78"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-primary mb-1"
        >
          Adresse *
        </label>
        <input
          type="text"
          id="address"
          value={address.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className={`w-full px-4 py-3 rounded-[--radius-button] border ${
            errors.address
              ? "border-red-500 focus:ring-red-500"
              : "border-background-secondary focus:ring-accent"
          } bg-background text-primary focus:outline-none focus:ring-2`}
          placeholder="123 Rue de la Paix"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      {/* Address line 2 */}
      <div>
        <label
          htmlFor="addressLine2"
          className="block text-sm font-medium text-primary mb-1"
        >
          Complement d&apos;adresse
        </label>
        <input
          type="text"
          id="addressLine2"
          value={address.addressLine2 || ""}
          onChange={(e) => handleChange("addressLine2", e.target.value)}
          className="w-full px-4 py-3 rounded-[--radius-button] border border-background-secondary bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Appartement, etage, batiment..."
        />
      </div>

      {/* City and postal code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-primary mb-1"
          >
            Ville *
          </label>
          <input
            type="text"
            id="city"
            value={address.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className={`w-full px-4 py-3 rounded-[--radius-button] border ${
              errors.city
                ? "border-red-500 focus:ring-red-500"
                : "border-background-secondary focus:ring-accent"
            } bg-background text-primary focus:outline-none focus:ring-2`}
            placeholder="Paris"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-primary mb-1"
          >
            Code postal *
          </label>
          <input
            type="text"
            id="postalCode"
            value={address.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
            maxLength={5}
            className={`w-full px-4 py-3 rounded-[--radius-button] border ${
              errors.postalCode
                ? "border-red-500 focus:ring-red-500"
                : "border-background-secondary focus:ring-accent"
            } bg-background text-primary focus:outline-none focus:ring-2`}
            placeholder="75001"
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>
          )}
        </div>
      </div>

      {/* Country */}
      <div>
        <label
          htmlFor="country"
          className="block text-sm font-medium text-primary mb-1"
        >
          Pays *
        </label>
        <input
          type="text"
          id="country"
          value={address.country}
          onChange={(e) => handleChange("country", e.target.value)}
          className="w-full px-4 py-3 rounded-[--radius-button] border border-background-secondary bg-background-secondary text-muted focus:outline-none cursor-not-allowed"
          disabled
        />
        <p className="mt-1 text-xs text-muted">
          Livraison uniquement en France metropolitaine
        </p>
      </div>
    </div>
  );
}
