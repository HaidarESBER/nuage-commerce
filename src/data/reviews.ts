export interface Review {
  id: string;
  productId: string;
  authorName: string; // First name + last initial (e.g., "Marie D.")
  rating: number; // 1-5
  comment: string;
  date: string; // ISO timestamp
  verifiedPurchase: boolean;
  photos?: string[]; // Customer review photos
}

export interface ProductRatingStats {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

/**
 * Seed reviews - authentic French language reviews for credibility
 */
export const reviews: Review[] = [
  // Chicha Crystal Premium (product id: 1) - mostly positive
  {
    id: "r1",
    productId: "1",
    authorName: "M***e D.",
    rating: 5,
    comment:
      "Excellent produit, livraison rapide. Le design est vraiment élégant et la qualité est au rendez-vous. Le verre soufflé main fait toute la différence.",
    date: "2025-11-15T14:30:00Z",
    verifiedPurchase: true,
  },
  {
    id: "r2",
    productId: "1",
    authorName: "T****s L.",
    rating: 5,
    comment:
      "Superbe chicha, encore plus belle en vrai qu'en photo. La fumée est très douce et agréable. Je recommande sans hésiter.",
    date: "2025-12-03T09:15:00Z",
    verifiedPurchase: true,
  },
  {
    id: "r3",
    productId: "1",
    authorName: "S****e B.",
    rating: 4,
    comment:
      "Très bonne qualité, design magnifique. Un peu fragile à manipuler mais c'est normal pour du verre. Attention lors du nettoyage.",
    date: "2025-10-28T16:45:00Z",
    verifiedPurchase: true,
  },
  {
    id: "r4",
    productId: "1",
    authorName: "L***s M.",
    rating: 5,
    comment:
      "Parfait pour mon salon, ça fait très classe. La qualité de fumée est vraiment supérieure à mes chichas précédentes.",
    date: "2025-09-18T11:20:00Z",
    verifiedPurchase: true,
  },
  {
    id: "r5",
    productId: "1",
    authorName: "C*****e R.",
    rating: 4,
    comment:
      "Belle chicha, bon rapport qualité-prix. Le seul bémol c'est qu'elle prend un peu de place mais c'est le prix de la stabilité.",
    date: "2026-01-08T19:30:00Z",
    verifiedPurchase: true,
  },

  // Chicha Classic Noir (product id: 2) - good mix
  {
    id: "r6",
    productId: "2",
    authorName: "A*******e P.",
    rating: 5,
    comment:
      "Un classique indémodable. Le noir mat est vraiment élégant et facile d'entretien. Très content de mon achat.",
    date: "2025-08-22T13:00:00Z",
    verifiedPurchase: true,
  },
  {
    id: "r7",
    productId: "2",
    authorName: "L*a F.",
    rating: 4,
    comment:
      "Bonne chicha pour le prix. Simple mais efficace, parfait pour débuter ou pour une utilisation régulière.",
    date: "2025-11-05T10:30:00Z",
    verifiedPurchase: true,
  },
  {
    id: "r8",
    productId: "2",
    authorName: "J****n K.",
    rating: 5,
    comment:
      "Impeccable ! Livraison soignée, produit conforme. Je l'utilise tous les jours depuis 3 semaines, aucun problème.",
    date: "2025-12-14T15:45:00Z",
    verifiedPurchase: true,
  },
  {
    id: "r9",
    productId: "2",
    authorName: "E**a S.",
    rating: 3,
    comment:
      "Correct mais j'attendais un peu mieux pour le prix. La fumée est bonne mais le design est assez basique.",
    date: "2025-07-19T12:10:00Z",
    verifiedPurchase: true,
  },

  // Bol Céramique Artisanal (product id: 4) - very positive
  {
    id: "r10",
    productId: "4",
    authorName: "A*****e V.",
    rating: 5,
    comment:
      "Magnifique travail artisanal. Chaque bol est unique, le mien a de jolies variations de couleur. Excellente rétention de chaleur.",
    date: "2025-10-11T14:20:00Z",
    verifiedPurchase: true,
  },
  {
    id: "r11",
    productId: "4",
    authorName: "C***é M.",
    rating: 5,
    comment:
      "J'adore ce bol ! La qualité est vraiment au rendez-vous, ça change des bols industriels. Un peu plus cher mais ça vaut le coup.",
    date: "2025-09-25T09:50:00Z",
    verifiedPurchase: true,
  },
  {
    id: "r12",
    productId: "4",
    authorName: "N*****s H.",
    rating: 4,
    comment:
      "Très bon bol, la céramique garde bien la chaleur. Seul petit défaut: un peu lourd, mais c'est la contrepartie de la qualité.",
    date: "2026-01-12T16:30:00Z",
    verifiedPurchase: true,
  },

  // Pince à Charbon Pro (product id: 7) - positive with minor comments
  {
    id: "r13",
    productId: "7",
    authorName: "M****e B.",
    rating: 5,
    comment:
      "Super pince, très solide. Le manche anti-chaleur est vraiment pratique, plus de doigts brûlés !",
    date: "2025-08-07T11:40:00Z",
    verifiedPurchase: true,
  },
  {
    id: "r14",
    productId: "7",
    authorName: "S***h L.",
    rating: 4,
    comment:
      "Fait le job, bonne prise en main. La longueur est idéale pour manipuler les charbons en sécurité.",
    date: "2025-11-30T13:25:00Z",
    verifiedPurchase: true,
  },
];

/**
 * Get reviews for a specific product
 */
export function getProductReviews(productId: string): Review[] {
  return reviews
    .filter((review) => review.productId === productId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Most recent first
}

/**
 * Calculate rating statistics for a product
 */
export function getProductRatingStats(productId: string): ProductRatingStats | null {
  const productReviews = getProductReviews(productId);

  if (productReviews.length === 0) {
    return null;
  }

  const totalReviews = productReviews.length;
  const sumRatings = productReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = sumRatings / totalReviews;

  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const review of productReviews) {
    ratingBreakdown[review.rating as keyof typeof ratingBreakdown]++;
  }

  return {
    productId,
    averageRating,
    totalReviews,
    ratingBreakdown,
  };
}

/**
 * Batch calculate rating statistics for multiple products (optimized)
 * Avoids N+1 query pattern by grouping reviews in a single pass
 */
export function getBatchProductRatingStats(productIds: string[]): Record<string, ProductRatingStats> {
  // Group reviews by product in a single pass
  const reviewsByProduct = new Map<string, Review[]>();

  for (const review of reviews) {
    if (productIds.includes(review.productId)) {
      const existing = reviewsByProduct.get(review.productId) || [];
      existing.push(review);
      reviewsByProduct.set(review.productId, existing);
    }
  }

  // Calculate stats for each product
  const statsMap: Record<string, ProductRatingStats> = {};

  for (const [productId, productReviews] of reviewsByProduct) {
    if (productReviews.length === 0) continue;

    const totalReviews = productReviews.length;
    const sumRatings = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = sumRatings / totalReviews;

    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const review of productReviews) {
      ratingBreakdown[review.rating as keyof typeof ratingBreakdown]++;
    }

    statsMap[productId] = {
      productId,
      averageRating,
      totalReviews,
      ratingBreakdown,
    };
  }

  return statsMap;
}

/**
 * Anonymize a name by showing only first and last letters with asterisks in between
 * Example: "Marie D." becomes "M***e D."
 */
export function anonymizeName(name: string): string {
  return name.split(' ').map(part => {
    if (part.length <= 2) {
      return part; // Keep short parts as-is (like "D.")
    }
    const first = part[0];
    const last = part[part.length - 1];
    const middle = '*'.repeat(part.length - 2);
    return `${first}${middle}${last}`;
  }).join(' ');
}

/**
 * Format date as relative time in French
 */
export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Aujourd'hui";
  } else if (diffInDays === 1) {
    return "Hier";
  } else if (diffInDays < 7) {
    return `Il y a ${diffInDays} jours`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `Il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `Il y a ${months} mois`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `Il y a ${years} an${years > 1 ? "s" : ""}`;
  }
}
