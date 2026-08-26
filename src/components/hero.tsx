import { Container } from "@/components/ui/container";
import { LiquidButtonLink } from "@/components/ui/liquid-button-link";
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
            آژانس اتوماسیون و هوش مصنوعی زیتک
          </h1>

          <p className="text-body-lg hero__lede">
            متخصص تجهیز کسب و کار شما به قدرت هوش مصنوعی
          </p>

          <p className="hero__actions">
            <LiquidButtonLink filterId="hero-cta-goo" href="#contact">
              شروع همکاری با زی‌تک
            </LiquidButtonLink>
          </p>
        </div>
      </Container>
    </section>
  );
}
