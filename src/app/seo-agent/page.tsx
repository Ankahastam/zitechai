import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { seoAgentContent as content, siteContent } from "@/content";
import styles from "./seo-agent.module.css";

const canonical = `${siteContent.seo.siteUrl}${content.seo.canonical}`;
const ogImage = `${siteContent.seo.siteUrl}/images/seo-agent/data-to-action.webp`;

export const metadata: Metadata = {
  title: { absolute: content.seo.title },
  description: content.seo.description,
  alternates: { canonical: content.seo.canonical },
  openGraph: {
    title: content.seo.title,
    description: content.seo.description,
    url: canonical,
    type: "website",
    locale: siteContent.seo.locale,
    siteName: siteContent.seo.siteName,
    images: [{ url: ogImage, width: 1600, height: 800, alt: content.hero.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: content.seo.title,
    description: content.seo.description,
    images: [ogImage],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonical}#service`,
    name: content.hero.name,
    description: content.seo.description,
    url: canonical,
    provider: { "@id": `${siteContent.seo.siteUrl}/#organization` },
    serviceType: "تحلیل و مدیریت سئو با هوش مصنوعی",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "زی‌تک", item: siteContent.seo.siteUrl },
      { "@type": "ListItem", position: 2, name: content.hero.name, item: canonical },
    ],
  },
];

const workflowIcons: IconName[] = ["link", "search", "globe", "book", "monitor", "chart"];
const audienceIcons: IconName[] = ["briefcase", "users", "globe", "monitor"];
const operationIcons: IconName[] = ["search", "activity", "chart"];

export default function SeoAgentPage() {
  return (
    <main className={styles.page}>
      <section aria-labelledby="seo-hero-title" className={styles.hero}>
        <Container>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{content.hero.name}</p>
            <h1 id="seo-hero-title">{content.hero.title.replace("؛ ", "؛\n")}</h1>
            <p className={styles.heroLede}>{content.hero.paragraphs[1]}</p>
            <div className={styles.actions}>
              <ButtonLink className={styles.primary} href="#contact">
                {content.hero.primaryCta}
                <span aria-hidden="true">↗</span>
              </ButtonLink>
              <Link className={styles.secondary} href="#seo-features">
                {content.hero.secondaryCta}
                <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>
          <figure className={styles.heroArt}>
            <Image
              alt="تصویر مفهومی پیوند داده‌های پراکنده در یک مسیر یکپارچه از تحلیل تا اقدام"
              fetchPriority="high"
              height={800}
              loading="eager"
              sizes="(max-width: 1280px) calc(100vw - 40px), 1200px"
              src="/images/seo-agent/data-to-action.webp"
              width={1600}
            />
          </figure>
          <p className={styles.intro}>{content.hero.paragraphs[0]}</p>
        </Container>
      </section>

      <section aria-labelledby="seo-problem-title" className={styles.section}>
        <Container>
          <div className={styles.problem}>
            <h2 id="seo-problem-title">{content.problem.title}</h2>
            <ul className={styles.sources}>
              {content.problem.paragraphs[0].split("\n").map((line) => <li key={line}>{line}</li>)}
            </ul>
          </div>
          <div className={styles.question}>
            <p>{content.problem.paragraphs[1]}</p>
            <p className={styles.questionText}>{content.problem.paragraphs[2]}</p>
            <p>{content.problem.paragraphs[3]}</p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="seo-workflow-title" className={styles.section} id="seo-workflow">
        <Container>
          <h2 id="seo-workflow-title">{content.workflow.title}</h2>
          <ol className={styles.workflow}>
            {content.workflow.features.map((item, index) => (
              <li key={item.title}>
                <div className={styles.stepMark}>
                  <Icon name={workflowIcons[index] ?? "search"} />
                  <span aria-hidden="true">{(index + 1).toLocaleString("fa-IR")}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body.join(" ")}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <div className={styles.section} id="seo-features">
        <Container>
          <div className={styles.featureGrid}>
            <section aria-labelledby="seo-dashboard-title" className={styles.dashboard}>
              <div className={styles.featureIcon}><Icon name="chart" /></div>
              <h2 id="seo-dashboard-title">{content.dashboard.title}</h2>
              <p>{content.dashboard.paragraphs[0]}</p>
              <ul className={styles.checklist}>
                {content.dashboard.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
              <p className={styles.emphasis}>{content.dashboard.paragraphs[1]}</p>
            </section>
            <section aria-labelledby="seo-opportunities-title" className={styles.opportunities}>
              <div className={styles.featureIcon}><Icon name="search" /></div>
              <h2 id="seo-opportunities-title">{content.opportunities.title}</h2>
              <p>{content.opportunities.paragraphs[0]}</p>
              <div className={styles.opportunityList}>
                {content.opportunities.features.map((item, index) => (
                  <details key={item.title} name="seo-opportunity" open={index === 0}>
                    <summary><h3 dir="ltr" lang="en">{item.title}</h3><span aria-hidden="true">+</span></summary>
                    <p>{item.body.join(" ")}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </Container>
      </div>

      <section aria-labelledby="seo-technical-title" className={styles.section}>
        <Container>
          <div className={styles.technical}>
            <div>
              <div className={styles.featureIcon}><Icon name="monitor" /></div>
              <h2 id="seo-technical-title">{content.technical.title}</h2>
              <p>{content.technical.paragraphs[0]}</p>
              <p className={styles.emphasis}>{content.technical.paragraphs[2]}</p>
            </div>
            <div>
              <p>{content.technical.paragraphs[1]}</p>
              <ul className={styles.auditList}>
                {content.technical.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="seo-research-title" className={`${styles.section} ${styles.research}`}>
        <Container>
          <div className={styles.centerCopy}>
            <h2 id="seo-research-title">{content.research.title}</h2>
            <p className={styles.emphasis}>{content.research.paragraphs[0]}</p>
            <p>{content.research.paragraphs[1]}</p>
            <p>{content.research.paragraphs[2]}</p>
          </div>
          <ol className={styles.pipeline} dir="ltr" lang="en">
            {content.research.paragraphs[3].split(" → ").map((stage, index) => (
              <li key={stage}>
                {index > 0 ? <span aria-hidden="true" className={styles.pipelineArrow}> → </span> : null}
                <span>{stage}</span>
              </li>
            ))}
          </ol>
          <p className={styles.pipelineEnd}>{content.research.paragraphs[4]}</p>
        </Container>
      </section>

      <section aria-labelledby="seo-studio-title" className={styles.section}>
        <Container>
          <div className={styles.sectionHead}>
            <h2 id="seo-studio-title">{content.studio.title}</h2>
            {content.studio.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <dl className={styles.studioList}>
            {content.studio.features.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.body.join(" ")}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section aria-labelledby="seo-visibility-title" className={styles.section}>
        <Container>
          <div className={styles.visibility}>
            <div>
              <p className={styles.eyebrow}>{content.visibility.paragraphs[0]}</p>
              <h2 id="seo-visibility-title">{content.visibility.title}</h2>
              <p>{content.visibility.paragraphs[1]}</p>
              <p>{content.visibility.paragraphs[4]}</p>
              <ul className={styles.visibilityList}>
                {content.visibility.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
            <figure className={styles.visibilityArt}>
              <Image
                alt="تصویر مفهومی دیده‌شدن یک برند از میان پنج مسیر جست‌وجوی هوش مصنوعی"
                height={1000}
                sizes="(max-width: 768px) calc(100vw - 40px), 550px"
                src="/images/seo-agent/ai-visibility.webp"
                width={1000}
              />
            </figure>
          </div>
          <div className={styles.engines}>
            <p>{content.visibility.paragraphs[2]}</p>
            <p dir="ltr" lang="en">{content.visibility.paragraphs[3]}</p>
          </div>
          <div className={styles.searchFuture}>
            <h3 dir="ltr" lang="en">{content.visibility.features[0].title}</h3>
            <p>{content.visibility.features[0].body[0]}</p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="seo-rank-title" className={styles.section}>
        <Container>
          <div className={styles.rank}>
            <div className={styles.sectionHead}>
              <h2 id="seo-rank-title">{content.rank.title}</h2>
              <p>{content.rank.paragraphs[0]}</p>
            </div>
            <ul className={styles.rankList}>
              {content.rank.points.map((point) => <li key={point}><Icon name="activity" />{point}</li>)}
            </ul>
          </div>
        </Container>
      </section>

      <section aria-labelledby="seo-wordpress-title" className={styles.section}>
        <Container>
          <div className={styles.wordpress}>
            <div className={styles.wordpressGrid}>
              <div>
                <p className={styles.eyebrow} dir="ltr" lang="en">ZiTech SEO Bridge</p>
                <h2 id="seo-wordpress-title">{content.wordpress.title}</h2>
                <p>{content.wordpress.paragraphs[0]}</p>
                <p className={styles.emphasis}>{content.wordpress.paragraphs[1]}</p>
                <p>{content.wordpress.paragraphs[2]}</p>
                <p>{content.wordpress.paragraphs[3]}</p>
              </div>
              <div className={styles.wordpressControls}>
                <Icon name="link" />
                <p>{content.wordpress.paragraphs[4]}</p>
                <ul dir="ltr" lang="en">
                  {content.wordpress.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
                <p>{content.wordpress.paragraphs[5]}</p>
                <p className={styles.plugins} dir="ltr" lang="en">{content.wordpress.paragraphs[6]}</p>
              </div>
            </div>
            <div className={styles.rollback}>
              <div>
                <p>{content.wordpress.paragraphs[7]}</p>
                <p dir="ltr" lang="en">{content.wordpress.paragraphs[8]}</p>
              </div>
              <p className={styles.emphasis}>{content.wordpress.paragraphs[9]}</p>
            </div>
          </div>
        </Container>
      </section>

      <div className={styles.section}>
        <Container>
          <div className={styles.operations}>
            {[content.competitors, content.alerts, content.reports].map((section, index) => (
              <details className={styles.operation} key={section.title} name="seo-operations" open={index === 0}>
                <summary>
                  <span className={styles.featureIcon}><Icon name={operationIcons[index]} /></span>
                  <h2>{section.title}</h2>
                  <span aria-hidden="true" className={styles.expand}>+</span>
                </summary>
                <div className={styles.operationBody}>
                  <p>{section.paragraphs[0]}</p>
                  {index > 0 ? <p>{section.paragraphs[1]}</p> : null}
                  <ul className={styles.operationList}>
                    {section.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                  {index > 0 ? <p className={styles.emphasis}>{section.paragraphs[2]}</p> : null}
                </div>
              </details>
            ))}
          </div>
        </Container>
      </div>

      <section aria-labelledby="seo-audiences-title" className={styles.section}>
        <Container>
          <h2 id="seo-audiences-title">{content.audiences.title}</h2>
          <dl className={styles.audiences}>
            {content.audiences.features.map((item, index) => (
              <div key={item.title}>
                <Icon name={audienceIcons[index] ?? "users"} />
                <dt>{item.title}</dt>
                <dd>{item.body.join(" ")}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section aria-labelledby="seo-system-title" className={`${styles.section} ${styles.system}`}>
        <Container>
          <div className={styles.centerCopy}>
            <h2 id="seo-system-title">{content.system.title}</h2>
            <p>{content.system.paragraphs[0]}</p>
            <p>{content.system.paragraphs[1]}</p>
          </div>
          <p className={styles.formula}>{content.system.paragraphs[2]}</p>
          <p className={styles.emphasis}>{content.system.paragraphs[3]}</p>
        </Container>
      </section>

      <section aria-labelledby="seo-localization-title" className={styles.section}>
        <Container>
          <div className={styles.localization}>
            <div className={styles.featureIcon}><Icon name="globe" /></div>
            <div>
              <h2 id="seo-localization-title">{content.localization.title}</h2>
              {content.localization.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="seo-final-title" className={`${styles.section} ${styles.final}`}>
        <Container>
          <div className={styles.finalSurface}>
            <h2 id="seo-final-title">{content.finalCta.title}</h2>
            <p>{content.finalCta.paragraphs[0]}</p>
            <p className={styles.finalPromise}>{content.finalCta.paragraphs[1]}</p>
            <h3 dir="ltr" lang="en">{content.finalCta.features[0].title}</h3>
            <p>{content.finalCta.features[0].body[0]}</p>
            <ButtonLink className={styles.primary} href="#contact">{content.finalCta.cta}<span aria-hidden="true">↗</span></ButtonLink>
          </div>
        </Container>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </main>
  );
}
