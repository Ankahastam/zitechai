import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export function Navigation({ label = "ناوبری اصلی", children }: { label?: string; children: ReactNode }) {
  return <nav aria-label={label}>{children}</nav>;
}

export function NavigationList(props: ComponentPropsWithoutRef<"ul">) {
  return <ul {...props} />;
}

export function NavigationLink({ className, ...props }: ComponentPropsWithoutRef<typeof Link>) {
  return <Link className={className ? `navigation-link ${className}` : "navigation-link"} {...props} />;
}
