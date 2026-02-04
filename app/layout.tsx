import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";

const RobotoSans = Roboto({
  variable: "--font-roboto-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
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
    <html lang="en">
      <body className={`${RobotoSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
