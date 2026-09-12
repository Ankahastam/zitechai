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
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Approach />
      <Capabilities />
      <FaqSection />
    </main>
  );
}
