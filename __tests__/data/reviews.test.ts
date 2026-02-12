import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getProductReviews,
  getProductRatingStats,
  formatRelativeDate,
} from "@/data/reviews";

describe("getProductReviews", () => {
  it("returns reviews for product 1", () => {
    const reviews = getProductReviews("1");
    expect(reviews.length).toBeGreaterThan(0);
    reviews.forEach((r) => expect(r.productId).toBe("1"));
  });

  it("returns reviews sorted by date (newest first)", () => {
    const reviews = getProductReviews("1");
    for (let i = 1; i < reviews.length; i++) {
      expect(new Date(reviews[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(reviews[i].date).getTime()
      );
    }
  });

  it("returns empty array for product with no reviews", () => {
    const reviews = getProductReviews("nonexistent");
    expect(reviews).toEqual([]);
  });

  it("returns correct count for product 2", () => {
    const reviews = getProductReviews("2");
    expect(reviews.length).toBe(4);
  });
});

describe("getProductRatingStats", () => {
  it("returns null for product with no reviews", () => {
    const stats = getProductRatingStats("nonexistent");
    expect(stats).toBeNull();
  });

  it("returns correct stats for product 1", () => {
    const stats = getProductRatingStats("1");
    expect(stats).not.toBeNull();
    expect(stats!.productId).toBe("1");
    expect(stats!.totalReviews).toBe(5);
    expect(stats!.averageRating).toBeCloseTo(4.6);
  });

  it("has ratingBreakdown that sums to totalReviews", () => {
    const stats = getProductRatingStats("1");
    expect(stats).not.toBeNull();
    const breakdown = stats!.ratingBreakdown;
    const sum = breakdown[5] + breakdown[4] + breakdown[3] + breakdown[2] + breakdown[1];
    expect(sum).toBe(stats!.totalReviews);
  });

  it("has correct breakdown for product 1", () => {
    const stats = getProductRatingStats("1");
    expect(stats).not.toBeNull();
    expect(stats!.ratingBreakdown[5]).toBe(3);
    expect(stats!.ratingBreakdown[4]).toBe(2);
    expect(stats!.ratingBreakdown[3]).toBe(0);
    expect(stats!.ratingBreakdown[2]).toBe(0);
    expect(stats!.ratingBreakdown[1]).toBe(0);
  });

  it("returns correct stats for product 2", () => {
    const stats = getProductRatingStats("2");
    expect(stats).not.toBeNull();
    expect(stats!.totalReviews).toBe(4);
    expect(stats!.ratingBreakdown[3]).toBe(1);
  });
});

describe("formatRelativeDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'Aujourd'hui' for today", () => {
    vi.setSystemTime(new Date("2026-02-11T12:00:00Z"));
    expect(formatRelativeDate("2026-02-11T10:00:00Z")).toBe("Aujourd'hui");
  });

  it("returns 'Hier' for yesterday", () => {
    vi.setSystemTime(new Date("2026-02-11T12:00:00Z"));
    expect(formatRelativeDate("2026-02-10T10:00:00Z")).toBe("Hier");
  });

  it("returns 'Il y a X jours' for 2-6 days ago", () => {
    vi.setSystemTime(new Date("2026-02-11T12:00:00Z"));
    expect(formatRelativeDate("2026-02-08T10:00:00Z")).toBe("Il y a 3 jours");
  });

  it("returns 'Il y a 1 semaine' for 7 days", () => {
    vi.setSystemTime(new Date("2026-02-11T12:00:00Z"));
    expect(formatRelativeDate("2026-02-04T10:00:00Z")).toBe("Il y a 1 semaine");
  });

  it("returns 'Il y a X semaines' for 2+ weeks (pluralized)", () => {
    vi.setSystemTime(new Date("2026-02-11T12:00:00Z"));
    expect(formatRelativeDate("2026-01-25T10:00:00Z")).toBe("Il y a 2 semaines");
  });

  it("returns 'Il y a 1 mois' for ~30 days", () => {
    vi.setSystemTime(new Date("2026-02-11T12:00:00Z"));
    expect(formatRelativeDate("2026-01-10T10:00:00Z")).toBe("Il y a 1 mois");
  });

  it("returns 'Il y a X mois' for several months", () => {
    vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));
    expect(formatRelativeDate("2026-02-11T10:00:00Z")).toBe("Il y a 4 mois");
  });

  it("returns 'Il y a 1 an' for ~365 days", () => {
    vi.setSystemTime(new Date("2027-02-15T12:00:00Z"));
    expect(formatRelativeDate("2026-02-11T10:00:00Z")).toBe("Il y a 1 an");
  });

  it("returns 'Il y a X ans' for multiple years (pluralized)", () => {
    vi.setSystemTime(new Date("2028-06-15T12:00:00Z"));
    expect(formatRelativeDate("2026-02-11T10:00:00Z")).toBe("Il y a 2 ans");
  });
});
