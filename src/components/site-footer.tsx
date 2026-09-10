import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LiquidButtonLink } from "@/components/ui/liquid-button-link";
import { Logo } from "@/components/ui/logo";

const links = [
  { href: "/#approach", label: "رویکرد زی‌تک" },
  { href: "/#services", label: "راهکارها" },
  { href: "/voice-agent", label: "منشی تلفنی هوشمند" },
  { href: "/#faq", label: "سؤالات متداول" },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <Container>
        <div className="site-footer__glass">
          <section aria-labelledby="footer-cta-title" className="site-footer__cta-block">
            <div>
              <h2 className="site-footer__headline" id="footer-cta-title">
                آماده‌اید AI را وارد کار واقعی کسب‌وکارتان کنید؟
              </h2>
              <p className="site-footer__lede">از یک مسئله واقعی شروع می‌کنیم؛ نه از یک ابزار.</p>
            </div>

            <div className="site-footer__actions">
              <LiquidButtonLink
                className="site-footer__cta"
                filterId="footer-cta-goo"
                href="#contact"
                tone="light"
              >
                <span>شروع همکاری با زی‌تک</span>
                <span aria-hidden="true" className="site-footer__arrow">←</span>
              </LiquidButtonLink>
              <Link className="site-footer__secondary" href="/#services">
                مشاهده راهکارها
              </Link>
            </div>
          </section>

          <div className="site-footer__meta">
            <Logo tone="light" />

            <nav aria-label="ناوبری پاورقی" className="site-footer__nav">
              <ul>
                {links.map((link) => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </nav>

            <p className="site-footer__copyright">
              <span dir="ltr">© 2026 Z-Tech.</span>{" "}
              <span>تمامی حقوق محفوظ است.</span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
