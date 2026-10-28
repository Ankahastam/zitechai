import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/icon";
import { homeContent } from "@/content";

export type CapabilityFigureId = "voice" | "sales" | "outbound" | "crm";

const waveform = [12, 22, 15, 34, 46, 28, 54, 38, 64, 43, 30, 51, 68, 42, 25, 48, 60, 36, 22, 42, 28, 17, 30, 12];
const copy = homeContent.capabilityPreviews;

function Waveform() {
  return <div className="cap-demo__wave" aria-hidden="true">{waveform.map((height, i) => <span key={i} style={{ "--bar": `${height}%`, "--i": i } as CSSProperties} />)}</div>;
}

function VoicePreview() {
  return (
    <div className="cap-demo__phone">
      <div className="cap-demo__phone-top"><span className="cap-demo__dot" />{copy.voice.top}<Icon name="phone" /></div>
      <div className="cap-demo__voice-center"><span className="cap-demo__avatar"><Icon name="waveform" /></span><p>{copy.voice.headline}</p><span>{copy.voice.sub}</span></div>
      <Waveform />
      <details className="cap-demo__action">
        <summary><span className="cap-demo__before">{copy.voice.open}</span><span className="cap-demo__after">{copy.voice.close}</span><span aria-hidden="true">↗</span></summary>
        <div className="cap-demo__result">
          <ol className="cap-demo__steps">{copy.voice.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          <p>{copy.voice.result}</p>
        </div>
      </details>
    </div>
  );
}

function SalesPreview() {
  return (
    <div className="cap-demo__workspace">
      <div className="cap-demo__toolbar"><span><Icon name="waveform" /> {copy.sales.toolbar}</span><span className="cap-demo__pill">{copy.sales.pill}</span></div>
      <div className="cap-demo__recording"><Waveform /><span>{copy.sales.recording}</span></div>
      <div className="cap-demo__criteria">{copy.sales.criteria.map((criterion, index) => <div key={criterion}><span>{criterion}</span><span className="cap-demo__assessment">{index === 2 ? "نیاز به بهبود" : "نقطهٔ قوت"}</span></div>)}</div>
      <blockquote className="cap-demo__quote">{copy.sales.quote}<cite>{copy.sales.cite}</cite></blockquote>
      <details className="cap-demo__action">
        <summary><span className="cap-demo__before">{copy.sales.open}</span><span className="cap-demo__after">{copy.sales.close}</span><Icon name="chart" /></summary>
        <div className="cap-demo__result">
          <dl className="cap-demo__insights"><div><dt>{copy.sales.concernLabel}</dt><dd>{copy.sales.concern}</dd></div><div><dt>{copy.sales.nextLabel}</dt><dd>{copy.sales.next}</dd></div></dl>
          <p><Icon name="link" /> {copy.sales.result}</p>
        </div>
      </details>
    </div>
  );
}

function OutboundPreview() {
  return (
    <div className="cap-demo__workspace">
      <div className="cap-demo__toolbar"><span><Icon name="phone-outgoing" /> {copy.outbound.toolbar}</span></div>
      <div className="cap-demo__file"><Icon name="users" /><bdi>{copy.outbound.file}</bdi></div>
      <ol className="cap-demo__journey">{copy.outbound.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      <details className="cap-demo__action">
        <summary><span className="cap-demo__before">{copy.outbound.open}</span><span className="cap-demo__after">{copy.outbound.close}</span><span aria-hidden="true">+</span></summary>
        <div className="cap-demo__result"><ul className="cap-demo__steps">{copy.outbound.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul><p>{copy.outbound.result}</p></div>
      </details>
    </div>
  );
}

function CrmPreview() {
  return (
    <div className="cap-demo__workspace">
      <div className="cap-demo__toolbar"><span><Icon name="users" /> {copy.crm.toolbar}</span><span lang="en" dir="ltr">CRM</span></div>
      <ol className="cap-demo__journey">{copy.crm.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      <details className="cap-demo__action">
        <summary><span className="cap-demo__before">{copy.crm.open}</span><span className="cap-demo__after">{copy.crm.close}</span><Icon name="link" /></summary>
        <div className="cap-demo__result"><p>{copy.crm.result}</p></div>
      </details>
    </div>
  );
}

const previews = { voice: VoicePreview, sales: SalesPreview, outbound: OutboundPreview, crm: CrmPreview };

export function CapabilityFigure({ id }: { id: CapabilityFigureId }) {
  const Preview = previews[id];
  return (
    <figure className={`cap-demo cap-demo--${id}`}>
      <figcaption className="cap-demo__caption"><span>{copy.caption}</span><span>{copy.captionNote}</span></figcaption>
      <div className="cap-demo__scene" data-ui><Preview /></div>
    </figure>
  );
}
