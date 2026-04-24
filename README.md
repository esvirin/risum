# Fit Space Website (`/home/seo/dev/risum`)

Production-focused Next.js website for Fit Space with a custom marketing site and external booking flow.

## Summary

- Stack: **Next.js (App Router) + TypeScript + Tailwind**
- Main page rebuilt to match approved visual direction:
  - instructor cards from **vertical** photos,
  - separate studio slider from **horizontal** photos,
  - 6–7 day schedule grid with Group/Private switch,
  - prices section with Group/Private switch.
- Booking is an external link.

## Run Locally

```bash
npm install
npm run dev
```

Default URL: `http://localhost:3000`  
If occupied, Next.js auto-uses the next port (example: `3001`).

## Project Structure (key files)

- `app/page.tsx` — main landing page (hero, instructor cards, studio slider, schedule, prices, contacts)
- `components/PublicNav.tsx` — top navigation + Book now/Prices buttons
- `components/LanguageProvider.tsx` — client i18n state for RU/EN UI copy
- `components/SiteFooter.tsx` — shared footer with policies link
- `public/wfolio/*` — selected instructor photos for homepage cards

## Current UX Rules (implemented)

- Homepage schedule preserves the Group/Private switch.
- Prices are shown in dedicated section and split by Group/Private.

## Notes for Further Iterations

- Replace temporary Team fallback image with final approved Team photo from source gallery.
- Continue visual polish against approved reference while preserving real-data behavior.

## Commands

```bash
npm run dev
npm run lint
npm run build
```

Google Tag Manager is injected globally from `app/layout.tsx` with container ID `GTM-PBCQ9VV8`.
