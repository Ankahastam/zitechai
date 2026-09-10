import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/icon";

export type CapabilityFigureId = "voice" | "sales" | "chat" | "systems";

const waveform = [12, 22, 15, 34, 46, 28, 54, 38, 64, 43, 30, 51, 68, 42, 25, 48, 60, 36, 22, 42, 28, 17, 30, 12];

function Waveform() {
  return <div className="cap-demo__wave" aria-hidden="true">{waveform.map((height, i) => <span key={i} style={{ "--bar": `${height}%`, "--i": i } as CSSProperties} />)}</div>;
}

function VoicePreview() {
  return (
    <div className="cap-demo__phone">
      <div className="cap-demo__phone-top"><span className="cap-demo__dot" />ایجنت تلفنی زی‌تک<Icon name="phone" /></div>
      <div className="cap-demo__voice-center"><span className="cap-demo__avatar"><Icon name="waveform" /></span><p>از مکالمه تا اقدام.</p><span>پاسخ‌گویی · رزرو · پیگیری</span></div>
      <Waveform />
      <details className="cap-demo__action">
        <summary><span className="cap-demo__before">مسیر یک تماس را ببینید</span><span className="cap-demo__after">بستن مسیر تماس</span><span aria-hidden="true">↗</span></summary>
        <div className="cap-demo__result">
          <ol className="cap-demo__steps"><li>دریافت درخواست مشتری</li><li>رزرو زمان مشاوره</li><li>ثبت نتیجه در CRM</li></ol>
          <p>تماس خروجی برای یادآوری و پیگیری</p>
        </div>
      </details>
    </div>
  );
}

function SalesPreview() {
  return (
    <div className="cap-demo__workspace">
      <div className="cap-demo__toolbar"><span><Icon name="waveform" /> مرور مکالمه</span><span className="cap-demo__pill">تماس فروش</span></div>
      <div className="cap-demo__recording"><Waveform /><span>مشتری / کارشناس</span></div>
      <blockquote className="cap-demo__quote">«راهکار مناسبه، ولی برای اتصال به سیستم فعلی‌مون نیاز به توضیح بیشتری داریم.»<cite>بخشی از یک مکالمهٔ فرضی</cite></blockquote>
      <details className="cap-demo__action">
        <summary><span className="cap-demo__before">تحلیل این مکالمه</span><span className="cap-demo__after">بستن تحلیل</span><Icon name="chart" /></summary>
        <div className="cap-demo__result">
          <dl className="cap-demo__insights"><div><dt>دغدغهٔ مشتری</dt><dd>اتصال به سیستم فعلی</dd></div><div><dt>اقدام بعدی</dt><dd>هماهنگی جلسهٔ فنی</dd></div></dl>
          <p><Icon name="link" /> خلاصه و اقدام بعدی ← CRM</p>
        </div>
      </details>
    </div>
  );
}

function ChatPreview() {
  return (
    <div className="cap-demo__workspace">
      <div className="cap-demo__channels"><span>واتساپ</span><span>تلگرام</span><span>وب‌سایت</span><span>…</span></div>
      <div className="cap-demo__toolbar"><span><Icon name="message-square" /> یک گفتگو، در همهٔ کانال‌ها</span></div>
      <div className="cap-demo__messages"><p className="cap-demo__bubble cap-demo__bubble--customer">سلام، می‌خوام دربارهٔ اتصال به CRM با یک کارشناس صحبت کنم.</p><p className="cap-demo__bubble">حتماً. موضوع گفتگو و اطلاعات شما را به کارشناس منتقل می‌کنم تا از همین‌جا ادامه بدهید.</p></div>
      <details className="cap-demo__action">
        <summary><span className="cap-demo__before">تحویل گفتگو به کارشناس</span><span className="cap-demo__after">بازگشت به گفتگو</span><Icon name="users" /></summary>
        <div className="cap-demo__result"><span className="cap-demo__handoff"><Icon name="users" /> تیم فروش</span><p>موضوع: اتصال به CRM</p><p>اطلاعات مشتری + تاریخچهٔ گفتگو</p></div>
      </details>
    </div>
  );
}

function SystemsPreview() {
  return (
    <div className="cap-demo__systems">
      <div className="cap-demo__system-request"><Icon name="message-square" /><span>«وضعیت سفارش من چیه؟»</span></div>
      <div className="cap-demo__connector" aria-hidden="true" />
      <div className="cap-demo__core"><Icon name="activity" /><span>ایجنت زی‌تک</span><small>می‌فهمد و اقدام می‌کند</small></div>
      <div className="cap-demo__branches" aria-hidden="true"><span /><span /><span /></div>
      <div className="cap-demo__nodes"><span><Icon name="users" /><bdi>CRM</bdi></span><span><Icon name="shopping-cart" />انبارداری</span><span><Icon name="chart" />حسابداری</span></div>
      <details className="cap-demo__action">
        <summary><span className="cap-demo__before">مسیر بررسی سفارش</span><span className="cap-demo__after">بستن مسیر بررسی</span><Icon name="link" /></summary>
        <div className="cap-demo__result"><ol className="cap-demo__steps"><li>شناخت مشتری در CRM</li><li>استعلام سفارش و موجودی</li><li>بررسی پرداخت و ثبت نتیجه</li></ol></div>
      </details>
    </div>
  );
}

const previews = { voice: VoicePreview, sales: SalesPreview, chat: ChatPreview, systems: SystemsPreview };

export function CapabilityFigure({ id }: { id: CapabilityFigureId }) {
  const Preview = previews[id];
  return (
    <figure className={`cap-demo cap-demo--${id}`}>
      <figcaption className="cap-demo__caption"><span>نمایش نمونه</span><span>سناریوی فرضی · قابل تعامل</span></figcaption>
      <div className="cap-demo__scene"><Preview /></div>
    </figure>
  );
}
