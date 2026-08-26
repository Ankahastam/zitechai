import { Container } from "@/components/ui/container";
import { CapabilityFigure } from "./capability-figure";
import type { CapabilityFigureId } from "./capability-figure";
import { CapabilityStage } from "./capability-stage";

type Capability = {
  id: CapabilityFigureId;
  number: string;
  latin: string;
  label: string;
  headline: string;
  body: string;
};

const capabilities: readonly Capability[] = [
  {
    id: 1,
    number: "01",
    latin: "Revenue Intelligence",
    label: "هوش فروش",
    headline: "از پیدا کردن لید تا پیگیری و بستن فروش.",
    body: "Lead Generation، Lead Scoring، CRM هوشمند، AI Sales Agent، فالوآپ خودکار و ارتباط با مشتری را در یک سیستم یکپارچه می‌کنیم.",
  },
  {
    id: 2,
    number: "02",
    latin: "Business Intelligence",
    label: "هوش کسب‌وکار",
    headline: "از داده‌های پراکنده تا تصمیم قابل اجرا.",
    body: "اطلاعات CRM، حسابداری، ERP و سایر سیستم‌های کسب‌وکار را یکپارچه می‌کنیم تا مدیر بتواند وضعیت شرکت را ببیند، تحلیل کند و حتی مستقیماً از داده‌هایش سؤال بپرسد.",
  },
  {
    id: 3,
    number: "03",
    latin: "Voice Intelligence",
    label: "هوش صدا",
    headline: "هر تماس، تبدیل به داده و اقدام می‌شود.",
    body: "مکالمات فروش و پشتیبانی را می‌شنویم، تحلیل می‌کنیم، خلاصه می‌کنیم و به CRM و فرآیندهای بعدی متصل می‌کنیم؛ از Call Intelligence تا Voice Agentهای ورودی و خروجی.",
  },
  {
    id: 4,
    number: "04",
    latin: "AI Customer Agents",
    label: "ایجنت‌های مشتری",
    headline: "ایجنت‌هایی که فقط پاسخ نمی‌دهند؛ کار را جلو می‌برند.",
    body: "در وب‌سایت، واتساپ، تلگرام و سایر کانال‌ها؛ مشتری را می‌شناسند، اطلاعات لازم را پیدا می‌کنند، لید می‌سازند، پیگیری می‌کنند و در زمان مناسب کار را به انسان تحویل می‌دهند.",
  },
  {
    id: 5,
    number: "05",
    latin: "Connected Automation",
    label: "اتوماسیون متصل",
    headline: "سیستم‌های جدا از هم را به یک جریان کاری تبدیل می‌کنیم.",
    body: "CRM، ERP، حسابداری، پیام‌رسان‌ها، تلفن، دیتابیس و ابزارهای داخلی را به هم متصل می‌کنیم تا کارهای تکراری بدون دخالت دستی انجام شوند.",
  },
  {
    id: 6,
    number: "06",
    latin: "Custom AI Systems",
    label: "سیستم اختصاصی",
    headline: "وقتی مسئله در قالب یک محصول آماده جا نمی‌شود.",
    body: "نرم‌افزار و سیستم اختصاصی طراحی می‌کنیم که AI از ابتدا بخشی از معماری آن است؛ برای فرآیندهایی که به راهکار مخصوص همان کسب‌وکار نیاز دارند.",
  },
];

export function Capabilities() {
  return (
    <section aria-labelledby="capabilities-title" className="caps" id="services">
      <Container>
        <header className="caps__intro">
          <p className="text-label caps__kicker" dir="ltr" lang="en">
            What We Build
          </p>
          <h2 className="caps__heading text-h2" id="capabilities-title">
            آنچه می‌سازیم.
          </h2>
          <p className="caps__lede">ما ابزارهای پراکنده نمی‌سازیم.</p>
          <p className="caps__sub">
            سیستم‌هایی می‌سازیم که فروش، عملیات و تصمیم‌گیری کسب‌وکار را هوشمندتر می‌کنند.
          </p>
        </header>

        <CapabilityStage>
          <ol className="caps__list">
            {capabilities.map((capability, index) => (
              <li className="caps__item" key={capability.number}>
                <button
                  aria-controls={`capability-${capability.id}`}
                  aria-expanded={index === 0}
                  className="caps__trigger"
                  data-capability={capability.id}
                  type="button"
                >
                  <span aria-hidden="true" className="caps__index">
                    {capability.number}
                  </span>
                  <span className="caps__label">{capability.label}</span>
                  <span className="caps__name" dir="ltr" lang="en">
                    {capability.latin}
                  </span>
                  <span aria-hidden="true" className="caps__mark" />
                </button>

                <div className="caps__detail" id={`capability-${capability.id}`}>
                  <div className="caps__detail-inner">
                    <div className="caps__detail-body">
                      <p className="caps__headline">{capability.headline}</p>
                      <p className="caps__copy">{capability.body}</p>

                      <div className="caps__visual caps__visual--inline">
                        <CapabilityFigure id={capability.id} />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div aria-hidden="true" className="caps__panel">
            {capabilities.map((capability) => (
              <div className="caps__visual" key={`figure-${capability.id}`}>
                <CapabilityFigure id={capability.id} />
              </div>
            ))}
          </div>
        </CapabilityStage>
      </Container>
    </section>
  );
}
