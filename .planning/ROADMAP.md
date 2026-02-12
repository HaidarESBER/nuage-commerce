# Roadmap: Nuage E-Commerce

## Milestones

- ✅ [v1.0 MVP](milestones/v1.0-ROADMAP.md) (Phases 1-4) — SHIPPED 2026-02-09
- ✅ **v1.1 - Enhanced Experience** (Phases 5-8) — COMPLETE 2026-02-09
- 🚧 **v2.0 - Production Launch** (Phases 9-13) — In progress
- ✅ **v3.0 - Content & Growth** (Phase 14) — COMPLETE 2026-02-12

## Completed Milestones

<details>
<summary>v1.0 MVP (Phases 1-4) — SHIPPED 2026-02-09</summary>

- [x] Phase 1: Foundation & Brand (3/3 plans) — 2026-02-09
- [x] Phase 2: Product Catalog (2/2 plans) — 2026-02-09
- [x] Phase 3: Shopping Experience (3/3 plans) — 2026-02-09
- [x] Phase 4: Launch Prep (3/3 plans) — 2026-02-09

**Delivered:** Complete premium e-commerce storefront with shopping cart, checkout, order management, and mobile-responsive design.

See [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md) for full details.

</details>

<details>
<summary>v1.1 - Enhanced Experience (Phases 5-8) — COMPLETE 2026-02-09</summary>

- [x] Phase 5: Motion Foundation (1/1 plans) — 2026-02-09
- [x] Phase 6: Product Experience (1/1 plans) — 2026-02-09
- [x] Phase 7: Cart & Checkout Polish (1/1 plans) — 2026-02-09
- [x] Phase 8: Character & Delight (8/8 plans) — 2026-02-09

**Delivered:** Dynamic animations, interactive product galleries, smooth cart operations, mobile gestures, trust signals, exit intent, and performance optimization with SEO foundation.

</details>

### 🚧 v2.0 - Production Launch (In Progress)

**Milestone Goal:** Transform the MVP into a production-ready store with real payments, proper database, and an automated product sourcing pipeline.

#### Phase 9: Supabase Migration & Auth

**Goal**: Migrate from file-based JSON to Supabase PostgreSQL and secure admin panel with Supabase Auth
**Depends on**: Previous milestone complete (v1.1)
**Research**: Likely (new database integration + auth system)
**Research topics**: Supabase setup with Next.js 15, database schema design, Supabase Auth with App Router, middleware for protected routes
**Plans**: 3 plans, 1 wave

Plans:
- [x] 09-01: Supabase Foundation (packages, client helpers, schema, seed data)
- [x] 09-02: Migrate data access layer to Supabase
- [x] 09-03: Supabase Auth & admin protection

#### Phase 10: Stripe Checkout

**Goal**: Integrate Stripe Checkout for payment processing with webhook handling and order lifecycle management
**Depends on**: Phase 9 (orders in database)
**Research**: Likely (external payment API, French market requirements)
**Research topics**: Stripe Checkout with Next.js, webhook verification, EUR currency handling, French payment methods (Carte Bancaire), Stripe France compliance
**Plans**: 2 plans, 2 waves

Plans:
- [x] 10-01: Stripe Setup & Checkout Integration (Wave 1)
- [x] 10-02: Webhook, Success & Admin (Wave 2)

#### Phase 11: Email Notifications

**Goal**: Send branded transactional emails for order confirmation and status updates
**Depends on**: Phase 10 (payment confirmation triggers emails)
**Research**: Likely (external email service integration)
**Research topics**: Resend or similar service with Next.js, email template design, transactional email best practices for French market
**Plans**: 2 plans, 2 waves

Plans:
- [x] 11-01: Email Service & Status Template (Wave 1)
- [x] 11-02: Wire Email Triggers into Order Lifecycle (Wave 2)

#### Phase 12: Product Sourcing Pipeline

**Goal**: Build multi-source web scraper to find and extract product data from AliExpress, EU wholesalers, and competitor sites
**Depends on**: Phase 9 (products in database)
**Research**: Likely (web scraping tools, source-specific strategies)
**Research topics**: Web scraping libraries (Puppeteer, Playwright, Cheerio), AliExpress product API/scraping, rate limiting, anti-bot considerations, data extraction patterns
**Plans**: TBD

Plans:
- [ ] 12-01: TBD (run /gsd:plan-phase 12 to break down)

#### Phase 13: AI Curation & Automation

**Goal**: Auto-translate and rewrite scraped products in premium French brand tone, with scheduled scraping and admin review queue
**Depends on**: Phase 12 (scraping engine provides raw data)
**Research**: Likely (AI API integration, scheduled functions)
**Research topics**: Claude/OpenAI API for product translation, prompt engineering for brand-consistent copy, Vercel Cron or Supabase Edge Functions for scheduling, admin review queue UX
**Plans**: 2 plans, 2 waves

Plans:
- [x] 13-01: AI Translation Engine & Curation Schema (Wave 1) -- 2026-02-11
- [x] 13-02: Admin Review Queue & Automation (Wave 2) -- 2026-02-11

### 📋 v3.0 - Content & Growth (Planned)

**Milestone Goal:** Drive organic traffic and brand authority with a blog system for hookah guides, culture articles, and SEO landing pages.

#### Phase 14: Blog & Content Marketing

**Goal**: Build a blog system with hookah guides, culture articles, and SEO landing pages to drive organic traffic
**Depends on**: Previous milestones (storefront, database, admin panel all in place)
**Research**: Likely (CMS approach — MDX vs database-driven, SEO structured data for articles)
**Research topics**: MDX with Next.js 15 App Router, blog SEO best practices, structured data for articles, French content marketing patterns
**Plans**: TBD

Plans:
- [x] 14-01: MDX Infrastructure & Blog Utilities (packages, config, types, utilities, Article schema)
- [x] 14-02: Blog Pages & Content

## Progress

**Execution Order:**
Phases execute in numeric order: 9 → 10 → 11 → 12 → 13 → 14

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & Brand | v1.0 | 3/3 | Complete | 2026-02-09 |
| 2. Product Catalog | v1.0 | 2/2 | Complete | 2026-02-09 |
| 3. Shopping Experience | v1.0 | 3/3 | Complete | 2026-02-09 |
| 4. Launch Prep | v1.0 | 3/3 | Complete | 2026-02-09 |
| 5. Motion Foundation | v1.1 | 1/1 | Complete | 2026-02-09 |
| 6. Product Experience | v1.1 | 1/1 | Complete | 2026-02-09 |
| 7. Cart & Checkout Polish | v1.1 | 1/1 | Complete | 2026-02-09 |
| 8. Character & Delight | v1.1 | 8/8 | Complete | 2026-02-09 |
| 9. Supabase Migration & Auth | v2.0 | 3/3 | Complete | 2026-02-11 |
| 10. Stripe Checkout | v2.0 | 2/2 | Complete | 2026-02-11 |
| 11. Email Notifications | v2.0 | 2/2 | Complete | 2026-02-11 |
| 12. Product Sourcing Pipeline | v2.0 | 0/? | Not started | - |
| 13. AI Curation & Automation | v2.0 | 2/2 | Complete | 2026-02-11 |
| 14. Blog & Content Marketing | v3.0 | 2/2 | Complete | 2026-02-12 |
