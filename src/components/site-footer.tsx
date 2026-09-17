import Link from "next/link";
import { FooterPhoneForm } from "@/components/footer-phone-form";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { siteContent } from "@/content";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <Container>
        <section aria-labelledby="footer-cta-title" className="site-footer__main">
          <div className="site-footer__intro">
            <p className="site-footer__eyebrow">{siteContent.footer.cta}</p>
            <h2 className="site-footer__headline" id="footer-cta-title">
              {siteContent.footer.headline}
            </h2>
            <p className="site-footer__lede">{siteContent.footer.lede}</p>
          </div>
          <FooterPhoneForm content={siteContent.footer} />
        </section>

        <address className="site-footer__contact">
          <div className="site-footer__contact-item site-footer__contact-item--address">
            <span>{siteContent.footer.addressLabel}</span>
            <p>{siteContent.footer.address}</p>
          </div>
          <div className="site-footer__contact-item">
            <span>{siteContent.footer.phoneLabel}</span>
            <a dir="ltr" href={siteContent.footer.phoneHref}>{siteContent.footer.phone}</a>
          </div>
          <div className="site-footer__contact-item">
            <span>{siteContent.footer.socialLabel}</span>
            <a dir="ltr" href={siteContent.footer.instagramHref} rel="noreferrer" target="_blank">@{siteContent.footer.instagram}</a>
          </div>
          <div className="site-footer__contact-item site-footer__messengers">
            <span>{siteContent.footer.messengerLabel}</span>
            <div>
              <a href={siteContent.footer.whatsappHref} rel="noreferrer" target="_blank">واتس‌اپ</a>
              <a href={siteContent.footer.telegramHref} rel="noreferrer" target="_blank">تلگرام</a>
            </div>
          </div>
        </address>

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
      </Container>
    </footer>
  );
}
