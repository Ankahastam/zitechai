import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { MorphingTabs, type MorphingTabsItem } from "@/components/ui/morphing-tabs";
import { homeContent } from "@/content";
import agentNetwork from "../../public/images/home/ai-agent-network.png";
import { CapabilityFigure, type CapabilityFigureId } from "./capability-figure";

const capabilityIcons: Record<CapabilityFigureId, IconName> = {
  chat: "message-square",
  sales: "chart",
  systems: "link",
  voice: "phone",
};

const capabilities = homeContent.capabilities;

function CapabilityContent({ capability, index }: { capability: (typeof capabilities.items)[number]; index: number }) {
  return (
    <article className="caps__product" id={`capability-${capability.id}`} aria-labelledby={`capability-title-${capability.id}`}>
      <header className="caps__product-heading">
        <p className="caps__product-latin" lang="en" dir="ltr"><span>0{index + 1} /</span> {capability.latin}</p>
        <h3 id={`capability-title-${capability.id}`}>{capability.label}</h3>
      </header>
      <CapabilityFigure id={capability.id as CapabilityFigureId} />
      <div className="caps__description">
        <p className="caps__headline">{capability.headline}</p>
        <p className="caps__copy">{capability.body}</p>
        <ul className="caps__features">{capability.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        <details className="caps__more">
          <summary>{capabilities.moreLabel} <span aria-hidden="true">+</span></summary>
          <p>{capability.more}</p>
        </details>
      </div>
    </article>
  );
}

const serviceItems: MorphingTabsItem[] = capabilities.items.map((capability, index) => ({
  id: capability.id,
  label: capability.short,
  icon: <><Icon name={capabilityIcons[capability.id as CapabilityFigureId]} /><span className="caps__option-number">{String(index + 1).padStart(2, "0")}</span></>,
  content: <CapabilityContent capability={capability} index={index} />,
}));

export function Capabilities() {
  return (
    <section aria-labelledby="capabilities-title" className="caps" id="services">
      <Container>
        <header className="caps__intro">
          <div className="caps__intro-copy">
            <p className="caps__kicker text-label">{capabilities.kickerPersian} <span lang="en" dir="ltr">{capabilities.kickerLatin}</span></p>
            <h2 className="caps__heading text-h2" id="capabilities-title">
              <span>{capabilities.titleBeforeBreak}</span><br className="caps__heading-break" /> <span>{capabilities.titleAfterBreak}</span>
            </h2>
            <p className="caps__lede">{capabilities.lede} <span>{capabilities.ledeEmphasis}</span></p>
            <p className="caps__sub">{capabilities.sub}</p>
          </div>
          <Image className="caps__intro-image" src={agentNetwork} alt="نمایی انتزاعی از یک ایجنت هوشمند با شبکه‌ای از نودهای ارتباطی" sizes="(min-width: 64rem) 38rem, 100vw" />
        </header>

        <div className="caps__stage">
          <MorphingTabs
            ariaLabel={capabilities.selectorLabel}
            defaultValue={serviceItems[0]?.id}
            items={serviceItems}
            classNames={{
              root: "caps__morph-tabs",
              rail: "caps__morph-rail",
              tab: "caps__morph-tab",
              activeTab: "caps__morph-surface",
              icon: "caps__morph-icon",
              label: "caps__morph-label",
              content: "caps__morph-content",
            }}
          />
        </div>

        <footer className="caps__connection">
          <div className="caps__connection-flow" aria-hidden="true"><Icon name="phone" /><span /><Icon name="message-square" /><span /><Icon name="users" /><span /><Icon name="link" /></div>
          <h3>{capabilities.connectionTitle}</h3>
          <p>{capabilities.connectionBody} <strong>{capabilities.connectionEmphasis}</strong></p>
        </footer>
      </Container>
    </section>
  );
}
