import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { siteContent } from "@/content";
import { ReferralForm } from "./referral-form";
import styles from "./referral.module.css";

const title = "همکاری در فروش با زی‌تک";
const description = "اگر با کسب‌وکارها در ارتباط هستید، خدمات هوش مصنوعی زی‌تک را به مشتریانتان معرفی کنید. برای شروع همکاری تجاری، فرم همکاری در فروش را تکمیل کنید.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/referral" },
  openGraph: { title, description, url: "/referral", locale: "fa_IR", type: "website", images: [siteContent.seo.ogImage] },
  twitter: { card: "summary", title, description, images: [siteContent.seo.ogImage.url] },
};

const audiences = [
  ["شرکت‌های نرم‌افزاری و فناوری", "توسعه‌دهندگان نرم‌افزار، مجریان CRM و ERP و شرکت‌های خدمات فناوری اطلاعات"],
  ["مشاوران کسب‌وکار و فروش", "مشاوران مدیریت، تحول دیجیتال، بازاریابی و توسعه کسب‌وکار"],
  ["مدرسان و مجموعه‌های آموزشی", "مدرسان مدیریت و فناوری، آموزشگاه‌ها و برگزارکنندگان دوره‌های سازمانی"],
  ["آژانس‌ها و ارائه‌دهندگان خدمات", "آژانس‌های دیجیتال مارکتینگ، طراحان وب و دیگر مجموعه‌های در ارتباط با کسب‌وکارها"],
] as const;

export default function ReferralPage() {
  return (
    <main className={styles.page} id="main-content">
      <Container>
        <nav aria-label="مسیر صفحه" className={styles.breadcrumb}>
          <Link href="/">زی‌تک</Link><span aria-hidden="true">/</span><span>همکاری در فروش</span>
        </nav>
        <div className={styles.layout}>
          <div className={styles.intro}>
            <h1>همکاری در فروش<br /><span>با زی‌تک</span></h1>
            <p className={styles.lede}>شما مشتریانتان را می‌شناسید.<br />ما راهکار هوش مصنوعی را می‌سازیم.</p>
            <p className={styles.description}>اگر شرکت نرم‌افزاری، مشاور کسب‌وکار، مدرس یا ارائه‌دهنده خدمات به کسب‌وکارها هستید، می‌توانید خدمات زی‌تک را به مشتریانتان معرفی کنید و برای فروش این خدمات با ما همکاری تجاری داشته باشید.</p>
            <section aria-labelledby="referral-audiences" className={styles.audiences}>
              <h2 id="referral-audiences">این همکاری برای چه کسانی مناسب است؟</h2>
              <ul>{audiences.map(([heading, body]) => (
                <li key={heading}><h3>{heading}</h3><p>{body}</p></li>
              ))}</ul>
              <p className={styles.other}>حوزه شما در این فهرست نیست؟ اگر می‌توانید خدمات زی‌تک را به مشتریانتان معرفی کنید، از آشنایی با شما استقبال می‌کنیم.</p>
            </section>
          </div>
          <section aria-labelledby="referral-form-title" className={styles.panel}>
            <h2 id="referral-form-title">شروع یک همکاری تازه</h2>
            <p className={styles.formIntro}>برای گفت‌وگو درباره همکاری تجاری، اطلاعات زیر را وارد کنید.</p>
            <ReferralForm />
          </section>
        </div>
      </Container>
    </main>
  );
}
