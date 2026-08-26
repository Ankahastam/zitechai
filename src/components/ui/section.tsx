import type { ComponentPropsWithoutRef } from "react";
import { Container } from "./container";

export function Section({ className, children, ...props }: ComponentPropsWithoutRef<"section">) {
  return (
    <section className={className ? `section ${className}` : "section"} {...props}>
      <Container>{children}</Container>
    </section>
  );
}
