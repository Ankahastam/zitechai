import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { marketingAutomationFaqItems } from "@/components/faq-data";
import { FaqSection } from "@/components/faq-section";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { LiquidButtonLink } from "@/components/ui/liquid-button-link";
import { Section } from "@/components/ui/section";
import { SectionHead } from "@/components/ui/section-head";
import { marketingAutomationContent, siteContent } from "@/content";

const TITLE = marketingAutomationContent.seo.title;
const DESCRIPTION = marketingAutomationContent.seo.description;
const CANONICAL = marketingAutomationContent.seo.canonical;
const OG_IMAGE = `${siteContent.seo.siteUrl}/images/marketing-automation/marketing-automation-hero.webp`;

const capabilityIcons: Record<string, IconName> = {
  analytics: "chart",
  campaigns: "send",
  capture: "users",
  crm: "link",
  followup: "phone-outgoing",
  nurturing: "book",
  personalization: "activity",
  scoring: "search",
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    description: DESCRIPTION,
    images: [{ alt: marketingAutomationContent.hero.imageAlt, height: 638, url: OG_IMAGE, width: 1200 }],
    locale: siteContent.seo.locale,
    siteName: siteContent.seo.siteName,
    title: `${TITLE} | ${siteContent.seo.siteName}`,
    type: "website",
    url: CANONICAL,
  },
  twitter: {
    card: "summary_large_image",
    description: DESCRIPTION,
    images: [OG_IMAGE],
    title: `${TITLE} | ${siteContent.seo.siteName}`,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: marketingAutomationContent.faq.items.map((item) => ({
    "@type": "Question",
    acceptedAnswer: { "@type": "Answer", text: item.answer },
    name: item.question,
  })),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${siteContent.seo.siteUrl}${CANONICAL}#service`,
  description: DESCRIPTION,
  name: TITLE,
  provider: { "@id": `${siteContent.seo.siteUrl}/#organization` },
  serviceType: ["مارکتینگ اتومیشن", "اتوماسیون بازاریابی با هوش مصنوعی"],
  url: `${siteContent.seo.siteUrl}${CANONICAL}`,
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", item: siteContent.seo.siteUrl, name: "زی‌تک", position: 1 },
    {
      "@type": "ListItem",
      item: `${siteContent.seo.siteUrl}${CANONICAL}`,
      name: "مارکتینگ اتومیشن",
      position: 2,
    },
  ],
};

export default function MarketingAutomationPage() {
  const content = marketingAutomationContent;

  return (
    <main className="ma-page">
      <section aria-labelledby="ma-hero-title" className="hero ma-hero">
        <Container>
          <div className="ma-hero__grid">
            <div className="ma-hero__copy">
              <p className="ma-hero__eyebrow" dir="ltr" lang="en">
                {content.hero.eyebrow}
              </p>
              <h1 className="ma-hero__title" id="ma-hero-title">
                {content.hero.title}
              </h1>
              <p className="ma-hero__promise">{content.hero.promise}</p>
              <p className="ma-hero__lede">{content.hero.lede}</p>
              <p className="ma-hero__action">
                <LiquidButtonLink filterId="ma-hero-cta-goo" href="#contact">
                  {content.hero.cta}
                </LiquidButtonLink>
              </p>
            </div>

            <figure className="ma-visual ma-hero__visual">
              <Image
                alt={content.hero.imageAlt}
                fetchPriority="high"
                height={638}
                sizes="(max-width: 63.99rem) calc(100vw - 2.5rem), 43rem"
                src="/images/marketing-automation/marketing-automation-hero.webp"
                width={1200}
              />
            </figure>
          </div>
        </Container>
      </section>

      <Section aria-labelledby="ma-problems-title" className="pg-section ma-problems" id="ma-problems">
        <SectionHead
          id="ma-problems-title"
          kicker={content.problems.kicker}
          lede={content.problems.lede}
          title={content.problems.title}
        />

        <ul aria-label="چالش‌های فرایند بازاریابی" className="ma-problem-grid">
          {content.problems.items.map((item, index) => (
            <li key={item.title}>
              <span aria-hidden="true" className="ma-index" dir="ltr">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="ma-definition-title" className="pg-section ma-definition" id="ma-definition">
        <div className="ma-editorial">
          <SectionHead
            id="ma-definition-title"
            kicker={content.definition.kicker}
            title={content.definition.title}
          />
          <div className="ma-editorial__body">
            {content.definition.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="ma-editorial__note">{content.definition.note}</p>
          </div>
        </div>
      </Section>

      <div className="pg-band ma-capabilities-band">
        <Section
          aria-labelledby="ma-capabilities-title"
          className="pg-section ma-capabilities"
          id="ma-capabilities"
        >
          <SectionHead
            id="ma-capabilities-title"
            kicker={content.capabilities.kicker}
            lede={content.capabilities.lede}
            title={content.capabilities.title}
          />

          <figure className="ma-visual ma-capabilities__visual">
            <Image
              alt={content.capabilities.imageAlt}
              height={788}
              sizes="(max-width: 80rem) calc(100vw - 2.5rem), 75rem"
              src="/images/marketing-automation/marketing-automation-features.webp"
              width={1400}
            />
          </figure>

          <ul aria-label="قابلیت‌های مارکتینگ اتومیشن" className="pg-grid ma-capability-grid">
            {content.capabilities.items.map((item, index) => (
              <li className="pg-card" key={item.id}>
                <div className="pg-card__top">
                  <span className="pg-card__badge">
                    <Icon name={capabilityIcons[item.id]} />
                  </span>
                  <span aria-hidden="true" className="pg-card__index" dir="ltr">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="pg-card__title">
                  {item.title}
                  <span className="pg-card__latin" dir="ltr" lang="en">
                    {item.latin}
                  </span>
                </h3>
                <p className="pg-card__body">{item.body}</p>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section aria-labelledby="ma-journey-title" className="pg-section ma-journey" id="ma-journey">
        <SectionHead
          id="ma-journey-title"
          kicker={content.journey.kicker}
          lede={content.journey.lede}
          title={content.journey.title}
        />

        <div className="ma-journey__layout">
          <ol aria-label="مراحل مسیر لید" className="ma-journey__steps">
            {content.journey.steps.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true" className="ma-index" dir="ltr">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <figure className="ma-visual ma-journey__visual">
            <Image
              alt={content.journey.imageAlt}
              height={788}
              sizes="(max-width: 63.99rem) calc(100vw - 2.5rem), 37rem"
              src="/images/marketing-automation/marketing-automation-journey.webp"
              width={1400}
            />
          </figure>
        </div>
      </Section>

      <section aria-labelledby="ma-approach-title" className="ma-approach" id="ma-approach">
        <Container>
          <SectionHead
            id="ma-approach-title"
            kicker={content.approach.kicker}
            lede={content.approach.lede}
            title={content.approach.title}
          />

          <ol aria-label="رویکرد زی‌تک" className="ma-approach__steps">
            {content.approach.items.map((item) => (
              <li key={item.number}>
                <div className="ma-approach__meta">
                  <span dir="ltr">{item.number}</span>
                  <span dir="ltr" lang="en">{item.latin}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Section
        aria-labelledby="ma-integrations-title"
        className="pg-section ma-integrations"
        id="ma-integrations"
      >
        <SectionHead
          id="ma-integrations-title"
          kicker={content.integrations.kicker}
          lede={content.integrations.lede}
          title={content.integrations.title}
        />

        <dl className="ma-integrations__grid">
          {content.integrations.items.map((item) => (
            <div key={item.title}>
              <dt>{item.title}</dt>
              <dd>{item.body}</dd>
            </div>
          ))}
        </dl>

        <p className="ma-integrations__links">
          {content.integrations.linkLead}
          <Link href="/voice-agent">{content.integrations.voiceLink}</Link>
          {content.integrations.linkMiddle}
          <Link href="/chat">{content.integrations.chatLink}</Link>
          {content.integrations.linkTail}
        </p>
      </Section>

      <FaqSection items={marketingAutomationFaqItems} title={content.faq.title} />

      <Section aria-labelledby="ma-cta-title" className="pg-section ma-final" id="ma-cta">
        <div className="ma-final__surface">
          <p className="text-label ma-final__kicker" dir="ltr" lang="en">
            {content.finalCta.kicker}
          </p>
          <h2 className="text-h2 ma-final__title" id="ma-cta-title">
            {content.finalCta.title}
          </h2>
          <p className="ma-final__lede">{content.finalCta.lede}</p>
          <p className="ma-final__action">
            <LiquidButtonLink filterId="ma-final-cta-goo" href="#contact" tone="light">
              {content.finalCta.cta}
            </LiquidButtonLink>
          </p>
        </div>
      </Section>

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceJsonLd, breadcrumbJsonLd, faqJsonLd]).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
    </main>
  );
}
