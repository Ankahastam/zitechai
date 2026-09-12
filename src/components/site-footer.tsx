import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LiquidButtonLink } from "@/components/ui/liquid-button-link";
import { Logo } from "@/components/ui/logo";
import { siteContent } from "@/content";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <Container>
        <div className="site-footer__glass">
          <section aria-labelledby="footer-cta-title" className="site-footer__cta-block">
            <div>
              <h2 className="site-footer__headline" id="footer-cta-title">
                {siteContent.footer.headline}
              </h2>
              <p className="site-footer__lede">{siteContent.footer.lede}</p>
            </div>

            <div className="site-footer__actions">
              <LiquidButtonLink
                className="site-footer__cta"
                filterId="footer-cta-goo"
                href="#contact"
                tone="light"
              >
                <span>{siteContent.footer.cta}</span>
                <span aria-hidden="true" className="site-footer__arrow">←</span>
              </LiquidButtonLink>
              <Link className="site-footer__secondary" href={siteContent.footer.secondaryHref}>
                {siteContent.footer.secondaryCta}
              </Link>
            </div>
          </section>

          <div className="site-footer__meta">
            <Logo tone="light" />

            <nav aria-label="ناوبری پاورقی" className="site-footer__nav">
              <ul>
                {siteContent.footer.links.map((link) => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </nav>

            <p className="site-footer__copyright">
              <span dir="ltr">{siteContent.footer.copyrightLatin}</span>{" "}
              <span>{siteContent.footer.copyrightPersian}</span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
