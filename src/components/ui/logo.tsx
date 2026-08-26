import Link from "next/link";
import Image from "next/image";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link className="brand-logo" href="/" aria-label="زی‌تک، صفحه اصلی">
      <Image
        alt=""
        className="brand-logo__image"
        height="192"
        src={`/brand/logo-${tone}.png`}
        unoptimized
        width="192"
      />
    </Link>
  );
}
