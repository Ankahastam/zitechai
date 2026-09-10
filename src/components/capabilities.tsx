import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { CapabilityFigure, type CapabilityFigureId } from "./capability-figure";

const capabilities: {
  id: CapabilityFigureId;
  short: string;
  label: string;
  latin: string;
  icon: IconName;
  headline: string;
  body: string;
  features: string[];
  more: string;
}[] = [
  {
    id: "voice", short: "ایجنت صوتی", label: "منشی و کارشناس تلفنی هوشمند",
    latin: "Voice Agent", icon: "phone",
    headline: "تلفن شما، بدون صف انتظار و تماس ازدست‌رفته.",
    body: "تماس‌های ورودی را پاسخ می‌دهد، اطلاعات لازم را دریافت می‌کند، مشاوره می‌دهد، وقت رزرو می‌کند و در صورت نیاز تماس را به فرد مناسب منتقل می‌کند.",
    features: ["پاسخ‌گویی ورودی", "تماس خروجی", "رزرو و پیگیری", "اتصال به CRM"],
    more: "و فقط منتظر تماس نمی‌ماند. برای پیگیری لیدها، یادآوری، نظرسنجی، وصول، تأیید سفارش و سناریوهای فروش می‌تواند تماس خروجی بگیرد و نتیجه‌ی هر مکالمه را در سیستم شما ثبت کند.",
  },
  {
    id: "sales", short: "مدیر فروش", label: "مدیر فروش هوشمند",
    latin: "Sales Intelligence Agent", icon: "chart",
    headline: "چیزی که CRM شما نمی‌بیند: خودِ مکالمه.",
    body: "ایجنت مدیر فروش زی‌تک تماس‌های تیم شما را گوش می‌کند، مکالمه را تحلیل می‌کند و نشان می‌دهد مشتری کجا مردد شده، چه اعتراضی مطرح شده و کدام لید باید همین حالا پیگیری شود.",
    features: ["تحلیل تماس", "ارزیابی اپراتور", "کشف فرصت فروش", "ثبت خودکار در CRM"],
    more: "CRM به شما می‌گوید چه کسی تماس گرفته و وضعیت معامله چیست. اما نمی‌گوید در تماس چه اتفاقی افتاده است. ایجنت نشان می‌دهد کدام اپراتور بهتر می‌فروشد و چه فرصتی از دست رفته. بعد از هر تماس، خلاصه، نکات کلیدی، وضعیت مشتری و اقدام بعدی می‌تواند به‌صورت خودکار وارد CRM شود.",
  },
  {
    id: "chat", short: "ایجنت پیام‌رسان", label: "کارشناس فروش و پشتیبانی در پیام‌رسان‌ها",
    latin: "Omnichannel AI Agent", icon: "message-square",
    headline: "مشتری هرجا پیام بدهد، یک نفر پیگیر اوست.",
    body: "واتساپ، تلگرام، اینستاگرام، بله، روبیکا یا وب‌سایت؛ ایجنت شما مشتری را می‌شناسد، سؤال‌هایش را پاسخ می‌دهد و مکالمه را تا مرحله‌ی بعدی فروش جلو می‌برد.",
    features: ["مشاوره فروش", "ساخت لید", "پیگیری خودکار", "تحویل هوشمند به انسان"],
    more: "ایجنت محصولات و خدمات مناسب را پیشنهاد می‌کند، اطلاعات مشتری را ذخیره می‌کند و مکالمات قبلی را به خاطر دارد. در زمان مناسب پیگیری می‌کند و وقتی حضور انسان لازم است، گفتگو را همراه با تمام اطلاعات به تیم شما تحویل می‌دهد.",
  },
  {
    id: "systems", short: "زیرساخت متصل", label: "زیرساخت کسب‌وکار",
    latin: "Business Infrastructure", icon: "link",
    headline: "ایجنت هوشمند، بدون دسترسی به کسب‌وکار شما فقط یک چت‌بات است.",
    body: "زی‌تک زیرساخت‌های موردنیاز کسب‌وکار شما را طراحی، توسعه و یکپارچه می‌کند؛ از CRM و ERP تا بازرگانی، خزانه‌داری، حسابداری، انبارداری و سیستم‌های اختصاصی.",
    features: ["CRM و ERP", "حسابداری و خزانه‌داری", "بازرگانی و انبارداری", "سیستم‌های اختصاصی"],
    more: "برای اینکه AI بتواند واقعاً کاری انجام دهد، باید به سیستم‌های واقعی شرکت متصل باشد. به این ترتیب ایجنت می‌تواند وضعیت مشتری را ببیند، سفارش را بررسی کند، موجودی را استعلام بگیرد، اطلاعات را ثبت کند، فرآیند را اجرا کند و نتیجه را به سیستم‌های دیگر منتقل کند.",
  },
];

export function Capabilities() {
  return (
    <section aria-labelledby="capabilities-title" className="caps" id="services">
      <Container>
        <header className="caps__intro">
          <p className="caps__kicker text-label">آنچه می‌سازیم <span lang="en" dir="ltr">WHAT WE BUILD</span></p>
          <h2 className="caps__heading text-h2" id="capabilities-title">
            هوش مصنوعی که واقعاً<br className="caps__heading-break" /> وارد کسب‌وکار شما می‌شود.
          </h2>
          <p className="caps__lede">فقط پاسخ نمی‌دهد. <span>تماس می‌گیرد، می‌شنود، تحلیل می‌کند، پیگیری می‌کند و کار را جلو می‌برد.</span></p>
          <p className="caps__sub">زی‌تک ایجنت‌های هوشمندی می‌سازد که کنار تیم فروش و پشتیبانی شما کار می‌کنند و به زیرساخت واقعی کسب‌وکارتان متصل می‌شوند.</p>
        </header>

        {/* Native controls keep the entire showcase usable without JavaScript. */}
        <div className="caps__stage">
          <fieldset className="caps__selector">
            <legend className="sr-only">راهکار موردنظر را انتخاب کنید</legend>
            {capabilities.map((capability, index) => (
              <label className="caps__option" key={capability.id}>
                <input aria-controls={`capability-${capability.id}`} defaultChecked={index === 0} name="capability" type="radio" value={capability.id} />
                <span className="caps__option-face"><Icon name={capability.icon} /><span>{capability.short}</span><span className="caps__option-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></span>
              </label>
            ))}
          </fieldset>

          <div className="caps__panels">
            {capabilities.map((capability, index) => (
              <article className="caps__product" id={`capability-${capability.id}`} aria-labelledby={`capability-title-${capability.id}`} key={capability.id}>
                <header className="caps__product-heading">
                  <p className="caps__product-latin" lang="en" dir="ltr"><span>0{index + 1} /</span> {capability.latin}</p>
                  <h3 id={`capability-title-${capability.id}`}>{capability.label}</h3>
                </header>
                <CapabilityFigure id={capability.id} />
                <div className="caps__description">
                  <p className="caps__headline">{capability.headline}</p>
                  <p className="caps__copy">{capability.body}</p>
                  <ul className="caps__features">{capability.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                  <details className="caps__more">
                    <summary>بیشتر دربارهٔ این راهکار <span aria-hidden="true">+</span></summary>
                    <p>{capability.more}</p>
                  </details>
                </div>
              </article>
            ))}
          </div>
        </div>

        <footer className="caps__connection">
          <div className="caps__connection-flow" aria-hidden="true"><Icon name="phone" /><span /><Icon name="message-square" /><span /><Icon name="users" /><span /><Icon name="link" /></div>
          <h3>یک سیستم، نه چند ابزار جدا از هم.</h3>
          <p>تماس تلفنی، پیام‌های مشتری، تیم فروش، CRM و سیستم‌های داخلی را به یک سیستم متصل تبدیل می‌کنیم؛ سیستمی که <strong>می‌شنود، می‌فهمد و اقدام می‌کند.</strong></p>
        </footer>
      </Container>
    </section>
  );
}
