import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { voiceAgentFaqItems } from "@/components/faq-data";
import { FaqSection } from "@/components/faq-section";
import { HeroInteractiveBackground } from "@/components/hero-interactive-background";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { LiquidButtonLink } from "@/components/ui/liquid-button-link";
import { Section } from "@/components/ui/section";
import { SectionHead } from "@/components/ui/section-head";
import { VoiceAgentMotion } from "@/components/voice-agent-motion";
import { siteContent, voiceAgentContent } from "@/content";

const TITLE = voiceAgentContent.seo.title;
const DESCRIPTION = voiceAgentContent.seo.description;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: voiceAgentContent.seo.canonical },
  openGraph: {
    description: DESCRIPTION,
    images: [siteContent.seo.ogImage],
    locale: siteContent.seo.locale,
    siteName: siteContent.seo.siteName,
    title: `${TITLE} | ${siteContent.seo.siteName}`,
    type: "website",
    url: voiceAgentContent.seo.canonical,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: voiceAgentContent.faq.items.map((item) => ({
    "@type": "Question",
    acceptedAnswer: { "@type": "Answer", text: item.answer },
    name: item.question,
  })),
};

type ProcessStep = { icon: IconName; label: string };
type Entry = {
  body?: string;
  latin?: string;
  number?: string;
  points?: readonly string[];
  process?: readonly ProcessStep[];
  title: string;
};
const featureIcons: Record<string, IconName> = {
  crm: "users",
  knowledge: "book",
  outbound: "phone-outgoing",
  reporting: "chart",
  voip: "phone",
};
const industryIcons: Record<string, IconName> = {
  enterprise: "shopping-cart",
  healthcare: "activity",
  international: "globe",
  restaurant: "coffee",
  travel: "map-pin",
};
const integrationIcons: Record<string, IconName> = {
  crm: "users",
  erp: "shopping-cart",
  otp: "message-square",
  webhook: "link",
};
const processIcons: Record<string, readonly IconName[]> = {
  debt: ["chart", "phone-outgoing", "monitor"],
  order: ["phone", "map-pin", "shopping-cart"],
  sales: ["phone", "users", "phone-outgoing"],
  support: ["message-square", "book", "send"],
  survey: ["phone-outgoing", "message-square", "chart"],
};
const useCases: readonly Entry[] = voiceAgentContent.useCases.items.map((item, index) => ({
  ...item,
  number: String(index + 1).padStart(2, "0"),
  process: item.process.map((label, step) => ({ icon: processIcons[item.id][step], label })),
}));
const customActions = voiceAgentContent.integrations.actions.map((action) => ({
  ...action,
  icon: integrationIcons[action.id],
}));

function EntryList({
  className,
  items,
  label,
}: {
  className?: string;
  items: readonly Entry[];
  label: string;
}) {
  const ordered = items.every((item) => item.number);
  const content = items.map((item, index) => (
    <li
      className="va-list__item"
      key={item.title}
      style={{ "--item": index } as CSSProperties}
    >
      {item.number ? (
        <p className="va-list__index" dir="ltr">
          {item.number}
        </p>
      ) : null}
      <h3 className="va-list__title">
        {item.title}
        {item.latin ? (
          <span className="va-list__latin" dir="ltr" lang="en">
            {item.latin}
          </span>
        ) : null}
      </h3>
      {item.process ? (
        <figure aria-hidden="true" className="va-process">
          {item.process.map((step, stepIndex) => (
            <span className="va-process__step" key={step.label}>
              <span className="va-process__icon">
                <Icon name={step.icon} />
              </span>
              <span className="va-process__label">{step.label}</span>
              {stepIndex < item.process!.length - 1 ? (
                <span className="va-process__route">
                  <span />
                </span>
              ) : null}
            </span>
          ))}
        </figure>
      ) : null}
      {item.body ? <p className="va-list__body">{item.body}</p> : null}
      {item.points ? (
        <ul className="pg-points">
          {item.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
    </li>
  ));
  const classes = className ? `va-list ${className}` : "va-list";

  return ordered ? (
    <ol aria-label={label} className={classes}>
      {content}
    </ol>
  ) : (
    <ul aria-label={label} className={classes}>
      {content}
    </ul>
  );
}

export default function VoiceAgentPage() {
  return (
    <main className="va-page">
      <VoiceAgentMotion />

      <section aria-labelledby="va-hero-title" className="hero va-hero">
        <div aria-hidden="true" className="hero__field">
          <HeroInteractiveBackground />
        </div>

        <Container>
          <div className="hero__content">
            <p className="va-hero__eyebrow">{voiceAgentContent.hero.eyebrow}</p>

            <h1 className="text-h2 hero__title va-hero__title" id="va-hero-title">
              {voiceAgentContent.hero.title}
            </h1>

            <p className="va-hero__promise">{voiceAgentContent.hero.promise}</p>

            <div aria-hidden="true" className="va-signal">
              <span className="va-signal__halo" />
              <span className="va-signal__ring" />
              <span className="va-signal__core">
                <Icon name="waveform" />
              </span>
              <span className="va-signal__wave">
                {Array.from({ length: 15 }, (_, index) => (
                  <span key={index} style={{ "--bar": index } as CSSProperties} />
                ))}
              </span>
              <span className="va-signal__status">{voiceAgentContent.hero.signalStatus}</span>
            </div>

            <p className="text-body-lg hero__lede">{voiceAgentContent.hero.lede}</p>

            <p className="hero__actions">
              <LiquidButtonLink filterId="va-hero-cta-goo" href="#contact">
                {voiceAgentContent.hero.cta}
              </LiquidButtonLink>
            </p>

            <div className="va-hero__marquee">
              <ul aria-label="ویژگی‌های کلیدی" className="va-hero__features">
                {[...voiceAgentContent.hero.features, ...voiceAgentContent.hero.features].map((feature, index) => (
                  <li aria-hidden={index >= voiceAgentContent.hero.features.length || undefined} key={`${feature.title}-${index}`}>
                    <span className="va-hero__feature-title">{feature.title}</span>
                    {feature.note ? (
                      <span className="va-hero__feature-note">{feature.note}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            <figure className="va-window">
              <div className="va-window__chrome">
                <span aria-hidden="true" className="va-window__dots">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="va-window__tag" dir="ltr" lang="en">
                  {voiceAgentContent.hero.demoTag}
                </span>
              </div>

              <div className="va-window__stage">
                <iframe
                  allowFullScreen
                  className="va-window__player"
                  loading="lazy"
                  src={voiceAgentContent.hero.videoUrl}
                  title={voiceAgentContent.hero.videoTitle}
                />
              </div>
            </figure>
          </div>
        </Container>
      </section>

      <Section aria-labelledby="va-pairs-title" className="pg-section" id="va-challenges">
        <SectionHead
          id="va-pairs-title"
          kicker={voiceAgentContent.pairs.kicker}
          title={voiceAgentContent.pairs.title}
        />

        <div className="va-pairs">
          <div className="va-pairs__row va-pairs__row--head">
            <p className="va-pairs__head">{voiceAgentContent.pairs.problemLabel}</p>
            <p className="va-pairs__head">{voiceAgentContent.pairs.solutionLabel}</p>
          </div>

          <dl className="va-pairs__list">
            {voiceAgentContent.pairs.items.map((pair) => (
              <div className="va-pairs__row" key={pair.problem}>
                <dt>
                  <span className="va-pairs__eyebrow">{voiceAgentContent.pairs.problemLabel}</span>
                  {pair.problem}
                </dt>
                <dd>
                  <span className="va-pairs__eyebrow">{voiceAgentContent.pairs.solutionLabel}</span>
                  {pair.solution}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <div className="pg-band">
        <Section
          aria-labelledby="va-features-title"
          className="pg-section va-features-section"
          id="va-features"
        >
          <SectionHead
            id="va-features-title"
            kicker={voiceAgentContent.features.kicker}
            title={voiceAgentContent.features.title}
          />

          <ul aria-label="امکانات پنل مدیریت" className="pg-grid va-bento">
            {voiceAgentContent.features.items.map((feature, index) => (
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
                  {feature.latin ? (
                    <span className="pg-card__latin" dir="ltr" lang="en">
                      {feature.latin}
                    </span>
                  ) : null}
                </h3>

                <ul className="pg-points pg-points--card">
                  {feature.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}

            <li className="pg-card pg-card--live">
              <div className="pg-card__top">
                <span className="pg-card__badge">
                  <Icon name="waveform" />
                </span>
                <span className="va-live" dir="ltr" lang="en">
                  <span aria-hidden="true" className="va-live__dot" />
                  LIVE
                </span>
              </div>

              <h3 className="pg-card__title">{voiceAgentContent.features.liveTitle}</h3>

              <span aria-hidden="true" className="va-wave">
                {Array.from({ length: 11 }, (_, index) => (
                  <span key={index} style={{ "--bar": index } as CSSProperties} />
                ))}
              </span>

              <p className="pg-card__body">{voiceAgentContent.features.liveBody}</p>
            </li>
          </ul>
        </Section>

        <Section
          aria-labelledby="va-industries-title"
          className="pg-section va-industries-section"
          id="va-industries"
        >
          <SectionHead
            id="va-industries-title"
            kicker={voiceAgentContent.industries.kicker}
            title={voiceAgentContent.industries.title}
          />

          <ul aria-label="صنف‌ها و کسب‌وکارهای هدف" className="va-industries">
            {voiceAgentContent.industries.items.map((industry, index) => (
              <li className="pg-card pg-card--industry" key={industry.title}>
                <input
                  className="va-industry__control"
                  defaultChecked={index === 0}
                  id={`va-industry-${index + 1}`}
                  name="va-industry"
                  type="radio"
                />
                <label className="va-industry__label" htmlFor={`va-industry-${index + 1}`}>
                  <span className="va-industry__media">
                    <Image
                      alt=""
                      className="va-industry__image"
                      fill
                      sizes="(max-width: 63.99rem) 82vw, 58vw"
                      src={industry.image}
                      unoptimized
                    />
                  </span>
                  <span className="va-industry__caption">
                    <span className="pg-card__badge">
                      <Icon name={industryIcons[industry.id]} />
                    </span>
                    <span className="pg-card__title">{industry.title}</span>
                    <span aria-hidden="true" className="va-industry__toggle">+</span>
                  </span>
                </label>

                <div className="va-industry__body">
                  <p className="pg-card__body">{industry.body}</p>

                  <ul className="pg-tags">
                    {industry.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>

                  <p className="va-solves">
                    <span className="va-solves__label">{voiceAgentContent.industries.solvesLabel}</span>
                    <span>{industry.solves}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section
        aria-labelledby="va-usecases-title"
        className="pg-section va-usecases-section"
        data-surface="light"
        id="va-use-cases"
      >
        <div className="va-usecases-stage">
          <SectionHead id="va-usecases-title" kicker={voiceAgentContent.useCases.kicker} title={voiceAgentContent.useCases.title} />
          <EntryList className="va-usecase-deck" items={useCases} label={voiceAgentContent.useCases.title} />
        </div>
      </Section>

      <Section aria-labelledby="va-pricing-title" className="pg-section" id="va-pricing">
        <SectionHead
          id="va-pricing-title"
          kicker={voiceAgentContent.pricing.kicker}
          lede={voiceAgentContent.pricing.lede}
          title={voiceAgentContent.pricing.title}
        />

        <div className="va-price">
          <div className="va-price__card">
            <h3 className="va-price__title">{voiceAgentContent.pricing.licenseTitle}</h3>
            <p className="va-price__amount">{voiceAgentContent.pricing.amount}</p>
            <p className="va-price__note">{voiceAgentContent.pricing.amountNote}</p>

            <ul aria-label="موارد شامل لایسنس پایه" className="pg-checks">
              {voiceAgentContent.pricing.includes.map((item) => (
                <li key={item}>
                  <span aria-hidden="true" className="pg-checks__mark">
                    ✔
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="va-price__api">
            <h3 className="text-h3">
              {voiceAgentContent.pricing.apiTitle}{" "}
              <span dir="ltr" lang="en">
                {voiceAgentContent.pricing.apiTitleLatin}
              </span>
            </h3>

            <ul className="va-price__api-points">
              {voiceAgentContent.pricing.apiPoints.map((point) => (
                <li key={point.label}>
                  <strong>{point.label}</strong> {point.text}{" "}
                  {point.emphasis ? <strong>{point.emphasis}</strong> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        aria-labelledby="va-integrations-title"
        className="pg-section va-integrations-section"
        id="va-integrations"
      >
        <div className="va-integrations-layout">
          <div className="va-integrations-copy">
            <SectionHead
              id="va-integrations-title"
              kicker={voiceAgentContent.integrations.kicker}
              lede={voiceAgentContent.integrations.lede}
              title={voiceAgentContent.integrations.title}
            />

            <ul aria-label="امکانات سفارشی" className="va-integration-actions">
              {customActions.map((action) => (
                <li key={action.system}>
                  <span className="va-integration-actions__system" dir="ltr" lang="en">
                    {action.system}
                  </span>
                  <span>{action.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div aria-label={voiceAgentContent.integrations.mapLabel} className="va-integration-map">
            <svg aria-hidden="true" className="va-integration-routes" viewBox="0 0 600 480">
              <path d="M300 240 C230 190 190 130 130 95" pathLength="1" />
              <path d="M300 240 C370 190 410 130 470 95" pathLength="1" />
              <path d="M300 240 C230 290 190 350 130 385" pathLength="1" />
              <path d="M300 240 C370 290 410 350 470 385" pathLength="1" />
            </svg>

            <div className="va-integration-core" data-integration-core="voice-agent">
              <span className="va-integration-core__pulse" />
              <span className="va-integration-core__icon">
                <Icon name="waveform" />
              </span>
              <strong>{voiceAgentContent.integrations.coreTitle}</strong>
              <span dir="ltr" lang="en">{voiceAgentContent.integrations.coreLatin}</span>
            </div>

            <ul aria-label="سیستم‌های متصل" className="va-integration-nodes">
              {customActions.map((action, index) => (
                <li
                  className="va-integration-node"
                  key={action.system}
                  style={{ "--node": index } as CSSProperties}
                >
                  <span className="va-integration-node__icon">
                    <Icon name={action.icon} />
                  </span>
                  <strong dir="ltr" lang="en">{action.system}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div aria-hidden="true" className="va-integration-marquee">
          <div className="va-integration-marquee__track">
            {[...customActions, ...customActions].map((action, index) => (
              <span key={`${action.system}-${index}`} dir="ltr" lang="en">
                {action.system}<i />
              </span>
            ))}
          </div>
        </div>

        <div className="va-integration-cta">
          <span aria-hidden="true" className="va-integration-cta__refract" />
          <span aria-hidden="true" className="va-integration-cta__tint" />
          <span aria-hidden="true" className="va-integration-cta__specular" />
          <div className="va-integration-cta__content">
            <p>{voiceAgentContent.integrations.ctaBody}</p>
            <a href="#contact">{voiceAgentContent.integrations.cta}</a>
          </div>
        </div>
      </Section>

      <FaqSection items={voiceAgentFaqItems} title={voiceAgentContent.faq.title} />

      <Section aria-labelledby="va-cta-title" className="pg-section va-cta-section" id="va-cta">
        <div className="va-cta">
          <h2 className="text-h2 va-cta__title" id="va-cta-title">
            {voiceAgentContent.finalCta.title}
          </h2>
          <p className="va-cta__lede">{voiceAgentContent.finalCta.lede}</p>
          <p className="va-cta__action">
            <LiquidButtonLink filterId="va-final-cta-goo" href="#contact">
              {voiceAgentContent.finalCta.cta}
            </LiquidButtonLink>
          </p>
        </div>
      </Section>

      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
    </main>
  );
}
