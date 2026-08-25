import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import I18nProvider from "@/components/I18nProvider";
import { buildPinterestArticleOpenGraph, OPEN_GRAPH_IMAGE } from "@/lib/seo/pinterestOpenGraph";
import {
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = HOME_PAGE_TITLE;

const SITE_DESCRIPTION = HOME_PAGE_DESCRIPTION;

const OG_DESCRIPTION =
  "Turn any selfie into official 300 DPI passport & visa photos instantly with AI Images Studio. Automatic background removal & official spec compliance.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | AI Images Studio",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "AI ID photo",
    "Hong Kong passport photo",
    "passport photo maker",
    "visa photo AI",
    "4R print sheet",
    "Korean studio ID photo",
    "online passport photo generator",
    "300 DPI ID photo",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Photography",
  openGraph: buildPinterestArticleOpenGraph({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  }),
  twitter: {
    card: "summary_large_image",
    title: "AI Images Studio — Instant Professional ID & Passport Photos",
    description: OG_DESCRIPTION,
    images: [OPEN_GRAPH_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  other: {
    "p:domain_verify": "e579a791126af1c925de72aa96cf3cd5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>{children}</I18nProvider>
        <Analytics />
        <SpeedInsights />
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
      </body>
    </html>
  );
}
