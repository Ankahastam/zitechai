"use client";

import { type FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { TurnstileWidget, resetTurnstile, turnstileSiteKey } from "./turnstile";

type FormState = "idle" | "pending" | "success" | "error";
type ChatLeadFormCopy = (typeof import("../../content/chat.json"))["leadForm"];

const TURNSTILE_ID = "ca-turnstile";

export function ChatLeadForm({ content }: { content: ChatLeadFormCopy }) {
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

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "ارسال درخواست انجام نشد. لطفاً دوباره تلاش کنید.");
      }

      setState("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "ارسال درخواست انجام نشد.");
      setState("error");
      resetTurnstile(TURNSTILE_ID);
    }
  };

  if (state === "success") {
    return (
      <div className="ca-form ca-form--done" role="status">
        <span aria-hidden="true" className="ca-form__mark">
          ✓
        </span>
        <h3 className="ca-form__done-title">{content.successTitle}</h3>
        <p className="ca-form__done-body">{content.successBody}</p>
      </div>
    );
  }

  return (
    <form action="/api/lead" className="ca-form" method="post" onSubmit={submit}>
      <div className="ca-form__grid">
        <label>
          <span>{content.nameLabel}</span>
          <input autoComplete="name" maxLength={80} name="name" required type="text" />
        </label>
        <label>
          <span>{content.mobileLabel}</span>
          <input
            autoComplete="tel"
            dir="ltr"
            inputMode="tel"
            maxLength={16}
            name="mobile"
            placeholder="0912 000 0000"
            required
            type="tel"
          />
        </label>
        <label>
          <span>{content.businessLabel}</span>
          <input autoComplete="organization-title" maxLength={100} name="business" required type="text" />
        </label>
      </div>

      <label aria-hidden="true" className="ca-form__honeypot">
        وب‌سایت
        <input autoComplete="off" name="website" tabIndex={-1} type="text" />
      </label>

      {turnstileSiteKey ? (
        <TurnstileWidget id={TURNSTILE_ID} />
      ) : (
        <p className="ca-form__message" role="alert">
          {content.unconfiguredMessage}
        </p>
      )}

      <Button
        className="ca-form__submit"
        disabled={state === "pending" || !turnstileSiteKey}
        type="submit"
      >
        {state === "pending" ? content.pendingLabel : content.submitLabel}
      </Button>

      <p aria-live="polite" className="ca-form__message">
        {state === "error" ? message : ""}
      </p>
    </form>
  );
}
