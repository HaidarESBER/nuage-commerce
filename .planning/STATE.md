# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-11)

**Core value:** The brand looks so premium and legitimate that visitors trust it instantly — visual identity drives conversion.
**Current focus:** v3.0 Content & Growth — Blog & content marketing for organic traffic

## Current Position

Phase: 12 of 14 (Product Sourcing Pipeline)
Plan: 2 of 2 in current phase
Status: Complete
Last activity: 2026-02-12 — Completed 12-02-PLAN.md

Progress: ████████████░ 100% (2/2 plans for Phase 12)

## Milestone Summary

**v3.0 Content & Growth (complete)**

- 1 phase planned (14), 2 plans total
- Focus: Blog & content marketing for organic traffic
- Started: 2026-02-12, Completed: 2026-02-12

**v2.0 Production Launch (in progress)**

- 5 phases planned (9-13), 5 complete
- Focus: Payments, database, email, product sourcing, AI curation
- Started: 2026-02-11

**v1.1 Enhanced Experience shipped 2026-02-09**

- 4 phases, 10 plans executed
- Animations, interactions, trust signals, performance

**v1.0 MVP shipped 2026-02-09**

- 4 phases, 11 plans executed
- 4,540 lines TypeScript, 80 files

## Performance Metrics

**Velocity:**
- Total plans completed: 33
- Average duration: 9.0 min
- Total execution time: 5.1 hours

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

## Accumulated Context

### Roadmap Evolution

- Milestone v1.1 created: Enhanced Experience with animations and dynamism, 4 phases (Phase 5-8)
- Milestone v2.0 created: Production Launch with payments, database, sourcing, 5 phases (Phase 9-13)
- Milestone v3.0 created: Content & Growth with blog & content marketing, 1 phase (Phase 14)

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
Stopped at: Completed 12-02-PLAN.md (Phase 12 complete, v2.0 Production Launch complete)
Resume file: Next phase or milestone (check ROADMAP.md)
