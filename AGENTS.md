# AGENTS — EYG Auto Care Shop ecosystem

Master orchestrator rules. Every agent (frontend, backend, content) must read BRAND.md + FRONTEND_RULES.md before editing.

## What we are building
One ecosystem, one source of truth:
- `/` landing reads `data/seed.json` (services, products) + site blocks. Static (ISR 3600).
- `/inventory` reads same products. Dense ledger table.
- `/pos` sells from same products/services. Checkout calls `lib/inventory.ts::commitSale` — the ONLY writer of stock.
- `/admin` edits products, services, site blocks, voids sales. Same store.

## What to do
- Import from `@/lib/store`, `@/lib/format`, `@/data/seed.json`. Never duplicate price/stock constants in components.
- Keep bundle light: `lucide-react` only, `next/dynamic` for POS/Admin, `next/image` for photos, tabular numbers for PHP.
- Mobile-first 360px, touch targets 44px+, skeletons for loading, prefetch with `<Link prefetch>`.
- Peso as `₱1,250`, dates `04 Oct 2026`, plates uppercase mono.

## What NOT to do
- No new DB, ORM, auth lib, chart lib, animation lib. Demo must run with zero env vars.
- No `process.env`, no `/api` DB routes, no external image hotlinks (esp. facebook CDN).
- No invented address/phone/prices — use TBD placeholders from seed until owner confirms.
- No AI-looking UI (see FRONTEND_RULES §2): glowing pills/badges/outlines, emoji, purple/blue gradients, centered pill-badge hero, 3-col tinted-icon cards, hype copy.

## What to include
- Every data view: loading skeleton + empty state + error text.
- Every price: PHP + stock flag (IN / MABABA / UBOS).
- Receipt-safe B/W legibility, CSV-ready tables, hairline borders, flat tags.

## What NOT to include
- `.png` hero blobs, `framer-motion`, `recharts` on landing, glassmorphism, confetti, countdown urgency, lorem ipsum, fake testimonials.

## Grant / Reject
- GRANT without asking: use palette tokens, add service rows/SKU fields/receipt fields in existing patterns, flat tables, export CSV/print CSS.
- REJECT and send back: new brand colors/fonts/gradients, glow/glass/emoji, generic AI hero, hype words (elevate, seamless, cutting-edge, revolutionize, game-changer, unlock), joke enums, direct `products.stock` mutation outside `lib/inventory.ts`, hardcoded prices in components.

## Backend ownership
- `lib/types.ts` — types only. `lib/db.ts` — localStorage adapter. `lib/store.tsx` — vanilla store. `lib/inventory.ts` — ONLY stock mutator (`commitSale`, `restock`, `voidSale`). Roles: admin PIN 1234 (full), staff 0000 (sell only, no void/restock/CMS/cost).

## Frontend ownership
- Routes own only their folder. Shared UI in `components/`. Landing stays static; POS/Admin are client + dynamic import.

## Definition of done
`npm run build` clean, all routes 200, no `process.env`, works 360px + throttled 4G, POS sale drops inventory and shows in admin, admin edit updates landing + POS.
