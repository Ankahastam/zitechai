"use client";

import Script from "next/script";

declare global {
  interface Window {
    turnstile?: { reset: (container?: string | HTMLElement) => void };
  }
}

export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/* Two widgets can share a page (the contact dialog plus an inline page form), so
   every reset is scoped by id — an unscoped reset clears whichever widget the
   script rendered last, which would leave the other form holding a stale token. */
export function TurnstileWidget({ id }: { id: string }) {
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div
        className="cf-turnstile"
        data-action="lead_form"
        data-appearance="interaction-only"
        data-language="fa"
        data-sitekey={turnstileSiteKey}
        data-size="flexible"
        id={id}
      />
    </>
  );
}

export function resetTurnstile(id: string) {
  window.turnstile?.reset(`#${id}`);
}
