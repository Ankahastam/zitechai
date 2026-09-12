import { Container } from "@/components/ui/container";
import { LiquidButtonLink } from "@/components/ui/liquid-button-link";
import { homeContent } from "@/content";
import { HeroInteractiveBackground } from "./hero-interactive-background";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero">
      <div aria-hidden="true" className="hero__field">
        <HeroInteractiveBackground />
      </div>

      <Container>
        <div className="hero__content">
          <h1 className="text-h1 hero__title" id="hero-title">
            {homeContent.hero.title}
          </h1>

          <p className="text-body-lg hero__lede">
            {homeContent.hero.lede}
          </p>

          <p className="hero__actions">
            <LiquidButtonLink filterId="hero-cta-goo" href="#contact">
              {homeContent.hero.cta}
            </LiquidButtonLink>
          </p>
        </div>
      </Container>
    </section>
  );
}
