import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentPropsWithoutRef } from "react";

const styles = "inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-6 py-3 text-label text-white transition-[transform,background-color] duration-(--duration-fast) ease-(--ease-out) hover:bg-black active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

export function Button({ className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={className ? `${styles} ${className}` : styles} type={type} {...props} />;
}

export function ButtonLink({ className, ...props }: ComponentPropsWithoutRef<typeof Link>) {
  return <Link className={className ? `${styles} ${className}` : styles} {...props} />;
}
