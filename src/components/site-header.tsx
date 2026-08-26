import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import {
  Navigation,
  NavigationLink,
  NavigationList,
} from "@/components/ui/navigation";
import { MobileNavigation } from "./mobile-navigation";

const links = [
  { href: "#approach", label: "رویکرد زی‌تک" },
  { href: "#services", label: "راهکارها" },
  { href: "#case-studies", label: "مطالعات موردی" },
  { href: "#faq", label: "سؤالات متداول" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container>
        <div className="site-header__bar">
          <Logo />

          <Navigation label="ناوبری اصلی">
            <NavigationList className="site-header__links">
              {links.map((link) => (
                <li key={link.href}>
                  <NavigationLink href={link.href}>{link.label}</NavigationLink>
                </li>
              ))}
            </NavigationList>
          </Navigation>

          <ButtonLink className="site-header__cta" href="#contact">
            شروع همکاری با زی‌تک
          </ButtonLink>

          <MobileNavigation links={links} />
        </div>
      </Container>
    </header>
  );
}