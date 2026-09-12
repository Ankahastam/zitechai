import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import {
  Navigation,
  NavigationLink,
  NavigationList,
} from "@/components/ui/navigation";
import { MobileNavigation, type NavItem } from "./mobile-navigation";
import { siteContent } from "@/content";

const links: readonly NavItem[] = siteContent.navigation.primary.map((item) =>
  item.children.length
    ? { children: item.children, label: item.label }
    : { href: item.href, label: item.label },
);

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container>
        <div className="site-header__bar">
          <Logo />

          <Navigation label="ناوبری اصلی">
            <NavigationList className="site-header__links">
              {links.map((item) =>
                "children" in item ? (
                  <li className="site-header__group" key={item.label}>
                    <button className="navigation-link site-header__trigger" type="button">
                      <span>{item.label}</span>
                      <span aria-hidden="true" className="site-header__chevron">
                        <svg viewBox="0 0 12 8">
                          <path d="m1.5 2 4.5 4 4.5-4" />
                        </svg>
                      </span>
                    </button>

                    <ul aria-label={item.label} className="site-header__submenu">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link className="site-header__submenu-link" href={child.href}>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.href}>
                    <NavigationLink href={item.href}>{item.label}</NavigationLink>
                  </li>
                ),
              )}
            </NavigationList>
          </Navigation>

          <ButtonLink className="site-header__cta" href="#contact">
            {siteContent.navigation.cta}
          </ButtonLink>

          <MobileNavigation
            cta={siteContent.navigation.cta}
            links={links}
            title={siteContent.navigation.mobileTitle}
          />
        </div>
      </Container>
    </header>
  );
}
