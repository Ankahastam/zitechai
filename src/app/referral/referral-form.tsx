"use client";

import { useState, type FormEvent } from "react";
import { getLeadFormData } from "@/components/lead-attribution";
import { Button } from "@/components/ui/button";
import { TurnstileWidget, resetTurnstile, turnstileSiteKey } from "@/components/turnstile";
import styles from "./referral.module.css";

const TURNSTILE_ID = "referral-turnstile";

export function ReferralForm() {
  const [state, setState] = useState<"idle" | "pending" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "pending") return;
    const form = event.currentTarget;
    setState("pending");
    setMessage("");
    try {
      const response = await fetch(form.action, { method: "POST", body: getLeadFormData(form, "referral") });
      const result = await response.json() as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || "ارسال درخواست انجام نشد. لطفاً دوباره تلاش کنید.");
      setState("success");
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "ارتباط برقرار نشد. لطفاً دوباره تلاش کنید.");
      setState("error");
      resetTurnstile(TURNSTILE_ID);
    }
  }

  if (state === "success") return (
    <div className={styles.success} role="status" tabIndex={-1}>
      <h3>درخواست همکاری شما ثبت شد.</h3>
      <p>برای گفت‌وگو درباره همکاری در فروش، از طریق شماره‌ای که وارد کردید با شما تماس می‌گیریم.</p>
    </div>
  );

  return (
    <form action="/api/lead" method="post" className={styles.form} onSubmit={submit} aria-busy={state === "pending"}>
      <label htmlFor="referral-name">نام و نام خانوادگی
        <input autoComplete="name" id="referral-name" maxLength={80} name="name" required type="text" />
      </label>
      <label htmlFor="referral-job">حوزه فعالیت
        <input aria-describedby="referral-job-hint" autoComplete="organization-title" id="referral-job" maxLength={100} name="job" required type="text" />
        <span className={styles.hint} id="referral-job-hint">مثلاً مشاوره کسب‌وکار، آموزش یا توسعه نرم‌افزار</span>
      </label>
      <label htmlFor="referral-mobile">شماره موبایل
        <input autoComplete="tel" dir="ltr" id="referral-mobile" inputMode="tel" maxLength={16} name="mobile" placeholder="0912 000 0000" required type="tel" />
      </label>
      <label aria-hidden="true" className={styles.honeypot}>وب‌سایت<input autoComplete="off" name="website" tabIndex={-1} type="text" /></label>
      {turnstileSiteKey ? <TurnstileWidget id={TURNSTILE_ID} /> : <p className={styles.message} role="alert">فرم در حال حاضر برای ارسال آماده نیست. لطفاً از بخش تماس با ما اقدام کنید.</p>}
      <Button className={styles.submit} disabled={state === "pending" || !turnstileSiteKey} type="submit">{state === "pending" ? "در حال ارسال درخواست…" : "ارسال درخواست همکاری"}</Button>
      <p className={styles.privacy}>از شماره شما برای پیگیری همین درخواست همکاری استفاده می‌کنیم.</p>
      <p aria-live="polite" className={styles.message}>{message}</p>
      <noscript><p>برای ارسال فرم، جاوااسکریپت مرورگر را فعال کنید یا از بخش تماس با ما اقدام کنید.</p></noscript>
    </form>
  );
}
