import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { voiceAgentFaqItems } from "@/components/faq-data";
import { FaqSection } from "@/components/faq-section";
import { HeroInteractiveBackground } from "@/components/hero-interactive-background";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { LiquidButtonLink } from "@/components/ui/liquid-button-link";
import { Section } from "@/components/ui/section";
import { SectionHead } from "@/components/ui/section-head";

const TITLE = "منشی تلفنی هوش مصنوعی";
const DESCRIPTION =
  "ایجنت صوتی هوشمند متصل به خط ویپ سازمان؛ تماس‌های ورودی را پاسخ می‌دهد، سفارش‌ها و نوبت‌ها را ثبت می‌کند و برای پیگیری فروش و وصول مطالبات تماس خروجی می‌گیرد.";
const CTA_LABEL = "رزرو جلسه دمو";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/voice-agent" },
  openGraph: {
    description: DESCRIPTION,
    images: [{ alt: "زی‌تک", height: 192, url: "/brand/logo-dark.png", width: 192 }],
    locale: "fa_IR",
    siteName: "زی‌تک",
    title: `${TITLE} | زی‌تک`,
    type: "website",
    url: "/voice-agent",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: voiceAgentFaqItems.map((item) => ({
    "@type": "Question",
    acceptedAnswer: { "@type": "Answer", text: item.answer },
    name: item.question,
  })),
};

type HeroFeature = { note?: string; title: string };
type Pair = { problem: string; solution: string };
type Entry = { body?: string; latin?: string; number?: string; points?: readonly string[]; title: string };
type Feature = { icon: IconName; latin?: string; number: string; points: readonly string[]; title: string };
type Industry = {
  body: string;
  icon: IconName;
  solves: string;
  tags: readonly string[];
  title: string;
};

const heroFeatures: readonly HeroFeature[] = [
  { note: "(پاسخ آنی و طبیعی مشابه انسان)", title: "تاخیر پاسخگویی کمتر از ۲ ثانیه" },
  { note: "بدون نیاز به پرداخت اشتراک ماهانه نرم‌افزار", title: "لایسنس مادام‌العمر" },
  { note: "بدون خستگی و اشغال خط", title: "پشتیبانی چندزبانه و ۲۴/۷" },
  { title: "اتصال بومی به خطوط VoIP / سیپ‌ترانک" },
];

const pairs: readonly Pair[] = [
  {
    problem: "از دست رفتن تماس‌ها در ساعات غیرکاری و شلوغی خطوط",
    solution: "پاسخگویی همزمان به بی‌نهایت تماس در ۷ روز هفته و ۲۴ ساعت شبانه‌روز",
  },
  {
    problem: "هزینه‌های سنگین استخدام، آموزش و جابجایی نیروی انسانی",
    solution: "استقرار مادام‌العمر یک دستیار خستگی‌ناپذیر با قیمت ثابت و بسیار اقتصادی",
  },
  {
    problem: "فراموشی ثبت مشخصات، آدرس و سرنخ‌های مشتری در CRM",
    solution: "استخراج خودکار خلاصه مکالمه، نیاز مشتری، آدرس و نکات کلیدی پس از هر تماس",
  },
  {
    problem: "تماس‌های تکراری و وقت‌گیر پیگیری و وصول مطالبات",
    solution: "تماس خروجی هوشمند، خودکار و زمان‌بندی‌شده با لحن محترمانه و دقیق",
  },
];

const features: readonly Feature[] = [
  {
    icon: "phone",
    latin: "VoIP Bridge",
    number: "01",
    points: [
      "بدون نیاز به سخت‌افزار اضافه؛ اتصال سریع و مستقیم به استریسک، ایزابل، ۳CX و انواع سیپ‌ترانک‌ها.",
      "امکان انتقال هوشمند تماس به اپراتور انسانی در صورت درخواست مشتری یا موارد پیچیده.",
    ],
    title: "اتصال مستقیم به شبکه ویپ",
  },
  {
    icon: "book",
    latin: "Knowledge Base RAG",
    number: "02",
    points: [
      "تنها با بارگذاری فایل‌های متنی و مستندات (.md / متنی)، کل اطلاعات کسب‌وکار، کاتالوگ محصولات، تورها، قیمت‌ها و سوالات متداول را به ایجنت آموزش دهید.",
      "به‌روزرسانی آنی دانش بدون نیاز به دانش برنامه‌نویسی.",
    ],
    title: "پایگاه دانش هوشمند سازمانی",
  },
  {
    icon: "users",
    number: "03",
    points: [
      "ثبت دقیق تمام مکالمات همراه با مدت زمان، فایل صوتی و دلیل قطع تماس (caller_hangup یا agent_ended).",
      "استخراج خودکار نکات و علایق مشتری (مانند استخراج آدرس، علاقه به محصول خاص، ترجیح نوع پرداخت و...). و حافظه مند بودن نسبت به هر مشتری.",
    ],
    title: "پروفایل هوشمند مشتری و CRM خودکار",
  },
  {
    icon: "phone-outgoing",
    latin: "Outbound Calling",
    number: "04",
    points: [
      "گرفتن تماس خروجی هوشمند با لیست مشتریان برای پیگیری سرنخ‌ها، یادآوری چک و اقساط، نظرسنجی و اطلاع‌رسانی.",
    ],
    title: "ماژول تماس‌های خروجی هدفمند",
  },
  {
    icon: "chart",
    number: "05",
    points: [
      "داشبورد مانیتورینگ زنده هزینه‌ها، تفکیک دقیق توکن‌های ورودی/خروجی صدا و متن، و محاسبه هزینه به ازای هر دقیقه مکالمه.",
    ],
    title: "شفافیت کامل در گزارش‌گیری و کنترل هزینه‌ها",
  },
];

const industries: readonly Industry[] = [
  {
    body: "نوبت‌دهی خودکار، پاسخ به سوالات خدمات و قیمت‌ها، آدرس‌دهی و پیگیری وضعیت بیمار.",
    icon: "activity",
    solves: "نوبت‌دهی بدون اپراتور",
    tags: ["نوبت‌دهی خودکار", "خدمات و قیمت‌ها", "پیگیری وضعیت بیمار"],
    title: "کلینیک‌ها، بیمارستان‌ها و مراکز زیبایی",
  },
  {
    body: "ثبت دقیق سفارشات تلفنی در ساعات اوج شلوغی، رزرو میز و ارائه منوی روز.",
    icon: "coffee",
    solves: "سفارش‌گیری در ساعات اوج",
    tags: ["ثبت سفارش تلفنی", "رزرو میز", "منوی روز"],
    title: "رستوران‌ها و کافی‌شاپ‌ها",
  },
  {
    body: "پاسخگویی به وضعیت اتاق‌ها، استعلام بلیط و تورها و پشتیبانی ۲۴ ساعته.",
    icon: "map-pin",
    solves: "پاسخگویی خارج از ساعت کاری",
    tags: ["وضعیت اتاق‌ها", "استعلام تور و بلیط", "پشتیبانی ۲۴ ساعته"],
    title: "هتل‌ها، اقامتگاه‌ها و آژانس‌های مسافرتی",
  },
  {
    body: "منشی ورودی برای هدایت تماس‌ها، استعلام وضعیت سفارش و پیگیری پیش‌فاکتورها.",
    icon: "shopping-cart",
    solves: "حذف صف انتظار تلفنی",
    tags: ["هدایت تماس‌ها", "وضعیت سفارش", "پیگیری پیش‌فاکتور"],
    title: "شرکت‌ها، هلدینگ‌ها و فروشگاه‌های اینترنتی",
  },
  {
    body: "منشی چندزبانه (فارسی، انگلیسی، عربی و...) برای ارتباط با مشتریان خارجی بدون نیاز به استخدام مترجم.",
    icon: "globe",
    solves: "ارتباط چندزبانه بدون مترجم",
    tags: ["فارسی، انگلیسی، عربی", "مشتریان خارجی", "بدون استخدام مترجم"],
    title: "کسب‌وکارهای بین‌المللی و توریستی",
  },
];

const useCases: readonly Entry[] = [
  {
    body: "معرفی خدمات، اعتبارسنجی اولیه نیاز مشتری، جمع‌آوری اطلاعات تماس و ارجاع لید داغ به کارشناس فروش.",
    latin: "Sales Agent",
    number: "01",
    title: "ایجنت فروش و لیدجنریشن",
  },
  {
    body: "دریافت اطلاعات دقیق مشتری، آدرس و سفارش و ثبت در سیستم.",
    latin: "Order & Booking Agent",
    number: "02",
    title: "ایجنت سفارش‌گیری و رزرو",
  },
  {
    body: "پاسخ دقیق به ده‌ها سوال متداول در لحظه بدون ماندن مشتری در صف انتظار.",
    latin: "Support & FAQ Agent",
    number: "03",
    title: "ایجنت پشتیبانی فنی و پاسخگویی",
  },
  {
    body: "تماس محترمانه و خودکار با مشتریان جهت یادآوری تاریخ چک، سررسید فاکتور و اقساط معوق.",
    latin: "Debt Collection Agent",
    number: "04",
    title: "ایجنت وصول مطالبات و یادآوری مالی",
  },
  {
    body: "تماس پس از خرید یا دریافت خدمت جهت سنجش کیفیت و ثبت بازخوردها در پنل.",
    latin: "Customer Satisfaction Agent",
    number: "05",
    title: "ایجنت نظرسنجی و رضایت‌سنجی",
  },
];

const priceIncludes: readonly string[] = [
  "استقرار کامل روی سرور اختصاصی شرکت شما",
  "لایسنس مادام‌العمر (بدون آبونمان و شارژ ماهانه نرم‌افزار)",
  "پنل مدیریت کامل (پایگاه دانش، CRM و تماس‌های خروجی)",
  "اتصال به خط تلفن و مرکز تماس VoIP",
  "آموزش و پشتیبانی اولیه راه‌اندازی",
];

const customActions: readonly string[] = [
  "اتصال به CRM اختصاصی شما (ثبت مستقیم فاکتور یا لید)",
  "خواندن موجودی انبار یا وضعیت سفارش از پایگاه داده/ERP",
  "ارسال پیامک‌های اعتبارسنجی (OTP) و لینک پرداخت در حین تماس",
  "اجرای وب‌هوک‌های اختصاصی بر اساس مکالمه مشتری",
];

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
  const content = items.map((item) => (
    <li key={item.title}>
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
    <main>
      <section aria-labelledby="va-hero-title" className="hero va-hero">
        <div aria-hidden="true" className="hero__field">
          <HeroInteractiveBackground />
        </div>

        <Container>
          <div className="hero__content">
            <Badge className="va-hero__badge">
              نسل جدید دستیار صوتی هوش مصنوعی متصل به VoIP
            </Badge>

            <h1 className="text-h2 hero__title va-hero__title" id="va-hero-title">
              هیچ تماسی بی‌پاسخ نمی‌ماند؛ منشی تلفنی هوش مصنوعی ۲۴ ساعته با قابلیت مکالمه طبیعی
            </h1>

            <p className="text-body-lg hero__lede">
              ایجنت صوتی هوشمند اختصاصی شما که مستقیماً به خط ویپ سازمان متصل می‌شود، تماس‌های
              ورودی را با تسلط کامل پاسخ می‌دهد، سفارش‌ها و نوبت‌ها را ثبت می‌کند و برای پیگیری
              فروش و وصول مطالبات تماس خروجی می‌گیرد.
            </p>

            <ul aria-label="ویژگی‌های کلیدی" className="va-hero__features">
              {heroFeatures.map((feature) => (
                <li key={feature.title}>
                  <span className="va-hero__feature-title">{feature.title}</span>
                  {feature.note ? (
                    <span className="va-hero__feature-note">{feature.note}</span>
                  ) : null}
                </li>
              ))}
            </ul>

            <p className="hero__actions">
              <LiquidButtonLink filterId="va-hero-cta-goo" href="#contact">
                {CTA_LABEL}
              </LiquidButtonLink>
            </p>

            <figure className="va-window">
              <div className="va-window__chrome">
                <span aria-hidden="true" className="va-window__dots">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="va-window__tag" dir="ltr" lang="en">
                  Voice Agent — Demo
                </span>
              </div>

              <div className="va-window__stage">
                <iframe
                  allowFullScreen
                  className="va-window__player"
                  loading="lazy"
                  src="https://www.aparat.com/video/video/embed/videohash/qyz2749/vt/frame"
                  title="ویدئوی معرفی منشی تلفنی هوش مصنوعی زی‌تک"
                />
              </div>
            </figure>
          </div>
        </Container>
      </section>

      <Section aria-labelledby="va-pairs-title" className="pg-section" id="va-challenges">
        <SectionHead
          id="va-pairs-title"
          kicker="Pain Points vs. Solution"
          title="چالش‌ها و راه‌حل"
        />

        <div className="va-pairs">
          <div className="va-pairs__row va-pairs__row--head">
            <p className="va-pairs__head">مشکل کسب‌وکار شما</p>
            <p className="va-pairs__head">راه‌حل ایجنت هوشمند ما</p>
          </div>

          <dl className="va-pairs__list">
            {pairs.map((pair) => (
              <div className="va-pairs__row" key={pair.problem}>
                <dt>
                  <span className="va-pairs__eyebrow">مشکل کسب‌وکار شما</span>
                  {pair.problem}
                </dt>
                <dd>
                  <span className="va-pairs__eyebrow">راه‌حل ایجنت هوشمند ما</span>
                  {pair.solution}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <div className="pg-band">
        <Section aria-labelledby="va-features-title" className="pg-section" id="va-features">
          <SectionHead
            id="va-features-title"
            kicker="Core Features"
            title="ویژگی‌ها و امکانات فنی پنل مدیریت"
          />

          <ul aria-label="امکانات پنل مدیریت" className="pg-grid va-bento">
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

              <h3 className="pg-card__title">پایش زنده پل صوتی</h3>

              <span aria-hidden="true" className="va-wave">
                {Array.from({ length: 11 }, (_, index) => (
                  <span key={index} style={{ "--bar": index } as CSSProperties} />
                ))}
              </span>

              <p className="pg-card__body">
                وضعیت تماس، تاخیر پاسخ و مصرف توکن در داشبورد به‌صورت زنده نمایش داده می‌شود.
              </p>
            </li>
          </ul>
        </Section>

        <Section aria-labelledby="va-industries-title" className="pg-section" id="va-industries">
          <SectionHead
            id="va-industries-title"
            kicker="Target Industries"
            title="این محصول مناسب کدام صنف‌ها و کسب‌وکارها است؟"
          />

          <ul aria-label="صنف‌ها و کسب‌وکارهای هدف" className="pg-grid va-industries">
            {industries.map((industry) => (
              <li className="pg-card pg-card--industry" key={industry.title}>
                <span className="pg-card__badge">
                  <Icon name={industry.icon} />
                </span>

                <h3 className="pg-card__title">{industry.title}</h3>
                <p className="pg-card__body">{industry.body}</p>

                <ul className="pg-tags">
                  {industry.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>

                <p className="va-solves">
                  <span className="va-solves__label">حل می‌کند</span>
                  <span>{industry.solves}</span>
                </p>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section aria-labelledby="va-usecases-title" className="pg-section" id="va-use-cases">
        <SectionHead id="va-usecases-title" kicker="Use Cases" title="سناریوهای کاربردی ایجنت" />
        <EntryList items={useCases} label="سناریوهای کاربردی ایجنت" />
      </Section>

      <Section aria-labelledby="va-pricing-title" className="pg-section" id="va-pricing">
        <SectionHead
          id="va-pricing-title"
          kicker="Transparent Pricing"
          lede="ما به شفافیت کامل در هزینه‌ها معتقدیم. هیچ هزینه پنهان یا اشتراک اجباری وجود ندارد."
          title="مدل قیمت‌گذاری شفاف و اقتصادی"
        />

        <div className="va-price">
          <div className="va-price__card">
            <h3 className="va-price__title">لایسنس پایه و استقرار</h3>
            <p className="va-price__amount">۲۰,۰۰۰,۰۰۰ تومان</p>
            <p className="va-price__note">(یک‌بار برای همیشه)</p>

            <ul aria-label="موارد شامل لایسنس پایه" className="pg-checks">
              {priceIncludes.map((item) => (
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
              نحوه محاسبه هزینه پردازش هوش مصنوعی{" "}
              <span dir="ltr" lang="en">
                (API Cost)
              </span>
            </h3>

            <ul className="va-price__api-points">
              <li>
                <strong>۰٪ کارمزد اضافی:</strong> هزینه API مدل زبانی مستقیماً از طریق اکانت و حساب
                اختصاصی خودتان شارژ می‌شود و ما هیچ‌گونه کارمزد یا درصدی روی مصرف شما دریافت
                نمی‌کنیم.
              </li>
              <li>
                <strong>اقتصادی و شفاف:</strong> میانگین هزینه مکالمه{" "}
                <strong>تنها حدود ۰.۰۴ دلار (حدود ۴ سنت) به ازای هر دقیقه مکالمه زنده</strong> است
                (یعنی برای یک مکالمه کامل ۲ دقیقه‌ای، هزینه هوش مصنوعی کمتر از ۹ سنت خواهد بود).
              </li>
              <li>
                <strong>تعهد به کاهش مستمر هزینه‌ها:</strong> تیم فنی ما به‌طور مداوم در حال
                بهینه‌سازی ساختار توکن‌ها، متدهای کَشینگ و فشرده‌سازی پرامپت‌ها است تا هزینه هر
                دقیقه مکالمه و تاخیر پاسخگویی را باز هم کمتر کند.
              </li>
            </ul>
          </div>
        </div>
      </Section>

      <Section
        aria-labelledby="va-integrations-title"
        className="pg-section"
        id="va-integrations"
      >
        <SectionHead
          id="va-integrations-title"
          kicker="Custom Actions & Integrations"
          lede="آیا نیاز دارید ایجنت صوتی کارهای پیشرفته‌تری انجام دهد؟"
          title="سفارشی‌سازی و اتصال به نرم‌افزارهای داخلی"
        />

        <ul aria-label="امکانات سفارشی" className="pg-points pg-points--standalone">
          {customActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>

        <p className="pg-note">
          جهت بررسی سیستم‌های داخلی سازمان شما و برآورد هزینه توسعه امکانات سفارشی، با کارشناسان فنی
          ما جلسه مشاوره داشته باشید.{" "}
          <a href="#contact">{CTA_LABEL}</a>
        </p>
      </Section>

      <FaqSection items={voiceAgentFaqItems} title="سوالات متداول" />

      <Section aria-labelledby="va-cta-title" className="pg-section va-cta-section" id="va-cta">
        <div className="va-cta">
          <h2 className="text-h2 va-cta__title" id="va-cta-title">
            آماده‌اید پاسخگویی تلفنی کسب‌وکارتان را متحول کنید؟
          </h2>
          <p className="va-cta__lede">
            همین حالا فرم درخواست را پر کنید تا با شما تماس بگیریم و نمونه صدای زنده ایجنت را برای
            صنف خودتان تست کنید.
          </p>
          <p className="va-cta__action">
            <LiquidButtonLink filterId="va-final-cta-goo" href="#contact">
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
