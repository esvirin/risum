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
