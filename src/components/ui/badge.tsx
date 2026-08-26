import type { ComponentPropsWithoutRef } from "react";

export function Badge({ className, ...props }: ComponentPropsWithoutRef<"span">) {
  const styles = "inline-flex min-h-7 items-center rounded-full bg-accent-soft px-4 py-1 text-label text-foreground";
  return <span className={className ? `${styles} ${className}` : styles} {...props} />;
}
