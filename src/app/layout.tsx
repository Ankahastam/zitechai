import type { Metadata, Viewport } from "next";
import { Suspense, type ReactNode } from "react";
import { ContactDialog } from "@/components/contact-dialog";
import { LeadAttribution } from "@/components/lead-attribution";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { iranYekanX } from "@/fonts/iran-yekan-x";
import { siteContent } from "@/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteContent.seo.siteUrl),
  title: {
    default: siteContent.seo.titleDefault,
    template: siteContent.seo.titleTemplate,
  },
  description: siteContent.seo.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    description: siteContent.seo.description,
    images: [siteContent.seo.ogImage],
    locale: siteContent.seo.locale,
    siteName: siteContent.seo.siteName,
    title: siteContent.seo.titleDefault,
    type: "website",
    url: "/",
  },
  robots: { follow: true, index: true },
  twitter: {
    card: "summary",
    description: siteContent.seo.description,
    images: [siteContent.seo.ogImage.url],
    title: siteContent.seo.titleDefault,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f2f1f3",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className={iranYekanX.variable} dir="rtl" lang="fa">
      <body>
        <Suspense fallback={null}><LeadAttribution /></Suspense>
        <SiteHeader />
        {children}
        <SiteFooter />
        <ContactDialog content={siteContent.contactDialog} />
      </body>
    </html>
  );
}
