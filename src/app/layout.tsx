import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { GoogleAnalytics } from "@/components/google-analytics";
import { siteVerification } from "@/lib/seo";
import { SITE, canonicalOrigin, isIndexable } from "@/lib/site";

import "./globals.css";
import "./motion.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(canonicalOrigin()),
  title: {
    default: "Home Doctor: know what's wrong in 30 seconds",
    template: "%s · Home Doctor",
  },
  description: SITE.shortDescription,
  applicationName: SITE.name,
  keywords: [
    "home repair",
    "diagnose household problems",
    "home repair cost",
    "DIY or call a pro",
    "plumbing problem",
    "electrical problem",
    "contractor quote check",
  ],
  category: "home improvement",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    title: "Home Doctor: know what's wrong in 30 seconds",
    description: SITE.shortDescription,
  },
  twitter: { card: "summary_large_image" },
  robots: isIndexable()
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
    : { index: false, follow: false },
  formatDetection: { telephone: false, address: false, email: false },
  verification: siteVerification(),
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <Toaster position="top-center" richColors />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
