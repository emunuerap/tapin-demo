# TapIn Demo (Dashboard + Web Widget)

This is a **portfolio-ready** demo you can deploy on Vercel and link from your **Ramas · TapIn** project.

## What’s inside

- **Restaurant Dashboard** (`/dashboard`)
  - Overview cards + next arrivals
  - Bookings list + filters
  - Tables + “smart allocation” suggestion
  - CRM guest memory (notes/prefs)
  - Settings + embed snippet

- **Embeddable Widget**
  - Full widget route: `/embed/widget` (supports query params)
  - Demo wrapper + controls: `/widget`
  - Simple loader script: `/embed/tapin-widget.js`

> Note: data is mocked/in-memory on purpose. It’s designed to **feel real** without requiring DB/back-end hosting.

## Run locally

```bash
npm i
npm run dev
```

Open:
- http://localhost:3000/

## Deploy on Vercel

1. Push this folder to a GitHub repo (e.g. `tapin-demo`).
2. In Vercel: **New Project** → import repo.
3. Framework preset: **Next.js**.
4. Deploy.

## Embed (example)

```html
<script async src="https://YOUR-VERCEL-DOMAIN/embed/tapin-widget.js"></script>
<div data-tapin-widget data-restaurant="r-otoro" data-accent="yuzu" data-compact="0" data-height="560"></div>
```

## Query params

`/embed/widget?restaurant=r-otoro&accent=yuzu&compact=1`

- `restaurant`: `r-otoro` | `r-lobo`
- `accent`: `yuzu` | `ice` | `ember`
- `compact`: `1` (optional)
