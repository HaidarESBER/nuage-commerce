import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { Review, ProductRatingStats } from '@/data/reviews'; // Import types

/**
 * Get reviews for a specific product from database
 */
export async function getProductReviews(productId: string): Promise<Review[]> {
  const supabase = createAdminClient(); // Public read, no auth needed

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      product_id,
      rating,
      comment,
      verified_purchase,
      created_at,
      profiles!user_id (
        first_name,
        last_name
      )
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform to Review format
  return data.map((row: any) => ({
    id: row.id,
    productId: row.product_id,
    authorName: `${row.profiles.first_name} ${row.profiles.last_name.charAt(0)}.`,
    rating: row.rating,
    comment: row.comment,
    date: row.created_at,
    verifiedPurchase: row.verified_purchase,
  }));
}

/**
 * Calculate rating statistics for a product
 */
export async function getProductRatingStats(productId: string): Promise<ProductRatingStats | null> {
  const reviews = await getProductReviews(productId);

  if (reviews.length === 0) return null;

  const totalReviews = reviews.length;
  const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = sumRatings / totalReviews;

  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const review of reviews) {
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
 * Create a new review for a product
 */
export async function createReview({
  productId,
  userId,
  rating,
  comment,
}: {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const supabase = await createClient(); // User context for RLS

  // Check if user has purchased this product (verified purchase)
  const { data: orders } = await supabase
    .from('order_items')
    .select('id, orders!inner(user_email)')
    .eq('product_id', productId)
    .limit(1);

  const verifiedPurchase = orders && orders.length > 0;

  // Insert review
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: productId,
      user_id: userId,
      rating,
      comment,
      verified_purchase: verifiedPurchase,
    })
    .select(`
      id,
      product_id,
      rating,
      comment,
      verified_purchase,
      created_at,
      profiles!user_id (
        first_name,
        last_name
      )
    `)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    productId: data.product_id,
    authorName: `${(data.profiles as any).first_name} ${(data.profiles as any).last_name.charAt(0)}.`,
    rating: data.rating,
    comment: data.comment,
    date: data.created_at,
    verifiedPurchase: data.verified_purchase,
  };
}
