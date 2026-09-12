import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/icon";
import { homeContent } from "@/content";

export type CapabilityFigureId = "voice" | "sales" | "chat" | "systems";

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

function ChatPreview() {
  return (
    <div className="cap-demo__workspace">
      <div className="cap-demo__channels">{copy.chat.channels.map((channel) => <span key={channel}>{channel}</span>)}</div>
      <div className="cap-demo__toolbar"><span><Icon name="message-square" /> {copy.chat.toolbar}</span></div>
      <div className="cap-demo__messages"><p className="cap-demo__bubble cap-demo__bubble--customer">{copy.chat.customer}</p><p className="cap-demo__bubble">{copy.chat.agent}</p></div>
      <details className="cap-demo__action">
        <summary><span className="cap-demo__before">{copy.chat.open}</span><span className="cap-demo__after">{copy.chat.close}</span><Icon name="users" /></summary>
        <div className="cap-demo__result"><span className="cap-demo__handoff"><Icon name="users" /> {copy.chat.team}</span><p>{copy.chat.topic}</p><p>{copy.chat.history}</p></div>
      </details>
    </div>
  );
}

function SystemsPreview() {
  return (
    <div className="cap-demo__systems">
      <div className="cap-demo__system-request"><Icon name="message-square" /><span>{copy.systems.request}</span></div>
      <div className="cap-demo__connector" aria-hidden="true" />
      <div className="cap-demo__core"><Icon name="activity" /><span>{copy.systems.core}</span><small>{copy.systems.coreNote}</small></div>
      <div className="cap-demo__branches" aria-hidden="true"><span /><span /><span /></div>
      <div className="cap-demo__nodes"><span><Icon name="users" /><bdi>{copy.systems.nodes[0]}</bdi></span><span><Icon name="shopping-cart" />{copy.systems.nodes[1]}</span><span><Icon name="chart" />{copy.systems.nodes[2]}</span></div>
      <details className="cap-demo__action">
        <summary><span className="cap-demo__before">{copy.systems.open}</span><span className="cap-demo__after">{copy.systems.close}</span><Icon name="link" /></summary>
        <div className="cap-demo__result"><ol className="cap-demo__steps">{copy.systems.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
      </details>
    </div>
  );
}

const previews = { voice: VoicePreview, sales: SalesPreview, chat: ChatPreview, systems: SystemsPreview };

export function CapabilityFigure({ id }: { id: CapabilityFigureId }) {
  const Preview = previews[id];
  return (
    <figure className={`cap-demo cap-demo--${id}`}>
      <figcaption className="cap-demo__caption"><span>{copy.caption}</span><span>{copy.captionNote}</span></figcaption>
      <div className="cap-demo__scene"><Preview /></div>
    </figure>
  );
}
