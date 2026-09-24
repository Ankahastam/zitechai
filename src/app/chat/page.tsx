import type { Metadata } from "next";
import Image from "next/image";
import { ChatLeadForm } from "@/components/chat-lead-form";
import { chatAgentFaqItems } from "@/components/faq-data";
import { FaqSection } from "@/components/faq-section";
import { HeroInteractiveBackground } from "@/components/hero-interactive-background";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { LiquidButtonLink } from "@/components/ui/liquid-button-link";
import { Section } from "@/components/ui/section";
import { SectionHead } from "@/components/ui/section-head";
import { chatContent, siteContent } from "@/content";

const TITLE = chatContent.seo.title;
const DESCRIPTION = chatContent.seo.description;
const CTA_LABEL = chatContent.hero.primaryCta;

const channelIcons: Record<string, IconName> = {
  instagram: "camera",
  messengers: "message-square",
  telegram: "send",
  web: "monitor",
};

const featureIcons: Record<string, IconName> = {
  analytics: "chart",
  integrations: "link",
  knowledge: "search",
  takeover: "users",
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: chatContent.seo.canonical },
  openGraph: {
    description: DESCRIPTION,
    images: [siteContent.seo.ogImage],
    locale: siteContent.seo.locale,
    siteName: siteContent.seo.siteName,
    title: `${TITLE} | ${siteContent.seo.siteName}`,
    type: "website",
    url: chatContent.seo.canonical,
  },
  twitter: { card: "summary", description: DESCRIPTION, images: [siteContent.seo.ogImage.url], title: TITLE },
};

/* Placeholder answers are kept out of structured data so nothing unapproved is indexed. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: chatContent.faq.items
    .filter((item) => item.includeInStructuredData)
    .map((item) => ({
      "@type": "Question",
      acceptedAnswer: { "@type": "Answer", text: item.answer },
      name: item.question,
    })),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${siteContent.seo.siteUrl}/chat#service`,
  description: DESCRIPTION,
  name: TITLE,
  provider: { "@id": `${siteContent.seo.siteUrl}/#organization` },
  url: `${siteContent.seo.siteUrl}/chat`,
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", item: siteContent.seo.siteUrl, name: "زی‌تک", position: 1 },
    { "@type": "ListItem", item: `${siteContent.seo.siteUrl}/chat`, name: TITLE, position: 2 },
  ],
};

export default function ChatAgentPage() {
  return (
    <main>
      <section aria-labelledby="ca-hero-title" className="hero ca-hero">
        <div aria-hidden="true" className="hero__field">
          <HeroInteractiveBackground />
        </div>

        <Container>
          <div className="hero__content">
            <Badge className="ca-hero__badge">
              {chatContent.hero.badge}
            </Badge>

            <h1 className="text-h2 hero__title ca-hero__title" id="ca-hero-title">
              {chatContent.hero.title}
            </h1>

            <p className="text-body-lg hero__lede">{chatContent.hero.lede}</p>

            <p className="hero__actions ca-hero__actions">
              <LiquidButtonLink filterId="ca-hero-cta-goo" href="#ca-form">
                {CTA_LABEL}
              </LiquidButtonLink>
              <ButtonLink className="ca-hero__secondary" href="#contact">
                {chatContent.hero.secondaryCta}
              </ButtonLink>
            </p>

            <ul aria-label="نکات کلیدی استقرار" className="ca-hero__trust">
              {chatContent.hero.trust.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <div className="pg-band">
        <Section aria-labelledby="ca-channels-title" className="pg-section" id="ca-channels">
          <SectionHead
            id="ca-channels-title"
            kicker={chatContent.channels.kicker}
            title={chatContent.channels.title}
          />

          <ul aria-label="کانال‌های پاسخگویی" className="pg-grid ca-channels">
            {chatContent.channels.items.map((channel) => (
              <li className="pg-card" key={channel.title}>
                <span className="pg-card__badge">
                  <Icon name={channelIcons[channel.id]} />
                </span>

                <h3 className="pg-card__title">
                  {channel.title}
                  <span className="pg-card__latin" dir="ltr" lang="en">
                    {channel.latin}
                  </span>
                </h3>

                <p className="pg-card__body">{channel.body}</p>

                <ul className="pg-tags">
                  <li>{channel.tag}</li>
                </ul>
              </li>
            ))}
          </ul>
        </Section>

        <Section aria-labelledby="ca-panel-title" className="pg-section" id="ca-panel">
          <SectionHead
            id="ca-panel-title"
            kicker={chatContent.features.kicker}
            title={chatContent.features.title}
          />

          <ul aria-label="امکانات پنل مدیریتی" className="pg-grid">
            {chatContent.features.items.map((feature, index) => (
              <li className="pg-card" key={feature.title}>
                <div className="pg-card__top">
                  <span className="pg-card__badge">
                    <Icon name={featureIcons[feature.id]} />
                  </span>
                  <span aria-hidden="true" className="pg-card__index" dir="ltr">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="pg-card__title">
                  {feature.title}
                  <span className="pg-card__latin" dir="ltr" lang="en">
                    {feature.latin}
                  </span>
                </h3>

                <ul className="pg-points pg-points--card">
                  {feature.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <figure className="ca-panel-preview">
            <Image
              alt="نمای داشبورد پنل مدیریت چت‌بات با آمار فعالیت، ساعات پرترافیک و دسته‌بندی سوالات"
              height={1490}
              sizes="(max-width: 80rem) calc(100vw - 2rem), 75rem"
              src="/images/chat/management-dashboard.png"
              width={2734}
            />
          </figure>
        </Section>
      </div>

      <Section aria-labelledby="ca-pricing-title" className="pg-section" id="ca-pricing">
        <SectionHead
          id="ca-pricing-title"
          kicker={chatContent.pricing.kicker}
          lede={chatContent.pricing.lede}
          title={chatContent.pricing.title}
        />

        <div className="ca-plans">
          {chatContent.pricing.plans.map((plan) => (
            <article className="ca-plan" key={plan.title}>
              <h3 className="ca-plan__title">{plan.title}</h3>
              <p className="ca-plan__amount">{plan.amount}</p>
              <p className="ca-plan__kind">{plan.kind}</p>

              <ul aria-label={`موارد شامل ${plan.title}`} className="pg-checks">
                {plan.items.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true" className="pg-checks__mark">
                      ✔
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="ca-plans__action">
          <LiquidButtonLink filterId="ca-price-cta-goo" href="#ca-form">
            {chatContent.pricing.cta}
          </LiquidButtonLink>
        </p>
      </Section>

      <Section aria-labelledby="ca-form-title" className="pg-section" id="ca-form">
        <SectionHead
          id="ca-form-title"
          kicker={chatContent.leadForm.kicker}
          lede={chatContent.leadForm.lede}
          title={chatContent.leadForm.title}
        />

        <ChatLeadForm content={chatContent.leadForm} />
      </Section>

      <FaqSection items={chatAgentFaqItems} title={chatContent.faq.title} />

      <Section aria-labelledby="ca-cta-title" className="pg-section" id="ca-cta">
        <div className="ca-cta">
          <h2 className="text-h2 ca-cta__title" id="ca-cta-title">
            {chatContent.finalCta.title}
          </h2>
          <p className="ca-cta__lede">{chatContent.finalCta.lede}</p>
          <p className="ca-cta__action">
            <LiquidButtonLink filterId="ca-final-cta-goo" href="#ca-form" tone="light">
              {chatContent.finalCta.cta}
            </LiquidButtonLink>
          </p>
        </div>
      </Section>

      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd, breadcrumbJsonLd, faqJsonLd]).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
    </main>
  );
}
