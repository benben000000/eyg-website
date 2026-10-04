# FRONTEND_RULES.md — anti-AI, pro-shop

## Banned (reject PR)
1. Status pills with dot + glow, pulsing dots, `animate-ping` decoration.
2. Glowing badges/outlines, colored `shadow-[0_0_*]`, neon rings.
3. Emoji in UI (buttons/tables/toasts/empty states). Lucide only.
4. Purple/blue gradients, mesh/aurora, gradient text/buttons.
5. Centered pill-badge hero (pill + centered H1 + 2 buttons + 3 cards).
6. 3-column tinted-icon feature cards.
7. Inter/Poppins default unstyled look. Hype copy: revolutionize, cutting-edge, seamless, elevate, unlock, supercharge, game-changer, world-class, next-gen, powered by AI.
8. Raw `<img>` (use `next/image`), `framer-motion`/heavy libs on landing, full-page spinners (skeletons only).

Grep gates (must be 0 hits): `from-purple|from-indigo|to-blue|bg-clip-text.*gradient`, `shadow-[0_0`, `✨|🚗|🔧|✅`, `revolutionize|cutting-edge|seamless|elevate` (case-insensitive), `<img`.

## Required
- Asymmetric left-aligned layouts (hero 7/5, sticky ledger), hairline borders, flat solid colors, mono tabular numbers for PHP/stock/SKU.
- Lucide 16–20px, stroke 1.75–2, `currentColor`.
- Honest Tagalog/English: "Presyong shop, walang tago." / "Walang stock ngayon. Balik bukas o pa-reserve."
- `next/image` (priority only for LCP), `next/dynamic` for POS/Admin heavies, route prefetch, ISR 3600 landing, route JS <180kb (landing <120kb).
- Skeletons matching layout; mobile 360px first; `tabular-nums` on numbers; `aria-label` EN.

## Pages
- `/`: left hero + job card, service rows (icon|name|price|time), sticky price board, hours/contact, footer ledger.
- `/inventory`: sticky toolbar (search + low-toggle + count), dense table SKU/pyesa/para-sa/stock/presyo, flat MABABA/UBOS tags `rounded-[2px]`, stacked cards on mobile.
- `/pos`: 2-pane (items + sticky ticket), category chips flat, 48px targets, mono totals, cash/GCash/card, print receipt.
- `/admin`: sidebar + 4 flat stats + recent/low tables, div-bar charts only, role gate.

Grant merge if flat, hairline, mono numbers, honest copy, fast, skeletons, Lucide-only. Reject if any banned pattern.
