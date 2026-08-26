import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ButtonLink } from "./button";

type LiquidButtonLinkProps = ComponentPropsWithoutRef<typeof ButtonLink> & {
  filterId: string;
  tone?: "dark" | "light";
  children: ReactNode;
};

export function LiquidButtonLink({
  children,
  className,
  filterId,
  tone = "dark",
  ...props
}: LiquidButtonLinkProps) {
  return (
    <ButtonLink
      className={`liquid-button liquid-button--${tone}${className ? ` ${className}` : ""}`}
      {...props}
    >
      <svg aria-hidden="true" className="liquid-button__filter" focusable="false">
        <defs>
          <filter id={filterId} x="-40%" y="-80%" width="180%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              result="goo"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            />
          </filter>
        </defs>
      </svg>

      <span
        aria-hidden="true"
        className="liquid-button__goo"
        style={{ filter: `url(#${filterId})` }}
      >
        <span className="liquid-button__goo-body" />
        <span className="liquid-button__drop" />
      </span>
      <span aria-hidden="true" className="liquid-button__body" />
      <span className="liquid-button__content">{children}</span>
    </ButtonLink>
  );
}
