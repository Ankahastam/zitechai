import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { erpFaqItems } from "@/components/faq-data";
import { FaqSection } from "@/components/faq-section";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { LiquidButtonLink } from "@/components/ui/liquid-button-link";
import { Section } from "@/components/ui/section";
import { SectionHead } from "@/components/ui/section-head";
import { erpContent, siteContent } from "@/content";

const TITLE = erpContent.seo.title;
const DESCRIPTION = erpContent.seo.description;
const CANONICAL = erpContent.seo.canonical;
const OG_IMAGE = `${siteContent.seo.siteUrl}/images/erp/erp-integrated-system.webp`;

const moduleIcons: Record<string, IconName> = {
  assets: "briefcase",
  crm: "chart",
  hr: "users",
  manufacturing: "activity",
  quality: "search",
  stock: "shopping-cart",
};

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    description: DESCRIPTION,
    images: [{ alt: erpContent.hero.imageAlt, height: 941, url: OG_IMAGE, width: 1672 }],
    locale: siteContent.seo.locale,
    siteName: siteContent.seo.siteName,
    title: TITLE,
    type: "website",
    url: CANONICAL,
  },
  twitter: {
    card: "summary_large_image",
    description: DESCRIPTION,
    images: [OG_IMAGE],
    title: TITLE,
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${siteContent.seo.siteUrl}${CANONICAL}#service`,
  description: DESCRIPTION,
  name: "سامانه یکپارچه ERP زی‌تک",
  provider: { "@id": `${siteContent.seo.siteUrl}/#organization` },
  serviceType: [
    "ERP سازمانی",
    "فروش و CRM",
    "مدیریت انبار و موجودی",
    "مدیریت تولید",
    "کنترل کیفیت",
    "مدیریت دارایی و نگهداری",
    "منابع انسانی و حقوق و دستمزد",
  ],
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
      name: "سامانه یکپارچه ERP",
      position: 2,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: erpContent.faq.items.map((item) => ({
    "@type": "Question",
    acceptedAnswer: { "@type": "Answer", text: item.answer },
    name: item.question,
  })),
};

function ModuleDetails({ module }: { module: (typeof erpContent.modules)[number] }) {
  return (
    <article className="erp-module" id={`module-${module.id}`}>
      <header className="erp-module__head">
        <div className="erp-module__meta">
          <span className="erp-module__icon"><Icon name={moduleIcons[module.id]} /></span>
          <span dir="ltr">{module.number} / {module.latin}</span>
        </div>
        <h2>{module.title}</h2>
        {module.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </header>

      <ul aria-label={`قابلیت‌های کلیدی ${module.shortTitle}`} className="erp-module__highlights">
        {module.highlights.map((item) => <li key={item}>{item}</li>)}
      </ul>

      <details className="erp-disclosure">
        <summary>مشاهده همه قابلیت‌های {module.shortTitle}</summary>
        <div className="erp-disclosure__groups">
          {module.groups.map((group, index) => (
            <section aria-labelledby={`${module.id}-group-${index + 1}`} key={group.title}>
              <h3 id={`${module.id}-group-${index + 1}`}>{group.title}</h3>
              <ul>
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </details>
    </article>
  );
}

export default function ErpPage() {
  const content = erpContent;

  return (
    <main className="erp-page">
      <section aria-labelledby="erp-hero-title" className="erp-hero">
        <Container>
          <div className="erp-hero__grid">
            <div className="erp-hero__copy">
              <p className="erp-eyebrow" dir="ltr" lang="en">{content.hero.eyebrow}</p>
              <h1 id="erp-hero-title">{content.hero.title}</h1>
              {content.hero.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="erp-hero__actions">
                <LiquidButtonLink filterId="erp-hero-cta-goo" href="#contact">
                  {content.hero.primaryCta}
                </LiquidButtonLink>
                <Link className="erp-text-link" href="#erp-modules">{content.hero.secondaryCta} <span aria-hidden="true">↓</span></Link>
              </div>
            </div>

            <figure className="erp-visual erp-hero__visual">
              <Image
                alt={content.hero.imageAlt}
                fetchPriority="high"
                height={941}
                sizes="(max-width: 63.99rem) calc(100vw - 2.5rem), 42rem"
                src="/images/erp/erp-integrated-system.webp"
                width={1672}
              />
            </figure>
          </div>
        </Container>
      </section>

      <Section aria-labelledby="erp-problems-title" className="erp-section erp-problems" id="why-erp">
        <div className="erp-split-copy">
          <SectionHead id="erp-problems-title" kicker={content.problems.kicker} title={content.problems.title} />
          <div className="erp-split-copy__body">
            {content.problems.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <ul className="erp-problem-grid">
          {content.problems.items.map((item, index) => (
            <li key={item}><span dir="ltr">0{index + 1}</span><h3>{item}</h3></li>
          ))}
        </ul>
      </Section>

      <section aria-labelledby="erp-modules-title" className="erp-modules-nav" id="erp-modules">
        <Container>
          <SectionHead id="erp-modules-title" kicker={content.modulesIntro.kicker} title={content.modulesIntro.title} />
          <nav aria-label="ناوبری ماژول‌های ERP">
            <ol>
              {content.modules.map((module) => (
                <li key={module.id}>
                  <a href={`#module-${module.id}`}>
                    <span dir="ltr">{module.number}</span>
                    <Icon name={moduleIcons[module.id]} />
                    <strong>{module.shortTitle}</strong>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </Container>
      </section>

      <div className="erp-modules">
        {content.modules.map((module) => (
          <div key={module.id}>
            <Section className="erp-section"><ModuleDetails module={module} /></Section>

            {module.id === "stock" ? (
              <Container>
                <figure className="erp-visual erp-visual--wide">
                  <Image
                    alt="ارتباط مدیریت انبار، مواد اولیه و برنامه‌ریزی تولید در ERP"
                    height={793}
                    sizes="(max-width: 80rem) calc(100vw - 2.5rem), 75rem"
                    src="/images/erp/erp-inventory-manufacturing-flow.webp"
                    width={1983}
                  />
                </figure>
              </Container>
            ) : null}

            {module.id === "assets" ? (
              <Container>
                <figure className="erp-visual erp-visual--wide">
                  <Image
                    alt="کنترل کیفیت، مدیریت دارایی و نگهداری و تعمیرات در سامانه ERP"
                    height={1024}
                    sizes="(max-width: 80rem) calc(100vw - 2.5rem), 75rem"
                    src="/images/erp/erp-quality-maintenance.webp"
                    width={1536}
                  />
                </figure>
              </Container>
            ) : null}
          </div>
        ))}
      </div>

      <section aria-labelledby="erp-flow-title" className="erp-flow">
        <Container>
          <SectionHead id="erp-flow-title" kicker={content.flow.kicker} lede={content.flow.lede} title={content.flow.title} />
          <ol aria-label="تصویر مفهومی ارتباط فرایندهای ERP">
            {content.flow.steps.map((step, index) => (
              <li key={step}><span dir="ltr">{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>
            ))}
          </ol>
        </Container>
      </section>

      <Section aria-labelledby="erp-reporting-title" className="erp-section erp-reporting">
        <div className="erp-reporting__grid">
          <div>
            <SectionHead id="erp-reporting-title" kicker={content.reporting.kicker} lede={content.reporting.lede} title={content.reporting.title} />
            <ul className="erp-reporting__groups">
              {content.reporting.groups.map((group) => <li key={group}>{group}</li>)}
            </ul>
          </div>
          <figure className="erp-visual">
            <Image alt={content.reporting.imageAlt} height={1024} sizes="(max-width: 63.99rem) calc(100vw - 2.5rem), 37rem" src="/images/erp/erp-management-overview.webp" width={1536} />
          </figure>
        </div>
      </Section>

      <section aria-labelledby="erp-approach-title" className="erp-approach">
        <Container>
          <SectionHead id="erp-approach-title" kicker={content.approach.kicker} title={content.approach.title} />
          <ol>
            {content.approach.items.map((item) => (
              <li key={item.number}>
                <p><span dir="ltr">{item.number}</span><span dir="ltr" lang="en">{item.latin}</span></p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Section aria-labelledby="erp-use-cases-title" className="erp-section erp-use-cases">
        <SectionHead id="erp-use-cases-title" kicker={content.useCases.kicker} lede={content.useCases.lede} title={content.useCases.title} />
        <ul>
          {content.useCases.items.map((item, index) => <li key={item}><span dir="ltr">0{index + 1}</span><strong>{item}</strong></li>)}
        </ul>
        <p className="erp-internal-links">
          برای فرایندهای ارتباط با مشتری، <Link href="/voice-agent">ویس ایجنت</Link>، <Link href="/chat">چت ایجنت</Link> و <Link href="/marketing-automation">مارکتینگ اتومیشن</Link> را هم ببینید. درباره روش کار زی‌تک در <Link href="/about">درباره ما</Link> و مطالب تخصصی در <Link href="/blog">وبلاگ</Link> بیشتر بخوانید.
        </p>
      </Section>

      <FaqSection items={erpFaqItems} title={content.faq.title} />

      <Section aria-labelledby="erp-final-title" className="erp-section erp-final">
        <div className="erp-final__surface">
          <p className="text-label" dir="ltr" lang="en">{content.finalCta.kicker}</p>
          <h2 className="text-h2" id="erp-final-title">{content.finalCta.title}</h2>
          <p>{content.finalCta.lede}</p>
          <LiquidButtonLink filterId="erp-final-cta-goo" href="#contact" tone="light">{content.finalCta.cta}</LiquidButtonLink>
        </div>
      </Section>

      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd, breadcrumbJsonLd, faqJsonLd]).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
    </main>
  );
}
