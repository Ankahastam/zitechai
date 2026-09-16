import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { siteContent } from "@/content";

const title = "درباره زی‌تک";
const description = "زی‌تک یک شرکت مهندسی هوش مصنوعی است که سیستم‌های هوشمند متناسب با فرآیند واقعی کسب‌وکارها طراحی و پیاده‌سازی می‌کند.";

const steps = [
  {
    title: "شناخت کسب‌وکار",
    body: "ابتدا فرآیندها، چالش‌ها و فرصت‌های سازمان شما را بررسی می‌کنیم.",
  },
  {
    title: "طراحی راهکار",
    body: "بر اساس نیاز واقعی شما، معماری و سیستم هوشمند مناسب طراحی می‌شود.",
  },
  {
    title: "پیاده‌سازی و اتصال",
    body: "راهکار AI به ابزارها و زیرساخت‌های موجود سازمان متصل می‌شود.",
  },
  {
    title: "بهبود مستمر",
    body: "سیستم با استفاده از داده‌های واقعی کسب‌وکار به مرور بهتر می‌شود.",
  },
];

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    description,
    images: [siteContent.seo.ogImage],
    locale: siteContent.seo.locale,
    siteName: siteContent.seo.siteName,
    title: `${title} | ${siteContent.seo.siteName}`,
    type: "website",
    url: "/about",
  },
  twitter: { card: "summary_large_image", description, images: [siteContent.seo.ogImage.url], title },
};

export default function AboutPage() {
  return (
    <main className="about">
      <section aria-labelledby="about-title" className="about-hero">
        <Container>
          <h1 className="about-hero__kicker" id="about-title">درباره زی‌تک</h1>
          <h2 className="about-hero__title">هوش مصنوعی زمانی ارزشمند است که به نتیجه واقعی در کسب‌وکار تبدیل شود</h2>

          <div className="about-hero__intro">
            <p className="about-hero__lead">زی‌تک (Zitech AI) یک شرکت مهندسی هوش مصنوعی است که به سازمان‌ها کمک می‌کند فرآیندهای خود را با استفاده از AI هوشمندتر، سریع‌تر و دقیق‌تر کنند.</p>
            <div>
              <p>امروز نرم‌افزارهای آماده برای پاسخ‌گویی به نیازهای عمومی ساخته می‌شوند؛ اما هر سازمان، جریان کاری، داده‌ها و چالش‌های منحصربه‌فرد خود را دارد.</p>
              <p>زی‌تک به جای ارائه یک ابزار یکسان برای همه، سیستم‌های هوشمند متناسب با فرآیند واقعی هر کسب‌وکار را طراحی و پیاده‌سازی می‌کند.</p>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="about-value-title" className="about-section about-value">
        <Container className="about-split">
          <header className="about-section__header">
            <span aria-hidden="true" className="about-section__index">01</span>
            <h2 id="about-value-title">از ابزار هوش مصنوعی تا سیستم هوشمند کسب‌وکار</h2>
          </header>
          <div className="about-section__body">
            <p>ما باور داریم ارزش AI در ساخت یک ابزار جدید نیست؛ ارزش واقعی زمانی ایجاد می‌شود که هوش مصنوعی بتواند در کنار تیم شما کار کند، تصمیم‌گیری را بهتر کند و فرآیندهای سازمان را بهبود دهد.</p>
            <p className="about-callout">تمرکز ما فقط ساخت AI نیست؛<br />تمرکز ما ساخت <strong><bdi dir="ltr">ROI</bdi> قابل اندازه‌گیری</strong> برای کسب‌وکارهاست.</p>
            <p>از افزایش بهره‌وری تیم فروش و بهبود ارتباط با مشتری تا تحلیل داده‌ها و اتوماسیون فرآیندهای داخلی، هر راهکار زی‌تک با هدف ایجاد یک نتیجه مشخص طراحی می‌شود.</p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="about-process-title" className="about-section about-process">
        <Container>
          <header className="about-section__header about-section__header--wide">
            <span aria-hidden="true" className="about-section__index">02</span>
            <h2 id="about-process-title">چگونه کار می‌کنیم؟</h2>
          </header>
          <ol className="about-steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true" className="about-steps__number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="about-team-title" className="about-section">
        <Container className="about-split">
          <header className="about-section__header">
            <span aria-hidden="true" className="about-section__index">03</span>
            <h2 id="about-team-title">تیم زی‌تک</h2>
          </header>
          <div className="about-section__body about-section__body--large">
            <p>زی‌تک توسط تیمی از متخصصان هوش مصنوعی و مهندسان نرم‌افزار ساخته شده است که تمرکز آن‌ها توسعه سیستم‌های هوشمند کاربردی برای حل مسائل واقعی کسب‌وکارهاست.</p>
            <p>ما تکنولوژی‌های جدید AI را با دانش مهندسی نرم‌افزار ترکیب می‌کنیم تا راهکارهایی بسازیم که قابل استفاده، قابل توسعه و متناسب با نیاز هر سازمان باشند.</p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="about-future-title" className="about-future">
        <Container>
          <div className="about-future__surface">
            <span aria-hidden="true" className="about-section__index">04</span>
            <h2 id="about-future-title">آینده کسب‌وکارها با AI ساخته می‌شود</h2>
            <p>ما در زی‌تک به دنبال آینده‌ای هستیم که در آن هر سازمان بتواند از هوش مصنوعی به عنوان یک نیروی هوشمند در کنار تیم خود استفاده کند.</p>
            <p className="about-future__closing">نه فقط برای انجام یک وظیفه؛<br /><strong>بلکه برای ساختن روش‌های بهتر کار کردن.</strong></p>
          </div>
        </Container>
      </section>
    </main>
  );
}
