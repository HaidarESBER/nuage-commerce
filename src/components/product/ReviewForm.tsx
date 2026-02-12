"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarRating } from "./StarRating";

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReviewForm({ productId, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (rating === 0) {
      setError("Veuillez sélectionner une note");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Le commentaire doit contenir au moins 10 caractères");
      return;
    }

    if (comment.trim().length > 1000) {
      setError("Le commentaire ne peut pas dépasser 1000 caractères");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      // Success
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit}
      className="bg-background-secondary p-6 rounded-[--radius-card] mb-6"
    >
      <h3 className="text-xl font-bold text-primary mb-4">Écrire un avis</h3>

      {/* Rating selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-primary mb-2">
          Votre note *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-3xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent rounded"
              aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
            >
              <span className={star <= displayRating ? "text-accent" : "text-mist"}>
                ★
              </span>
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-muted self-center">
              {rating}/5
            </span>
          )}
        </div>
      </div>

      {/* Comment textarea */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-primary mb-2">
          Votre avis *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience avec ce produit..."
          rows={6}
          maxLength={1000}
          className="w-full px-4 py-3 bg-background border border-mist rounded-[--radius-input] text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
        <div className="text-xs text-muted mt-1 text-right">
          {comment.length}/1000 caractères
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-primary text-background rounded-[--radius-button] hover:bg-accent hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Envoi en cours..." : "Publier mon avis"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 bg-background border border-mist text-primary rounded-[--radius-button] hover:bg-mist transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
      </div>

      <p className="text-xs text-muted mt-4">
        * Champs obligatoires. Votre avis sera publié après vérification.
      </p>
    </motion.form>
  );
}
