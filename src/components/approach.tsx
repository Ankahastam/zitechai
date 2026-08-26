import { Container } from "@/components/ui/container";
import { ApproachDiagram } from "./approach-diagram";
import { ApproachStage } from "./approach-stage";

const steps = [
  {
    index: 1,
    number: "01",
    latin: "Discover",
    persian: "کشف",
    statement: "اول مشخص می‌کنیم چه چیزی ارزش ساختن دارد.",
    body: "فرایندهای واقعی کسب‌وکار، ابزارها، داده‌ها و گلوگاه‌ها را بررسی می‌کنیم. هدف این نیست که برای هر مسئله‌ای AI پیشنهاد بدهیم؛ هدف پیدا کردن چند فرصتی است که بیشترین اثر را روی فروش، هزینه، سرعت یا تصمیم‌گیری دارند.",
  },
  {
    index: 2,
    number: "02",
    latin: "Build",
    persian: "ساخت",
    statement: "بعد، آن را می‌سازیم.",
    body: "از AI Agent و اتوماسیون تا CRM هوشمند، BI، Voice AI و نرم‌افزار اختصاصی؛ راهکار را متناسب با فرایند واقعی کسب‌وکار طراحی می‌کنیم و به CRM، ERP، حسابداری، سایت و ابزارهای فعلی متصل می‌کنیم.",
  },
  {
    index: 3,
    number: "03",
    latin: "Embed",
    persian: "استقرار",
    statement: "در نهایت، AI باید بخشی از کار روزمره شود.",
    body: "سیستم را در محیط واقعی مستقر می‌کنیم، همراه تیم شما تست و اصلاحش می‌کنیم و کاری می‌کنیم که راهکار تحویل‌شده تبدیل به یک پروژه نمایشی دیگر نشود؛ بلکه واقعاً بخشی از نحوه کار سازمان باشد.",
  },
] as const;

export function Approach() {
  return (
    <section aria-label="کشف، ساخت و استقرار" className="approach" id="approach">
      <Container>
        <ApproachStage>
          <div aria-hidden="true" className="approach__rail">
            <span className="approach__rail-track">
              <span className="approach__rail-fill" />
            </span>
            <ul className="approach__rail-marks">
              {steps.map((step) => (
                <li className="approach__rail-mark" data-mark={step.index} key={step.number}>
                  {step.number}
                </li>
              ))}
            </ul>
          </div>

          <ol className="approach__steps">
            {steps.map((step) => (
              <li className="approach__step" data-step={step.index} key={step.number}>
                <span aria-hidden="true" className="approach__figure">
                  {step.number}
                </span>

                <p className="approach__eyebrow text-label">
                  <span dir="ltr">{step.number}</span>
                  <span aria-hidden="true">—</span>
                  <span dir="ltr" lang="en">
                    {step.latin}
                  </span>
                  <span aria-hidden="true">/</span>
                  <span>{step.persian}</span>
                </p>

                <h2 className="approach__statement">{step.statement}</h2>
                <p className="approach__body">{step.body}</p>
              </li>
            ))}
          </ol>

          <div aria-hidden="true" className="approach__visual">
            <ApproachDiagram />
          </div>
        </ApproachStage>
      </Container>
    </section>
  );
}
