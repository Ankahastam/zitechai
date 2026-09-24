import Link from "next/link";
import { FooterPhoneForm } from "@/components/footer-phone-form";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { siteContent } from "@/content";

function ContactLabel({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <span className="site-footer__contact-label">
      <span className="site-footer__contact-icon"><Icon name={icon} /></span>
      {children}
    </span>
  );
}

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
            <ContactLabel icon="map-pin">{siteContent.footer.addressLabel}</ContactLabel>
            <p>{siteContent.footer.address}</p>
          </div>
          <div className="site-footer__contact-item">
            <ContactLabel icon="phone">{siteContent.footer.phoneLabel}</ContactLabel>
            <a dir="ltr" href={siteContent.footer.phoneHref}>{siteContent.footer.phone}</a>
          </div>
          <div className="site-footer__contact-item">
            <ContactLabel icon="instagram">{siteContent.footer.socialLabel}</ContactLabel>
            <a dir="ltr" href={siteContent.footer.instagramHref} rel="noreferrer" target="_blank">@{siteContent.footer.instagram}</a>
          </div>
          <div className="site-footer__contact-item site-footer__messengers">
            <ContactLabel icon="message-square">{siteContent.footer.messengerLabel}</ContactLabel>
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
