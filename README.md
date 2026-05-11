# Parallax Parfums — Website

A static, single-page brochure site for Parallax Parfums, a niche fragrance house in Santa Clara, CA. Built as a high-fidelity reference implementation that can be ported into a Shopify theme operating in "Catalogue Mode" later.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Homepage: hero, story teaser, two reserves, events, newsletter, footer. |
| `story.html` | The Story page — "The Invisible Architecture." Four chapters: the engineer's formula, the art of the parallax, engineered for endurance, crafted in Santa Clara. |
| `styles.css` | Global styling and dual-theme token system (`[data-mode="lucent"]` / `[data-mode="umbra"]`). |
| `story.css` | Page-specific styling for `story.html`. Layered on top of `styles.css`. |
| `script.js` | Mode toggle (with `localStorage` persistence), parallax scroll, scroll-triggered reveals, faux-coordinate readout. Shared by both pages. |
| `BRIEF.md` | The original design & development brief from the client, kept for reference. |

## How to view

Open `index.html` directly in a browser. No build step, no dependencies — fonts are pulled from Google Fonts via `<link>`.

## Design system

**Typography**
- Display: Cormorant Garamond (300, 400; italic)
- Body: Manrope (200–600)
- Engineering / spec: JetBrains Mono (300–500)

**Themes** (governed by `data-mode` on `<html>`)
- `lucent` (default) — raw linen `#f4f1ea`, warm near-black ink, cashmere-taupe accents
- `umbra` — charred wood `#0d0a08`, bone ink, deep copper accents `#b87333`

The two reserves inside the Collections section use *locally scoped* tokens so the Umbra and Lucent flacons always render in their own color world, independent of the global mode. The global toggle still shifts everything else (nav, story, events, etc.) so a visitor can experience the entire site in either perspective.

## Architecture decisions

- **Single page, anchored sections.** A brochure site that loads instantly on mobile (per the brief — visitors are likely standing at a farmers market). No router, no SPA framework. All five required sections (Home, Story, Collections, Events, Newsletter) live in `index.html`.
- **Parallax is GPU-only.** `transform: translate3d` driven by a `requestAnimationFrame`-throttled scroll listener. Skips elements out of viewport. Honors `prefers-reduced-motion`.
- **Local SEO.** `<title>`, meta description, keywords, and a `LocalBusiness` JSON-LD block all reference Santa Clara and the Bay Area. The footer also surfaces coordinates.
- **"Where to Experience" CTAs** on every fragrance anchor to `#events` per the brief — no "Add to Cart" buttons anywhere.

## Migration path to Shopify (Catalogue Mode)

When porting:

1. Map each fragrance card (`.frag`) to a Shopify product. Use product metafields for `top_notes`, `heart_notes`, `base_notes`, `feel`, and `sku_display`.
2. Map the two reserves to collections (`umbra-reserve`, `lucent-reserve`).
3. Replace the static event list with a metaobject (e.g. `event`) that the studio team can edit in the Shopify admin.
4. Set product templates so the primary CTA is "Where to Experience" linking to `/pages/events` (not "Add to Cart"). When online shipping launches, swap that template to the standard cart-add template.
5. The newsletter form should be wired to Shopify's customer/email-capture endpoint or Klaviyo.
6. POS: tag the Shopify channel as "Point of Sale" so the same product database powers in-person sales at markets.

## Performance notes

- ~1 HTML file, ~1 CSS file, ~1 JS file (total well under 50 KB before compression).
- No external JS libraries.
- Two Google Font families with `display=swap`.
- SVG flacons are inline — no image requests.

## Accessibility

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- Reduced-motion preference is honored (animations and parallax collapse to instant transitions).
- Mode toggle is a real `<button>` with an `aria-label`.
- All interactive elements are keyboard-reachable.
- Focus styles are inherited from the browser default; consider tightening these in the Shopify port to match the design system.
