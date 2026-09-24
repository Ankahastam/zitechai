import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "درباره ما؛ از فرصت هوش مصنوعی تا اجرای واقعی",
  description:
    "با رویکرد زی‌تک برای کشف فرصت‌های واقعی هوش مصنوعی، ساخت راهکار اختصاصی، یکپارچه‌سازی با سیستم‌های موجود و استقرار در عملیات آشنا شوید.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "درباره زی‌تک؛ هوش مصنوعی برای عملیات واقعی کسب‌وکار",
    description:
      "زی‌تک فرصت‌های ارزشمند هوش مصنوعی را پیدا می‌کند، راهکار مناسب را می‌سازد و آن را وارد کار روزمره کسب‌وکار می‌کند.",
    url: "/about",
    siteName: "زی‌تک",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/images/about/about-og.webp",
        width: 1200,
        height: 630,
        alt: "نمایی از راهکارهای هوش مصنوعی زی‌تک",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "درباره زی‌تک",
    description: "از کشف فرصت تا ساخت و استقرار هوش مصنوعی در عملیات واقعی کسب‌وکار.",
    images: ["/images/about/about-og.webp"],
  },
};

const advantages: readonly { icon: IconName; title: string; body: string }[] = [
  {
    icon: "search",
    title: "شروع از مسئله واقعی",
    body: "ابتدا فرایندها، داده‌ها و گلوگاه‌ها را می‌شناسیم تا مشخص شود چه چیزی واقعاً ارزش ساختن دارد.",
  },
  {
    icon: "chart",
    title: "نگاه نتیجه‌محور",
    body: "راهکار باید روی فروش، هزینه، سرعت یا تصمیم‌گیری اثر بگذارد؛ نه اینکه فقط یک نمایش فنی باشد.",
  },
  {
    icon: "link",
    title: "یکپارچگی با سیستم‌های فعلی",
    body: "راهکار را به CRM، ERP، حسابداری، سایت و ابزارهای موجود متصل می‌کنیم.",
  },
  {
    icon: "users",
    title: "همراهی تا استفاده واقعی",
    body: "در محیط واقعی همراه تیم شما تست و اصلاح می‌کنیم تا سیستم بخشی از کار روزمره شود.",
  },
];

const process = [
  {
    number: "۰۱",
    en: "Discover",
    title: "کشف",
    body: "فرایندها، ابزارها، داده‌ها و گلوگاه‌ها را بررسی می‌کنیم و فرصت‌های باارزش را جدا می‌کنیم.",
  },
  {
    number: "۰۲",
    en: "Build",
    title: "ساخت",
    body: "راهکار متناسب با فرایند واقعی کسب‌وکار طراحی، ساخته و به سیستم‌های موجود متصل می‌شود.",
  },
  {
    number: "۰۳",
    en: "Embed",
    title: "استقرار",
    body: "سیستم در محیط واقعی اجرا، همراه تیم شما اصلاح و به بخشی از عملیات روزمره تبدیل می‌شود.",
  },
] as const;

const capabilities: readonly { icon: IconName; title: string; body: string }[] = [
  { icon: "search", title: "فرصت‌سنجی و مشاوره", body: "تشخیص مسئله درست و تعریف مسیر اجرا" },
  { icon: "monitor", title: "طراحی و توسعه", body: "ساخت نرم‌افزار و راهکار هوش مصنوعی اختصاصی" },
  { icon: "link", title: "توسعه و یکپارچه‌سازی", body: "اتصال مطمئن به سیستم‌ها و داده‌های موجود" },
  { icon: "activity", title: "استقرار و بهینه‌سازی", body: "آزمون در محیط واقعی و بهبود مستمر راهکار" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "درباره زی‌تک",
  url: "https://zitechai.com/about",
  description:
    "معرفی رویکرد زی‌تک برای کشف، ساخت، یکپارچه‌سازی و استقرار راهکارهای هوش مصنوعی در کسب‌وکار.",
  inLanguage: "fa-IR",
  mainEntity: {
    "@type": "Organization",
    name: "زی‌تک",
    alternateName: "Z-Tech",
    url: "https://zitechai.com",
    logo: "https://zitechai.com/brand/logo-dark.png",
  },
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <section aria-labelledby="about-title" className="about-hero">
        <Container className="about-hero__grid">
          <div className="about-hero__content">
            <span className="about-kicker">درباره زی‌تک</span>
            <h1 className="about-hero__title" id="about-title">
              هوش مصنوعی را به بخشی از کار واقعی کسب‌وکار تبدیل می‌کنیم
            </h1>
            <p className="about-hero__lede">
              فرصت‌های واقعی را پیدا می‌کنیم، راهکار مناسب را می‌سازیم، به سیستم‌های فعلی شما متصل می‌کنیم و تا استفاده واقعی در سازمان کنار تیمتان می‌مانیم.
            </p>
            <div className="about-actions">
              <ButtonLink href="/#contact">شروع همکاری با زی‌تک</ButtonLink>
              <a className="about-text-link" href="#our-approach">آشنایی با رویکرد ما <span aria-hidden="true">←</span></a>
            </div>
          </div>

          <div aria-hidden="true" className="about-hero__visual">
            <span className="about-chip about-chip--top">کشف فرصت واقعی</span>
            <Image
              alt=""
              className="about-hero__image"
              height={630}
              preload
              sizes="(min-width: 64rem) 45vw, 90vw"
              src="/images/about/about-visual.webp"
              unoptimized
              width={900}
            />
            <span className="about-chip about-chip--bottom">ساخت و استقرار راهکار</span>
          </div>
        </Container>
      </section>

      <section aria-labelledby="about-identity-title" className="about-section about-identity">
        <Container className="about-identity__grid">
          <div className="about-identity__copy">
            <span className="about-kicker">ما که هستیم؟</span>
            <h2 className="about-heading" id="about-identity-title">از مسئله شروع می‌کنیم، نه از ابزار</h2>
            <p>
              زی‌تک یک شریک اجرایی برای تحول مبتنی بر هوش مصنوعی است. کار ما از شناخت مسئله و فرصت شروع می‌شود و با ساخت یک نمونه نمایشی تمام نمی‌شود؛ راهکار را به سیستم‌های موجود متصل می‌کنیم و تا ورود آن به عملیات واقعی پیش می‌رویم.
            </p>
            <p>
              هدف این نیست که برای هر مسئله‌ای هوش مصنوعی پیشنهاد بدهیم؛ هدف پیدا کردن همان چند فرصتی است که ارزش اجرا دارند.
            </p>
          </div>

          <figure className="about-identity__figure">
            <Image
              alt="نمادی از همکاری پیوسته زی‌تک با کسب‌وکارها"
              height={552}
              sizes="(min-width: 64rem) 46vw, 90vw"
              src="/images/about/about-infinity.webp"
              unoptimized
              width={900}
            />
            <figcaption>کشف، ساخت و استقرار؛ یک مسیر پیوسته تا نتیجه</figcaption>
          </figure>
        </Container>
      </section>

      <section aria-labelledby="about-advantages-title" className="about-section about-advantages">
        <Container>
          <div className="about-section-head">
            <span className="about-kicker">آنچه ما را متمایز می‌کند</span>
            <h2 className="about-heading" id="about-advantages-title">ترکیب شناخت کسب‌وکار، ساخت فنی و نگاه نتیجه‌محور</h2>
          </div>
          <ul className="about-card-grid">
            {advantages.map((item) => (
              <li className="about-card" key={item.title}>
                <span className="about-icon"><Icon name={item.icon} /></span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="our-approach-title" className="about-process" id="our-approach">
        <Container>
          <div className="about-process__head">
            <span className="about-kicker about-kicker--dark">مراحل کار با زی‌تک</span>
            <h2 className="about-heading" id="our-approach-title">از کشف فرصت تا استقرار در عملیات</h2>
            <p>هر مرحله خروجی مشخصی دارد و مسیر را برای تصمیم بعدی روشن می‌کند.</p>
          </div>
          <ol className="about-process__list">
            {process.map((item) => (
              <li key={item.en}>
                <div className="about-process__number" dir="ltr">{item.number}</div>
                <span lang="en">{item.en}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="about-capabilities-title" className="about-section about-capabilities">
        <Container className="about-capabilities__grid">
          <div className="about-capabilities__intro">
            <span className="about-kicker">توانمندی‌های مکمل</span>
            <h2 className="about-heading" id="about-capabilities-title">یک مسیر کامل، از تصمیم تا اجرا</h2>
            <p>
              مشاوره، طراحی، توسعه و استقرار را در یک مسیر هماهنگ پیش می‌بریم تا راهکار میان تحلیل و اجرا گم نشود.
            </p>
            <ButtonLink href="/#contact">گفت‌وگو درباره یک مسئله واقعی</ButtonLink>
          </div>
          <ul className="about-capability-grid">
            {capabilities.map((item) => (
              <li key={item.title}>
                <span className="about-icon"><Icon name={item.icon} /></span>
                <div><h3>{item.title}</h3><p>{item.body}</p></div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
    </main>
  );
}
