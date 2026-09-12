import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ContactDialog } from "@/components/contact-dialog";
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
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f2f1f3",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className={iranYekanX.variable} dir="rtl" lang="fa">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <ContactDialog content={siteContent.contactDialog} />
      </body>
    </html>
  );
}
