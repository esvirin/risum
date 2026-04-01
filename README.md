# Fit Space Website (`/home/seo/dev/risum`)

Production-focused Next.js website for Fit Space with live schedule/services data and external booking flow.

## Summary

- Stack: **Next.js (App Router) + TypeScript + Tailwind**
- Main page rebuilt to match approved visual direction:
  - instructor cards from **vertical** photos,
  - separate studio slider from **horizontal** photos,
  - 6–7 day schedule grid with Group/Private switch,
  - prices section with Group/Private switch.
- Booking and personal cabinet are external links.
- Data policy: **real data only** (no synthetic placeholders/random fallback in schedule/services flow).

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
- `app/api/altegio/*` — API routes for schedule/trainers/services
- `lib/altegio-api.ts` — Altegio API mapping/normalization
- `public/wfolio/*` — selected instructor photos for homepage cards

## Environment Variables

### Public links

```bash
NEXT_PUBLIC_ALTEGIO_BOOKING_URL=https://your-company.alteg.io
NEXT_PUBLIC_ALTEGIO_CABINET_URL=https://your-company.alteg.io/login
NEXT_PUBLIC_ALTEGIO_TRAINERS_WIDGET_URL=https://your-company.alteg.io/widget/staff
NEXT_PUBLIC_ALTEGIO_IOS_APP_URL=
NEXT_PUBLIC_ALTEGIO_ANDROID_APP_URL=
```

> Current preference: iOS/Android app links may stay empty.

### Server API access

```bash
ALTEGIO_API_BASE_URL=https://api.alteg.io
ALTEGIO_PARTNER_TOKEN=...
ALTEGIO_USER_TOKEN=...
ALTEGIO_COMPANY_ID=...

# Optional fallback auth
ALTEGIO_USER_LOGIN=...
ALTEGIO_USER_PASSWORD=...
```

## Current UX Rules (implemented)

- Homepage schedule shows **upcoming sessions only**.
- Time window: up to **one week ahead**.
- Group/Private switch on schedule.
- Occupancy shown per slot when API provides values (`clientsCount/capacity` → spots left).
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
