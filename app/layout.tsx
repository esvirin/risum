import type { Metadata } from "next";
import { Manrope, Prata } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const prata = Prata({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Fit Space",
  description: "Fit Space Member Portal",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fit Space",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/icon-192x192.png",
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${prata.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
