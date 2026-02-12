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
  const [imagePreview, setImagePreview] = useState<string[]>(
    initialData?.images ?? []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validation
    const name = formData.get("name") as string;
    const priceStr = formData.get("price") as string;
    const stockLevelStr = formData.get("stockLevel") as string;

    const newErrors: Record<string, string> = {};

    if (!name || name.trim() === "") {
      newErrors.name = "Le nom est requis";
    }

    if (!priceStr || parseFloat(priceStr) <= 0) {
      newErrors.price = "Le prix doit être positif";
    }

    if (stockLevelStr && parseInt(stockLevelStr) < 0) {
      newErrors.stockLevel = "Le stock ne peut pas être négatif";
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

  // Handle image URL input change for preview
  const handleImageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const urls = e.target.value
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);
    setImagePreview(urls);
  };

  // Convert cents to euros for display
  const priceInEuros = initialData ? (initialData.price / 100).toFixed(2) : "";
  const compareAtPriceInEuros = initialData?.compareAtPrice
    ? (initialData.compareAtPrice / 100).toFixed(2)
    : "";

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (!initialData?.compareAtPrice || !initialData?.price) return null;
    const discount = Math.round(
      ((initialData.compareAtPrice - initialData.price) /
        initialData.compareAtPrice) *
        100
    );
    return discount > 0 ? discount : null;
  };

  const discount = getDiscountPercentage();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Main Information Section */}
      <div className="bg-white rounded-lg border border-primary/10 p-6">
        <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
          <span className="text-2xl">📝</span>
          Informations principales
        </h3>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-primary mb-2"
            >
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={initialData?.name ?? ""}
              className={`w-full px-4 py-3 border rounded-lg bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
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
              className="w-full px-4 py-3 border border-primary/30 rounded-lg bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              placeholder="Ex: Chicha en verre soufflé main, design moderne"
              maxLength={150}
            />
            <p className="mt-1 text-xs text-primary/60">
              Max 150 caractères - Affiché sur les cartes produit
            </p>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-primary mb-2"
            >
              Description complète
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              defaultValue={initialData?.description ?? ""}
              className="w-full px-4 py-3 border border-primary/30 rounded-lg bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent resize-y transition-all"
              placeholder="Description détaillée du produit, caractéristiques, utilisation, etc."
            />
            <p className="mt-1 text-xs text-primary/60">
              Supporte le formatage markdown
            </p>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-primary mb-2"
            >
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              defaultValue={initialData?.category ?? "chicha"}
              className="w-full px-4 py-3 border border-primary/30 rounded-lg bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-all"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white rounded-lg border border-primary/10 p-6">
        <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
          <span className="text-2xl">💰</span>
          Prix et promotion
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-primary mb-2"
            >
              Prix de vente (EUR) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                defaultValue={priceInEuros}
                className={`w-full px-4 py-3 border rounded-lg bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                  errors.price ? "border-red-500" : "border-primary/30"
                }`}
                placeholder="49.99"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 text-sm">
                €
              </span>
            </div>
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
              Prix barré (EUR)
            </label>
            <div className="relative">
              <input
                type="number"
                id="compareAtPrice"
                name="compareAtPrice"
                step="0.01"
                min="0"
                defaultValue={compareAtPriceInEuros}
                className="w-full px-4 py-3 border border-primary/30 rounded-lg bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                placeholder="59.99"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 text-sm">
                €
              </span>
            </div>
            <p className="mt-1 text-xs text-primary/60">
              Ancien prix pour afficher une promotion
              {discount && (
                <span className="ml-2 text-accent font-semibold">
                  (-{discount}%)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stock Section */}
      <div className="bg-white rounded-lg border border-primary/10 p-6">
        <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
          <span className="text-2xl">📦</span>
          Stock et disponibilité
        </h3>

        <div className="space-y-6">
          {/* Stock Level */}
          <div>
            <label
              htmlFor="stockLevel"
              className="block text-sm font-medium text-primary mb-2"
            >
              Niveau de stock
            </label>
            <input
              type="number"
              id="stockLevel"
              name="stockLevel"
              min="0"
              defaultValue={initialData?.stockLevel ?? 0}
              className={`w-full px-4 py-3 border rounded-lg bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                errors.stockLevel ? "border-red-500" : "border-primary/30"
              }`}
              placeholder="0"
            />
            {errors.stockLevel && (
              <p className="mt-1 text-sm text-red-500">{errors.stockLevel}</p>
            )}
            <div className="mt-2 text-xs space-y-1">
              <p className="text-red-600">• 0 = Rupture de stock</p>
              <p className="text-orange-600">• 1-5 = Stock urgent</p>
              <p className="text-yellow-600">• 6-10 = Stock limité</p>
              <p className="text-green-600">• 11+ = En stock</p>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6 p-4 bg-secondary/20 rounded-lg">
            {/* In Stock */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="inStock"
                defaultChecked={initialData?.inStock ?? true}
                className="w-5 h-5 rounded border-primary/30 text-accent focus:ring-accent cursor-pointer"
              />
              <span className="text-sm font-medium text-primary">
                Disponible à la vente
              </span>
            </label>

            {/* Featured */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={initialData?.featured ?? false}
                className="w-5 h-5 rounded border-primary/30 text-accent focus:ring-accent cursor-pointer"
              />
              <span className="text-sm font-medium text-primary">
                ⭐ Produit vedette
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-white rounded-lg border border-primary/10 p-6">
        <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
          <span className="text-2xl">🖼️</span>
          Images du produit
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium text-primary mb-2"
            >
              URLs des images
            </label>
            <textarea
              id="images"
              name="images"
              rows={3}
              defaultValue={initialData?.images?.join(", ") ?? ""}
              onChange={handleImageChange}
              className="w-full px-4 py-3 border border-primary/30 rounded-lg bg-background text-primary focus:outline-none focus:ring-2 focus:ring-accent resize-y transition-all font-mono text-sm"
              placeholder="https://exemple.com/image1.jpg, https://exemple.com/image2.jpg"
            />
            <p className="mt-1 text-xs text-primary/60">
              Séparez plusieurs URLs par des virgules. La première image sera l'image principale.
            </p>
          </div>

          {/* Image Preview */}
          {imagePreview.length > 0 && (
            <div>
              <p className="text-sm font-medium text-primary mb-3">
                Aperçu ({imagePreview.length} image{imagePreview.length > 1 ? "s" : ""})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreview.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border border-primary/20 bg-secondary/20"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='14'%3EImage invalide%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-accent text-background text-xs px-2 py-1 rounded font-medium">
                        Principal
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-primary/10">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 text-base"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Enregistrement...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>✓</span>
              {initialData ? "Mettre à jour" : "Créer le produit"}
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
