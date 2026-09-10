import type { Metadata } from "next";
import { ChatLeadForm } from "@/components/chat-lead-form";
import { PENDING_ANSWER, chatAgentFaqItems } from "@/components/faq-data";
import { FaqSection } from "@/components/faq-section";
import { HeroInteractiveBackground } from "@/components/hero-interactive-background";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { LiquidButtonLink } from "@/components/ui/liquid-button-link";
import { Section } from "@/components/ui/section";
import { SectionHead } from "@/components/ui/section-head";

const TITLE = "چت ایجنت اختصاصی کسب‌وکار";
const DESCRIPTION =
  "ایجنت گفتگوی هوشمند متصل به پایگاه دانش، CRM و دیتابیس محصولات شما؛ روی وب‌سایت، تلگرام، بله، ایتا، واتساپ و اینستاگرام پاسخ می‌دهد و گفت‌وگو را تا ثبت سفارش یا سرنخ پیش می‌برد.";
const CTA_LABEL = "مشاوره و راه‌اندازی";

/* No approved figure exists yet for either plan; per AGENTS.md the gap stays visible
   instead of being filled with an invented number. */
const PENDING_AMOUNT = "[در انتظار تأیید عدد نهایی]";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/chat" },
  openGraph: {
    description: DESCRIPTION,
    images: [{ alt: "زی‌تک", height: 192, url: "/brand/logo-dark.png", width: 192 }],
    locale: "fa_IR",
    siteName: "زی‌تک",
    title: `${TITLE} | زی‌تک`,
    type: "website",
    url: "/chat",
  },
};

/* Placeholder answers are kept out of structured data so nothing unapproved is indexed. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: chatAgentFaqItems
    .filter((item) => item.answer !== PENDING_ANSWER)
    .map((item) => ({
      "@type": "Question",
      acceptedAnswer: { "@type": "Answer", text: item.answer },
      name: item.question,
    })),
};

type Channel = { body: string; icon: IconName; latin: string; tag: string; title: string };
type Feature = { icon: IconName; latin: string; number: string; points: readonly string[]; title: string };
type Plan = { kind: string; items: readonly string[]; title: string };

const trust: readonly string[] = [
  "استقرار روی زیرساخت اختصاصی شما",
  "بدون جایگزینی نرم‌افزارهای فعلی",
  "امکان مداخله اپراتور انسانی در هر لحظه",
];

const channels: readonly Channel[] = [
  {
    body: "ویجت گفتگوی زنده روی سایت شما؛ پاسخ به سوال محصول، قیمت و موجودی در همان صفحه‌ای که بازدیدکننده ایستاده است.",
    icon: "monitor",
    latin: "Live Web Widget",
    tag: "ویجت گفتگوی زنده",
    title: "وب‌سایت",
  },
  {
    body: "بات اختصاصی کسب‌وکار شما در تلگرام، با همان پایگاه دانش و همان لحن پاسخ‌گویی کانال‌های دیگر.",
    icon: "send",
    latin: "Telegram Bot",
    tag: "بات اختصاصی کسب‌وکار",
    title: "تلگرام",
  },
  {
    body: "پاسخگویی در بله، ایتا و واتساپ بدون نیاز به تیم جداگانه برای هر پیام‌رسان.",
    icon: "message-square",
    latin: "Bale · Eitaa · WhatsApp",
    tag: "سه پیام‌رسان با یک پایگاه دانش",
    title: "پیام‌رسان‌های بومی و واتساپ",
  },
  {
    body: "پاسخ به دایرکت‌ها و سوال‌های پرتکرار مخاطبان و هدایت گفت‌وگو تا ثبت سفارش یا سرنخ.",
    icon: "camera",
    latin: "Instagram Direct",
    tag: "پاسخ در دایرکت",
    title: "اینستاگرام دایرکت",
  },
];

const features: readonly Feature[] = [
  {
    icon: "search",
    latin: "Knowledge Gap Discovery",
    number: "01",
    points: [
      "سوال‌هایی که ایجنت پاسخ دقیقی برایشان نداشته، در پنل به‌عنوان شکاف دانشی علامت می‌خورند.",
      "پاسخ را همان‌جا تأیید یا اصلاح می‌کنید و پایگاه دانش بدون نیاز به دانش برنامه‌نویسی به‌روز می‌شود.",
    ],
    title: "سیستم هوشمند آپدیت و کشف شکاف‌های دانشی",
  },
  {
    icon: "users",
    latin: "Live Takeover",
    number: "02",
    points: [
      "گفت‌وگوهای در جریان را زنده می‌بینید و در هر لحظه می‌توانید کنترل مکالمه را از ایجنت بگیرید.",
      "برای موارد پیچیده یا درخواست صریح مشتری، مکالمه به اپراتور انسانی منتقل می‌شود.",
    ],
    title: "مدیریت زنده با قابلیت مداخله اپراتور انسانی",
  },
  {
    icon: "chart",
    latin: "Analytics & Conversion Tracking",
    number: "03",
    points: [
      "تعداد گفت‌وگوها، پرتکرارترین سوال‌ها و مسیر تبدیل هر کانال در یک داشبورد جمع می‌شود.",
      "مصرف هوش مصنوعی و هزینه به ازای هر گفت‌وگو به‌صورت تفکیک‌شده گزارش می‌شود.",
    ],
    title: "داشبورد تحلیل و آمار تعاملات و تبدیل‌ها",
  },
  {
    icon: "link",
    latin: "Custom CRM / DB Integrations",
    number: "04",
    points: [
      "ثبت مستقیم سرنخ، سفارش یا پیش‌فاکتور در CRM و نرم‌افزار مالی فعلی شما.",
      "خواندن موجودی انبار، قیمت و وضعیت سفارش از دیتابیس یا ERP در جریان گفت‌وگو.",
    ],
    title: "اتصال به سیستم‌های نرم‌افزاری و دیتابیس اختصاصی",
  },
];

const plans: readonly Plan[] = [
  {
    items: [
      "تحلیل فرایند فروش و پشتیبانی فعلی و طراحی سناریوی گفت‌وگو",
      "ساخت پایگاه دانش اولیه از مستندات، کاتالوگ محصولات، قیمت‌ها و سوالات متداول",
      "اتصال کانال‌های انتخابی شما (وب‌سایت، تلگرام، بله، ایتا، واتساپ، اینستاگرام)",
      "راه‌اندازی پنل مدیریت، مدیریت زنده و دسترسی اپراتورها",
      "آموزش تیم و پشتیبانی اولیه راه‌اندازی",
    ],
    kind: "پرداخت یک‌بار در شروع پروژه",
    title: "راه‌اندازی، استقرار و ساخت پایگاه دانش اولیه",
  },
  {
    items: [
      "میزبانی، پایش و به‌روزرسانی ایجنت در تمام کانال‌های متصل",
      "هزینه پردازش هوش مصنوعی بر اساس مصرف واقعی، با تفکیک شفاف در داشبورد",
      "به‌روزرسانی پایگاه دانش و رفع شکاف‌های دانشی گزارش‌شده",
      "پشتیبانی فنی مستمر برای هماهنگ ماندن سیستم با تغییرات کسب‌وکار",
    ],
    kind: "پرداخت دوره‌ای بر اساس مصرف",
    title: "نگهداری ماهانه، ترافیک و مصرف هوش مصنوعی",
  },
];

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
              ایجنت گفتگوی هوشمند چندکاناله متصل به CRM و دیتابیس محصولات
            </Badge>

            <h1 className="text-h2 hero__title ca-hero__title" id="ca-hero-title">
              فروش و پشتیبانی هوشمند ۲۴ ساعته در تمام کانال‌ها! با پایگاه دانش اختصاصی کسب‌وکار شما
            </h1>

            <p className="text-body-lg hero__lede">
              یک ایجنت گفتگوی اختصاصی که همزمان روی وب‌سایت، اینستاگرام، تلگرام، ایتا، بله و
              واتساپ پاسخ می‌دهد؛ به پایگاه دانش، CRM و دیتابیس محصولات شما متصل است و گفت‌وگو را
              تا ثبت سفارش یا ثبت سرنخ پیش می‌برد.
            </p>

            <p className="hero__actions ca-hero__actions">
              <LiquidButtonLink filterId="ca-hero-cta-goo" href="#ca-form">
                {CTA_LABEL}
              </LiquidButtonLink>
              <ButtonLink className="ca-hero__secondary" href="#contact">
                درخواست دموی زنده
              </ButtonLink>
            </p>

            <ul aria-label="نکات کلیدی استقرار" className="ca-hero__trust">
              {trust.map((item) => (
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
            kicker="Omnichannel Coverage"
            title="مشتریان در هر پلتفرمی به شما پیام دهند، ایجنت پاسخ‌گو است!"
          />

          <ul aria-label="کانال‌های پاسخگویی" className="pg-grid ca-channels">
            {channels.map((channel) => (
              <li className="pg-card" key={channel.title}>
                <span className="pg-card__badge">
                  <Icon name={channel.icon} />
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
            kicker="Management Panel"
            title="ویژگی‌های اختصاصی پنل مدیریتی زی‌تک"
          />

          <ul aria-label="امکانات پنل مدیریتی" className="pg-grid">
            {features.map((feature) => (
              <li className="pg-card" key={feature.title}>
                <div className="pg-card__top">
                  <span className="pg-card__badge">
                    <Icon name={feature.icon} />
                  </span>
                  <span aria-hidden="true" className="pg-card__index" dir="ltr">
                    {feature.number}
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
        </Section>
      </div>

      <Section aria-labelledby="ca-pricing-title" className="pg-section" id="ca-pricing">
        <SectionHead
          id="ca-pricing-title"
          kicker="Transparent Pricing"
          lede="ما به شفافیت کامل در هزینه‌ها معتقدیم؛ سرمایه‌گذاری این محصول دو بخش مشخص دارد و هیچ هزینه پنهانی بیرون از این دو بخش وجود ندارد."
          title="مدل شفاف هزینه‌ها و سرمایه‌گذاری"
        />

        <div className="ca-plans">
          {plans.map((plan) => (
            <article className="ca-plan" key={plan.title}>
              <h3 className="ca-plan__title">{plan.title}</h3>
              <p className="ca-plan__amount">{PENDING_AMOUNT}</p>
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

        <p className="pg-note">
          هزینه کاملاً وابسته به پیچیدگی معماری، حجم داده و میزان اتصال به نرم‌افزارهاست. ما پس از
          جلسه تحلیل اولیه، یک پروپوزال شفاف با هزینه ثابت، زمان‌بندی مشخص و تخمین دقیق میزان بازگشت
          سرمایه ارائه می‌دهیم تا بدون ابهام مالی تصمیم بگیرید.
        </p>

        <p className="ca-plans__action">
          <LiquidButtonLink filterId="ca-price-cta-goo" href="#ca-form">
            دریافت پروپوزال شفاف
          </LiquidButtonLink>
        </p>
      </Section>

      <Section aria-labelledby="ca-form-title" className="pg-section" id="ca-form">
        <SectionHead
          id="ca-form-title"
          kicker="Deployment Request"
          lede="کانال‌های مورد نیازتان را انتخاب کنید و بنویسید ایجنت باید به چه سیستم‌هایی متصل شود؛ گفت‌وگو را از همان نقطه شروع می‌کنیم."
          title="درخواست استقرار اختصاصی و اتصال به سیستم‌ها"
        />

        <ChatLeadForm />
      </Section>

      <FaqSection items={chatAgentFaqItems} title="سوالات متداول" />

      <Section aria-labelledby="ca-cta-title" className="pg-section" id="ca-cta">
        <div className="ca-cta">
          <h2 className="text-h2 ca-cta__title" id="ca-cta-title">
            کسب‌وکارتان را هوشمندانه خودکارسازی کنید
          </h2>
          <p className="ca-cta__lede">
            کانال‌هایی که مشتریان‌تان در آن‌ها پیام می‌دهند را انتخاب کنید؛ ایجنت گفتگوی اختصاصی
            کسب‌وکار شما را روی همان‌ها مستقر می‌کنیم.
          </p>
          <p className="ca-cta__action">
            <LiquidButtonLink filterId="ca-final-cta-goo" href="#ca-form" tone="light">
              {CTA_LABEL}
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
