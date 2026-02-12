# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-11)

**Core value:** The brand looks so premium and legitimate that visitors trust it instantly — visual identity drives conversion.
**Current focus:** v4.0 UX Heaven — Elevate user experience to premium standards

## Current Position

Phase: 18 of 19 (Wishlist & Recommendations)
Plan: 2 of 3 in current phase (COMPLETE)
Status: Complete
Last activity: 2026-02-12 — Completed 18-02-PLAN.md (Browse History Tracking)

Progress: ███░░░░░░░ 12% (4/34 plans in v4.0)

## Milestone Summary

**v4.0 UX Heaven (in progress)**

- 5 phases planned (15-19), 1 complete
- Focus: Smart search, social proof, accounts, recommendations, mobile excellence
- Started: 2026-02-12

**v3.0 Content & Growth (complete)**

- 1 phase planned (14), 2 plans total
- Focus: Blog & content marketing for organic traffic
- Started: 2026-02-12, Completed: 2026-02-12

**v2.0 Production Launch (complete)**

- 5 phases planned (9-13), 5 complete
- Focus: Payments, database, email, product sourcing, AI curation
- Started: 2026-02-11, Completed: 2026-02-12

**v1.1 Enhanced Experience shipped 2026-02-09**

- 4 phases, 10 plans executed
- Animations, interactions, trust signals, performance

**v1.0 MVP shipped 2026-02-09**

- 4 phases, 11 plans executed
- 4,540 lines TypeScript, 80 files

## Performance Metrics

**Velocity:**
- Total plans completed: 37
- Average duration: 9.7 min
- Total execution time: 6.0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation-brand | 3/3 | 23 min | 7.7 min |
| 02-product-catalog | 2/2 | 25 min | 12.5 min |
| 03-shopping-experience | 3/3 | 45 min | 15 min |
| 04-launch-prep | 3/3 | 22 min | 7.3 min |
| 05-motion-foundation | 1/1 | 5 min | 5 min |
| 06-product-experience | 1/1 | 8 min | 8 min |
| 07-cart-checkout-polish | 1/1 | 8 min | 8 min |
| 08-character-delight | 8/8 | 92 min | 11.5 min |
| 09-supabase-migration-auth | 3/3 | 25 min | 8.3 min |
| 10-stripe-checkout | 2/2 | 18 min | 9 min |
| 11-email-notifications | 2/2 | 7 min | 3.5 min |
| 12-product-sourcing-pipeline | 2/2 | 10 min | 5 min |
| 13-ai-curation-automation | 2/2 | 27 min | 13.5 min |
| 14-blog-content-marketing | 2/2 | 14 min | 7 min |
| 15-smart-search-filtering | 2/3 | 40 min | 20 min |
| 16-social-proof-reviews | 2/2 | 20 min | 10 min |
| 17-customer-accounts-profiles | 1/1 | 45 min | 45 min |
| 18-wishlist-recommendations | 2/3 | 25 min | 12.5 min |

## Accumulated Context

### Roadmap Evolution

- Milestone v1.1 created: Enhanced Experience with animations and dynamism, 4 phases (Phase 5-8)
- Milestone v2.0 created: Production Launch with payments, database, sourcing, 5 phases (Phase 9-13)
- Milestone v3.0 created: Content & Growth with blog & content marketing, 1 phase (Phase 14)
- Milestone v4.0 created: UX Heaven with search, social proof, accounts, recommendations, mobile, 5 phases (Phase 15-19)

### Key Decisions

**v1.0:** Brand (Nuage), typography (Cormorant Garamond + Inter), colors (Charcoal/Mist/Stone/Blush/Cream), file-based JSON, cents-based pricing.

**v1.1:** 300ms transitions, scroll-once animations, hybrid SSG, spring animations, mobile gestures, guest checkout, shipping tiers, SEO structured data.

**v2.0 (09-01):** @supabase/ssr for cookie-based sessions in Next.js 15, snake_case DB columns, RLS-first security (public product reads, admin writes via profiles.is_admin), service role key for server admin ops.

**v2.0 (11-01):** Server-only email service wrapping Resend SDK (never throws), status-based email content switching via getStatusContent helper.

**v2.0 (11-02):** Fire-and-forget email pattern for all order lifecycle triggers, previousStatus captured before update for status email context.

**v2.0 (10-01):** Stripe redirect mode (not embedded), DB-verified pricing in checkout API, dynamic payment methods (auto Carte Bancaire/Apple Pay), pending_payment status before pending in flow.

**v2.0 (13-01):** claude-sonnet-4-5-20250929 for translation (quality/cost balance), createAdminClient for server-side RLS bypass, effective-value pattern (curated > AI > raw) for product display fields.

**v2.0 (09-02):** createAdminClient for ALL queries (reads + writes) to avoid cookies() in static generation, toProduct/toOrder mapping layer preserves interfaces unchanged, order items in separate table with Supabase join queries, updateOrderStripeData helper replaces direct file I/O.

**v2.0 (09-03):** supabase.auth.getUser() for server-validated middleware auth (not getSession), broadened middleware matcher for consistent session refresh, password validation kept server-side before Supabase signUp.

**v2.0 (13-02):** 6-hour Vercel Cron interval for batch translation, CRON_SECRET authentication for production cron endpoint, server actions with revalidatePath for admin form mutations.

**v3.0 (14-01):** String-based remark/rehype plugin names for Turbopack compatibility in Next.js 16, safeJsonLd helper with XSS prevention for Article schema, blog content in content/blog/ directory.

**v3.0 (14-02):** Dual MDX metadata pattern (YAML frontmatter for gray-matter listing + export const metadata for dynamic import), remark-frontmatter to suppress YAML rendering, @/content/* path alias for content directory imports.

**v2.0 (12-01):** Cheerio for lightweight HTML parsing (no headless browser), adapter pattern for site-specific extraction (SourceAdapter interface with canHandle/extract), URL-based deduplication (source_url UNIQUE constraint), rate limiting (1s delay between batch requests), failed scrapes saved with error_message for admin debugging.

**v2.0 (12-02):** Admin scraper UI with single/bulk URL input, server actions with revalidatePath for mutations, sendToCurationAction bridges scraped_products to product_drafts via createDraftFromScrapedProduct, automated scrape cron (12-hour interval) with SCRAPE_URLS environment config, full pipeline integration (scrape → draft → AI translate → curate → publish).

**v4.0 (15-01):** FlexSearch client-side search (zero hosting costs), LatinBalance encoder for French text normalization, resolution: 9 with bidirectional context for fuzzy matching, buildSearchQuery helper with filters/sorting/facets/pagination.

**v4.0 (15-02):** URL searchParams pattern for filter state (bookmarkable, SEO-friendly), use-debounce with 300ms delay for search input, uncontrolled input with defaultValue (Next.js best practice), Suspense boundaries for streaming search/filters/grid, reset pagination to page 1 on search/filter changes.

**v4.0 (16-01):** Reviews table in Supabase with RLS (public read, auth write own), verified_purchase flag from order_items lookup, createAdminClient for public reads (bypasses RLS), createClient for writes (enforces RLS), server-side review data fetching with props to client components.

**v4.0 (16-02):** Client-side validation before API submission (rating required, 10-1000 chars), optimistic UI pattern (form closes immediately, router.refresh() re-fetches), AnimatePresence for smooth form transitions, API-enforced authentication (no client-side auth checks).

**v4.0 (16-03):** localStorage-based recently viewed tracking (max 6 items, client-side only), RecentlyViewed horizontal carousel component with stagger animation, TrendingBadge overlay on featured products (fire emoji + "Tendance"), automatic product view tracking on detail page mount, privacy-friendly social proof (no server tracking).

**v4.0 (17-01):** JSONB columns for profiles (saved_addresses array, preferences object), UUID for address IDs via crypto.randomUUID(), server-side default address enforcement (only one default), password validation with 12+ chars + complexity requirements, modal-based address CRUD UI, French postal code validation (5 digits).

**v4.0 (18-02):** browse_history table with auto-cleanup trigger (90-day retention), RLS policies for user privacy and admin analytics, fire-and-forget tracking pattern via ProductViewTracker component, 30-minute deduplication window, opt-out privacy model with track_browsing preference, authenticated-users-only tracking.

### Deferred Issues

- Legal pages content (already in place per user)
- Database migration → Phase 9 (now planned)
- Payment integration → Phase 10 (now planned)
- Email notifications → Phase 11 (now planned)
- Admin authentication → Phase 9 (now planned)

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-02-12
Stopped at: Completed 18-02-PLAN.md (Browse History Tracking)
Resume file: None
