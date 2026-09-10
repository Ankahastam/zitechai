"use client";

import { type FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { TurnstileWidget, resetTurnstile, turnstileSiteKey } from "./turnstile";

type FormState = "idle" | "pending" | "success" | "error";

const TURNSTILE_ID = "ca-turnstile";

/* Each checked box posts its own `channels` entry; the Pages Function joins them. */
const CHANNELS = ["وب‌سایت", "تلگرام", "بله", "ایتا", "واتساپ", "اینستاگرام"] as const;

export function ChatLeadForm() {
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
        <h3 className="ca-form__done-title">درخواست شما ثبت شد.</h3>
        <p className="ca-form__done-body">
          برای بررسی کانال‌ها و سیستم‌های فعلی کسب‌وکارتان با شما تماس می‌گیریم.
        </p>
      </div>
    );
  }

  return (
    <form action="/api/lead" className="ca-form" method="post" onSubmit={submit}>
      <div className="ca-form__grid">
        <label>
          <span>نام و نام خانوادگی</span>
          <input autoComplete="name" maxLength={80} name="name" required type="text" />
        </label>
        <label>
          <span>نام کسب‌وکار</span>
          <input autoComplete="organization" maxLength={100} name="business" required type="text" />
        </label>
        <label>
          <span>شماره موبایل</span>
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
      </div>

      <fieldset className="ca-form__channels">
        <legend>کانال‌های مورد نیاز</legend>
        <div className="ca-form__chips">
          {CHANNELS.map((channel) => (
            <label className="ca-chip" key={channel}>
              <input name="channels" type="checkbox" value={channel} />
              <span>{channel}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="ca-form__note">
        <span>توضیح نیاز یا سیستم‌هایی که باید متصل شوند</span>
        <textarea
          maxLength={600}
          name="note"
          placeholder="مثلاً: اتصال به CRM فعلی و خواندن موجودی از انبار"
          rows={4}
        />
      </label>

      <label aria-hidden="true" className="ca-form__honeypot">
        وب‌سایت
        <input autoComplete="off" name="website" tabIndex={-1} type="text" />
      </label>

      {turnstileSiteKey ? (
        <TurnstileWidget id={TURNSTILE_ID} />
      ) : (
        <p className="ca-form__message" role="alert">
          فرم هنوز برای ارسال نهایی پیکربندی نشده است.
        </p>
      )}

      <Button
        className="ca-form__submit"
        disabled={state === "pending" || !turnstileSiteKey}
        type="submit"
      >
        {state === "pending" ? "در حال ثبت…" : "ثبت درخواست استقرار"}
      </Button>

      <p aria-live="polite" className="ca-form__message">
        {state === "error" ? message : ""}
      </p>
    </form>
  );
}
