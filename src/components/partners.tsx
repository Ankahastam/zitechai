import Image from "next/image";
import { Container } from "@/components/ui/container";
import { homeContent } from "@/content";
import { PartnerSlider } from "./partner-slider";

export function Partners() {
  const content = homeContent.partners;

  return (
    <section aria-labelledby="partners-title" className="partners" id="partners">
      <Container>
        <PartnerSlider
          itemCount={content.items.length}
          heading={<div><p className="partners__kicker text-label">{content.kicker}</p><h2 id="partners-title">{content.title}</h2></div>}
          nextLabel={content.nextLabel}
          previousLabel={content.previousLabel}
          railLabel={content.railLabel}
        >
          {[0, 1, 2].flatMap((copy) => content.items.map((partner) => (
            <li aria-hidden={copy !== 1 || undefined} className="partners__item" key={`${copy}-${partner.id}`}>
              <div className="partners__logo">
                <Image alt={`لوگوی ${partner.name}`} height={300} src={partner.logo} width={480} />
              </div>
              <h3>{partner.url ? <a href={partner.url} rel="noopener noreferrer" tabIndex={copy !== 1 ? -1 : undefined} target="_blank">{partner.name}</a> : partner.name}</h3>
              <p>{partner.description}</p>
            </li>
          )))}
        </PartnerSlider>
      </Container>
    </section>
  );
}
