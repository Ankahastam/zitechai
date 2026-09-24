import type { Metadata } from "next";
import { Approach } from "@/components/approach";
import { Capabilities } from "@/components/capabilities";
import { FaqSection } from "@/components/faq-section";
import { Hero } from "@/components/hero";
import { homeContent, siteContent } from "@/content";

export const metadata: Metadata = {
  title: { absolute: homeContent.seo.title },
  description: homeContent.seo.description,
  alternates: { canonical: homeContent.seo.canonical },
  openGraph: {
    description: homeContent.seo.description,
    images: [siteContent.seo.ogImage],
    locale: siteContent.seo.locale,
    siteName: siteContent.seo.siteName,
    title: homeContent.seo.title,
    type: "website",
    url: homeContent.seo.canonical,
  },
  twitter: {
    card: "summary",
    description: homeContent.seo.description,
    images: [siteContent.seo.ogImage.url],
    title: homeContent.seo.title,
  },
};

const identityJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@id": `${siteContent.seo.siteUrl}/#organization`,
      "@type": "Organization",
      alternateName: "Zitech AI",
      description: siteContent.seo.description,
      logo: new URL(siteContent.seo.ogImage.url, siteContent.seo.siteUrl).toString(),
      name: siteContent.seo.siteName,
      url: siteContent.seo.siteUrl,
    },
    {
      "@id": `${siteContent.seo.siteUrl}/#website`,
      "@type": "WebSite",
      inLanguage: "fa-IR",
      name: siteContent.seo.siteName,
      publisher: { "@id": `${siteContent.seo.siteUrl}/#organization` },
      url: siteContent.seo.siteUrl,
    },
  ],
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Approach />
      <Capabilities />
      <FaqSection />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(identityJsonLd).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
    </main>
  );
}
