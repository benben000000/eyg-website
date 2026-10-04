# BRAND.md — EYG Auto Care Shop v1.0

## Pillars
1. Honest work — price, duration, inclusions shown. 2. Daily drivers — sedans, SUVs, MPVs, fleet. 3. Filipino shop reliability — plain Tagalog/English, PHP upfront. 4. Maintenance over marketing.

## Voice
Calm shop-foreman. Short verbs-first sentences. Good: "PMS every 5,000 km. We keep the record." / "Out of stock: 5W-30 (4L). Restock Friday."
Banned: elevate, unleash, unlock, delve, tapestry, vibrant, seamless, cutting-edge, revolutionary, game-changer, supercharge, ultimate experience, premium luxury.
Currency `₱1,250`. Dates `04 Oct 2026`. Metric only. Service names: Car Wash, Detailing, Oil Change, PMS, Undercoating, Brake Service, Aircon Cleaning, Tire Rotation, Battery Check.

## Colors
Charcoal 950 `#131417`, 900 `#1C1E22`, 700 `#2E3238`. Steel 500 `#6B7280`, 300 `#C8CDD4`, 100 `#E8EAED`. Paper `#FFFFFF`, off-white `#F6F3EC`. Amber 600 `#C96A0A`, 500 `#E8861A`, 400 `#F5A524`. Safety `#D9480F`, success `#2F7D4F`, danger `#B42318`, warning bg `#FEF3C7`.
Amber 500 on charcoal passes; never amber 400 text on off-white. Body on light `#1C1E22`.

## Type
Body/UI: system stack only. Headings: Barlow Condensed 600/700 uppercase, fallback Arial Narrow. Mono (plates/SKU/receipts): ui-monospace. Tabular numbers everywhere. Max 48px landing, 24px POS/admin. Never Inter/Poppins/Roboto display, scripts, weights <400, italic headings.

## Logo
EYG monogram, charcoal plate + off-white letters + amber bar. Flat, 2 colors max, no glow/gradient/bevel.

## Imagery
Real shop only (bay, hands, price board). Daylight/neutral. PH cars, plates blurred. No supercars, AI people, teal-orange grade. Text over photo needs 80% charcoal scrim.

## Components
Flat, bordered 4–8px radius, hairline borders, one amber action per screen. Landing left-aligned hero + price table + checklist. POS 48px targets, flat PAID/PENDING/VOID text, B/W printable receipt. Inventory dense table, flat MABABA/UBOS tags with labels. Admin charcoal sidebar, off-white content, charcoal/amber charts only.
BAN: glowing pills/badges/outlines, pulsing dots, emoji, glassmorphism, purple/blue gradients, generic centered pill hero, 3-col tinted-icon cards, fake urgency.

## Do / Don't
Do: price+duration+inclusions, real hours/phone, printable receipts, flat status + label, simple Tagalog.
Don't: invent services/prices/reviews, supercar stock, hidden fees, centered 3-card landing, >200ms animation in POS, store extra customer data.

## Grant / Reject
GRANT: palette tokens, system stack, service/SKU/receipt fields in pattern, flat tables, `₱`, mono plates, CSV/print.
REJECT: new colors/fonts/emoji, Inter display, glow/glass/pills, AI hero/stock, hype copy, joke enums (`status:'awesome'` — use pending/completed/paid/void/in_stock/low_stock/out_of_stock), logo distortion, receipt missing OR/business/totals.
