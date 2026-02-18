This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Altegio Integration

Set public links/widgets in `.env`:

```bash
NEXT_PUBLIC_ALTEGIO_BOOKING_URL=https://your-company.alteg.io
NEXT_PUBLIC_ALTEGIO_CABINET_URL=https://your-company.alteg.io/login
NEXT_PUBLIC_ALTEGIO_SCHEDULE_WIDGET_URL=https://your-company.alteg.io/widget/calendar
NEXT_PUBLIC_ALTEGIO_TRAINERS_WIDGET_URL=https://your-company.alteg.io/widget/staff
NEXT_PUBLIC_ALTEGIO_IOS_APP_URL=https://apps.apple.com/app/altegio/id1477754250
NEXT_PUBLIC_ALTEGIO_ANDROID_APP_URL=https://play.google.com/store/apps/details?id=com.yclients.mobile
```

Used in:
- Home page schedule embed (`app/page.tsx`)
- Trainers embed (`app/trainers/page.tsx`)
- Navigation and CTA links (`components/PublicNav.tsx`, `app/page.tsx`)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
