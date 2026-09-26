"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getLeadFormData } from "./lead-attribution";
import { Icon } from "./ui/icon";
import { TurnstileWidget, resetTurnstile, turnstileSiteKey } from "./turnstile";

type FormState = "idle" | "pending" | "success" | "error";

const TURNSTILE_ID = "contact-turnstile";

type ContactDialogCopy = (typeof import("../../content/site.json"))["contactDialog"];

export function ContactDialog({ content }: { content: ContactDialogCopy }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  const finishClose = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    document.documentElement.classList.remove("contact-open");
    formRef.current?.reset();
    resetTurnstile(TURNSTILE_ID);
    setState("idle");
    setMessage("");
  };

  const close = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;

    dialog.dataset.state = "closed";
    window.clearTimeout(closeTimerRef.current ?? undefined);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }

    closeTimerRef.current = window.setTimeout(finishClose, 220);
  };

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    dialog.showModal();
    document.documentElement.classList.add("contact-open");
    requestAnimationFrame(() => {
      dialog.dataset.state = "open";
    });
  };

  useEffect(() => {
    const handleContactClick = (event: MouseEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>('a[href="#contact"], a[href="/#contact"]')
        : null;
      if (!target) return;

      event.preventDefault();
      window.setTimeout(open, target.closest("dialog") ? 230 : 0);
    };

    document.addEventListener("click", handleContactClick, true);
    return () => {
      document.removeEventListener("click", handleContactClick, true);
      window.clearTimeout(closeTimerRef.current ?? undefined);
      document.documentElement.classList.remove("contact-open");
    };
  });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("pending");
    setMessage("");

    try {
      const response = await fetch(event.currentTarget.action, {
        body: getLeadFormData(event.currentTarget, "contact"),
        method: "POST",
      });
      const result = await response.json() as { message?: string; ok?: boolean };

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

  return (
    <dialog
      aria-describedby="contact-dialog-description"
      aria-labelledby="contact-dialog-title"
      className="contact-dialog"
      data-state="closed"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      ref={dialogRef}
    >
      <div className="contact-dialog__surface">
        <button
          aria-label={content.closeLabel}
          className="contact-dialog__close"
          onClick={close}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>

        {state === "success" ? (
          <div className="contact-dialog__success" role="status">
            <span aria-hidden="true" className="contact-dialog__success-mark">✓</span>
            <h2 id="contact-dialog-title">{content.successTitle}</h2>
            <p id="contact-dialog-description">{content.successBody}</p>
            <button className="contact-dialog__submit" onClick={close} type="button">{content.successButton}</button>
          </div>
        ) : (
          <>
            <div className="contact-dialog__intro">
              <div className="contact-dialog__copy">
                <p className="contact-dialog__kicker" dir="ltr"><Icon name="message-square" /> {content.kicker}</p>
                <h2 id="contact-dialog-title">{content.title}</h2>
                <p id="contact-dialog-description">{content.description}</p>
              </div>
              <div aria-hidden="true" className="contact-dialog__visual">
                <Image
                  alt=""
                  className="contact-dialog__portrait"
                  height="1449"
                  sizes="(max-width: 640px) 8rem, 14rem"
                  src="/images/contact-advisor.webp"
                  unoptimized
                  width="1040"
                />
                <span className="contact-dialog__availability"><i /> آنلاین و پاسخ‌گو</span>
              </div>
            </div>

            <form action="/api/lead" className="contact-dialog__form" onSubmit={submit} ref={formRef}>
              <label>
                <span className="sr-only">{content.nameLabel}</span>
                <Icon name="user" />
                <input autoComplete="name" maxLength={80} name="name" placeholder={content.nameLabel} required type="text" />
              </label>
              <label>
                <span className="sr-only">{content.mobileLabel}</span>
                <Icon name="phone" />
                <input aria-label={content.mobileLabel} autoComplete="tel" dir="ltr" inputMode="tel" maxLength={16} name="mobile" placeholder="0912 000 0000" required type="tel" />
              </label>
              <label>
                <span className="sr-only">{content.jobLabel}</span>
                <Icon name="briefcase" />
                <input autoComplete="organization-title" maxLength={100} name="job" placeholder={content.jobLabel} required type="text" />
              </label>

              <label aria-hidden="true" className="contact-dialog__honeypot">
                وب‌سایت
                <input autoComplete="off" name="website" tabIndex={-1} type="text" />
              </label>

              {turnstileSiteKey ? (
                <TurnstileWidget id={TURNSTILE_ID} />
              ) : (
                <p className="contact-dialog__notice" role="alert">{content.unconfiguredMessage}</p>
              )}

              <button className="contact-dialog__submit" disabled={state === "pending" || !turnstileSiteKey} type="submit">
                <span>{state === "pending" ? content.pendingLabel : content.submitLabel}</span>
                <span aria-hidden="true" className="contact-dialog__submit-icon">←</span>
              </button>
              <p aria-live="polite" className="contact-dialog__message">{state === "error" ? message : ""}</p>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
