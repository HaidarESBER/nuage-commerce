"use client";

import { useState } from "react";
import { Product, ProductCategory, categoryLabels } from "@/types/product";
import { Button } from "@/components/ui/Button";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (formData: FormData) => Promise<void>;
}

const categories: ProductCategory[] = [
  "chicha",
  "bol",
  "tuyau",
  "charbon",
  "accessoire",
];

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validation
    const name = formData.get("name") as string;
    const priceStr = formData.get("price") as string;

    const newErrors: Record<string, string> = {};

    if (!name || name.trim() === "") {
      newErrors.name = "Le nom est requis";
    }

    if (!priceStr || parseFloat(priceStr) <= 0) {
      newErrors.price = "Le prix doit etre positif";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert cents to euros for display
  const priceInEuros = initialData ? (initialData.price / 100).toFixed(2) : "";
  const compareAtPriceInEuros = initialData?.compareAtPrice
    ? (initialData.compareAtPrice / 100).toFixed(2)
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-primary mb-2"
        >
          Nom du produit *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={initialData?.name ?? ""}
          className={`w-full px-4 py-2 border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent ${
            errors.name ? "border-red-500" : "border-primary/30"
          }`}
          placeholder="Ex: Chicha Crystal Premium"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Short Description */}
      <div>
        <label
          htmlFor="shortDescription"
          className="block text-sm font-medium text-primary mb-2"
        >
          Description courte
        </label>
        <input
          type="text"
          id="shortDescription"
          name="shortDescription"
          defaultValue={initialData?.shortDescription ?? ""}
          className="w-full px-4 py-2 border border-primary/30 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Ex: Chicha en verre souffle main"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-primary mb-2"
        >
          Description complete
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialData?.description ?? ""}
          className="w-full px-4 py-2 border border-primary/30 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent resize-y"
          placeholder="Description detaillee du produit..."
        />
      </div>

      {/* Price Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-primary mb-2"
          >
            Prix (EUR) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            defaultValue={priceInEuros}
            className={`w-full px-4 py-2 border rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent ${
              errors.price ? "border-red-500" : "border-primary/30"
            }`}
            placeholder="49.99"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>

        {/* Compare At Price */}
        <div>
          <label
            htmlFor="compareAtPrice"
            className="block text-sm font-medium text-primary mb-2"
          >
            Prix barre (EUR)
          </label>
          <input
            type="number"
            id="compareAtPrice"
            name="compareAtPrice"
            step="0.01"
            min="0"
            defaultValue={compareAtPriceInEuros}
            className="w-full px-4 py-2 border border-primary/30 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="59.99 (optionnel)"
          />
          <p className="mt-1 text-xs text-primary/60">
            Ancien prix pour afficher une promotion
          </p>
        </div>
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-primary mb-2"
        >
          Categorie
        </label>
        <select
          id="category"
          name="category"
          defaultValue={initialData?.category ?? "chicha"}
          className="w-full px-4 py-2 border border-primary/30 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabels[cat]}
            </option>
          ))}
        </select>
      </div>

      {/* Images */}
      <div>
        <label
          htmlFor="images"
          className="block text-sm font-medium text-primary mb-2"
        >
          Images (URLs)
        </label>
        <input
          type="text"
          id="images"
          name="images"
          defaultValue={initialData?.images?.join(", ") ?? ""}
          className="w-full px-4 py-2 border border-primary/30 rounded-md bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="https://exemple.com/image1.jpg, https://exemple.com/image2.jpg"
        />
        <p className="mt-1 text-xs text-primary/60">
          Separees par des virgules
        </p>
      </div>

      {/* Checkboxes Row */}
      <div className="flex flex-wrap gap-6">
        {/* In Stock */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="inStock"
            defaultChecked={initialData?.inStock ?? true}
            className="w-5 h-5 rounded border-primary/30 text-accent focus:ring-accent"
          />
          <span className="text-sm text-primary">En stock</span>
        </label>

        {/* Featured */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={initialData?.featured ?? false}
            className="w-5 h-5 rounded border-primary/30 text-accent focus:ring-accent"
          />
          <span className="text-sm text-primary">Produit vedette</span>
        </label>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
