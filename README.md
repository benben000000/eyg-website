# EYG Auto Care Shop — one ecosystem

Landing + Inventory + POS + Admin share one list. No double entry. Demo runs with **zero env vars** (localStorage + seed JSON). Deploy: push to `main` → Vercel auto-builds.

Facebook: https://www.facebook.com/profile.php?id=61582418828014 (page is login-walled and unindexed as of Oct 2026 — no photos/scrape possible, so all art here is original; contact block uses TBD placeholders until owner confirms).

## Run
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # must pass with no env
```

## Routes
- `/` landing (static, ISR 1h) — hero, services, price board, hours/contact
- `/inventory` — searchable parts board (same data POS sells)
- `/pos` — counter ticket, PIN `0000` staff / `1234` admin
- `/admin` — dashboard, inventory CRUD, services, landing CMS, sales + void, reset demo

## Data flow (single writer)
`POS checkout → lib/inventory.ts::commitSale → products.stock → saved to localStorage → landing/inventory/admin re-render.`
Void emits compensating return. Restock only in admin. Staff cannot void/restock/edit CMS/see cost.

## Deploy to Vercel (no env)
1. Push this repo to GitHub. 2. Vercel → New Project → import repo → Build `npm run build`, Output `.next` → Deploy (leave env empty). Or click Deploy below and select this repo.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/benben000000/eyg-website)

## Docs for agents
- `AGENTS.md` — orchestrator (do/not, include/not, grant/reject)
- `BRAND.md` — voice, color, type, logo, imagery
- `FRONTEND_RULES.md` — anti-AI bans + page structures
