"use client";

import { type FormEvent, useState } from "react";
import { TurnstileWidget, resetTurnstile, turnstileSiteKey } from "./turnstile";

type FormState = "idle" | "pending" | "success" | "error";
type FooterCopy = (typeof import("../../content/site.json"))["footer"];

const TURNSTILE_ID = "footer-turnstile";

export function FooterPhoneForm({ content }: { content: FooterCopy }) {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setState("pending");
    setMessage("");

    try {
      const response = await fetch(form.action, { body: new FormData(form), method: "POST" });
      const result = (await response.json()) as { message?: string; ok?: boolean };
      if (!response.ok || !result.ok) throw new Error(result.message || content.phoneFormError);
      form.reset();
      setState("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : content.phoneFormError);
      setState("error");
      resetTurnstile(TURNSTILE_ID);
    }
  };

  return (
    <div className="footer-phone">
      <p className="footer-phone__title">{content.phoneFormTitle}</p>
      <p className="footer-phone__description">{content.phoneFormDescription}</p>

      {state === "success" ? (
        <p className="footer-phone__success" role="status">✓ {content.phoneFormSuccess}</p>
      ) : (
        <form action="/api/lead" className="footer-phone__form" method="post" onSubmit={submit}>
          <input name="name" type="hidden" value="درخواست تماس از فوتر" />
          <input name="job" type="hidden" value="شماره ثبت‌شده در فوتر" />
          <label className="sr-only" htmlFor="footer-mobile">{content.phoneFormLabel}</label>
          <input
            autoComplete="tel"
            dir="ltr"
            id="footer-mobile"
            inputMode="tel"
            maxLength={16}
            name="mobile"
            placeholder={content.phoneFormPlaceholder}
            required
            type="tel"
          />
          <button disabled={state === "pending" || !turnstileSiteKey} type="submit">
            <span>{state === "pending" ? content.phoneFormPending : content.phoneFormSubmit}</span>
            <span aria-hidden="true">←</span>
          </button>
          <label aria-hidden="true" className="footer-phone__honeypot">
            وب‌سایت
            <input autoComplete="off" name="website" tabIndex={-1} type="text" />
          </label>
          {turnstileSiteKey ? (
            <TurnstileWidget id={TURNSTILE_ID} />
          ) : (
            <p className="footer-phone__message" role="alert">{content.phoneFormUnconfigured}</p>
          )}
          <p aria-live="polite" className="footer-phone__message">
            {state === "error" ? message : ""}
          </p>
        </form>
      )}
    </div>
  );
}
