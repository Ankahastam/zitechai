"use client";

import Script from "next/script";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { turnstileSiteKey } from "./turnstile";
import { Icon } from "./ui/icon";
import styles from "./chat-assistant.module.css";

type Message = { role: "user" | "assistant"; text: string; sources?: { title: string; url: string | null }[] };

export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const challenge = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (open && !dialog.current?.open) { dialog.current?.showModal(); field.current?.focus(); }
    if (!open && dialog.current?.open) dialog.current.close();
  }, [open]);

  useEffect(() => {
    const view = transcript.current;
    if (view) view.scrollTop = view.scrollHeight;
  }, [messages, pending]);

  useEffect(() => () => {
    if (widget.current) window.turnstile?.remove(widget.current);
  }, []);

  function renderChallenge() {
    if (!challenge.current || !window.turnstile || widget.current !== null || !turnstileSiteKey) return;
    widget.current = window.turnstile.render(challenge.current, {
      sitekey: turnstileSiteKey, action: "website_chat", appearance: "interaction-only", language: "fa", size: "flexible", theme: "light",
      callback: (value: string) => setToken(value),
      "expired-callback": () => setToken(""),
      "error-callback": () => { setToken(""); setError("تأیید امنیتی در دسترس نیست. لطفاً صفحه را دوباره باز کنید."); },
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = draft.trim();
    if (!question || pending || !token) return;
    setPending(true);
    setError("");
    setMessages((previous) => [...previous, { role: "user", text: question }]);
    setDraft("");
    try {
      const response = await fetch("/api/chat", {
        body: JSON.stringify({ question, token, newConversation: messages.length === 0 }),
        headers: { "Content-Type": "application/json" }, method: "POST", signal: AbortSignal.timeout(70_000),
      });
      const result = await response.json().catch(() => null) as { ok?: boolean; answer?: string; message?: string; sources?: Message["sources"] } | null;
      if (!response.ok || !result?.ok || typeof result.answer !== "string") throw new Error(result?.message || "دریافت پاسخ انجام نشد. لطفاً کمی بعد دوباره تلاش کنید.");
      const answer = result.answer;
      setMessages((previous) => [...previous, { role: "assistant", text: answer, sources: result.sources }]);
    } catch (cause) {
      setMessages((previous) => previous.slice(0, -1));
      setDraft(question);
      setError(cause instanceof Error && cause.name === "Error" ? cause.message
        : cause instanceof Error && ["TimeoutError", "AbortError"].includes(cause.name)
          ? "دریافت پاسخ بیش از حد طول کشید. لطفاً دوباره تلاش کنید."
          : "ارتباط با سرویس گفتگو برقرار نشد. لطفاً کمی بعد دوباره تلاش کنید.");
    } finally {
      setPending(false);
      setToken("");
      if (widget.current) window.turnstile?.reset(widget.current);
      if (dialog.current?.open) field.current?.focus();
    }
  }

  return (
    <dialog aria-describedby="zitech-chat-description" aria-labelledby="zitech-chat-title" className={styles.panel}
      id="zitech-chat" onClose={onClose} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} ref={dialog}>
      <div className={styles.surface}>
        <header className={styles.header}>
          <div><p className={styles.kicker}>گفتگو با هوش مصنوعی</p><h2 id="zitech-chat-title">از زی‌تک بپرس</h2></div>
          <button aria-label="بستن گفتگو" className={styles.close} onClick={() => dialog.current?.close()} type="button">×</button>
        </header>
        <div aria-label="پیام‌های گفتگو" aria-live="polite" aria-relevant="additions" className={styles.transcript} ref={transcript} role="log" tabIndex={0}>
          {messages.length === 0 ? <div className={styles.welcome}>
            <Icon name="message-square" /><h3>از کجا شروع کنیم؟</h3><p>دربارهٔ خدمات زی‌تک یا کاربرد هوش مصنوعی در کسب‌وکارت بپرس.</p>
          </div> : messages.map((message, index) => <article className={message.role === "user" ? styles.user : styles.answer} key={index}>
            <span className={styles.author}>{message.role === "user" ? "شما" : "دستیار زی‌تک"}</span><p>{message.text}</p>
            {message.sources?.length ? <ul aria-label="منابع پاسخ" className={styles.sources}>{message.sources.map((source, sourceIndex) =>
              <li key={sourceIndex}>{source.url ? <a href={source.url} rel="noopener noreferrer" target="_blank">{source.title}</a> : source.title}</li>)}</ul> : null}
          </article>)}
          {pending ? <p className={styles.waiting} role="status">در حال آماده‌کردن پاسخ…</p> : null}
        </div>
        <form className={styles.form} onSubmit={submit}>
          <p className={styles.disclosure} id="zitech-chat-description">پاسخ‌ها با هوش مصنوعی تولید می‌شوند. پیام‌ها برای پاسخ‌گویی به DocsGPT Cloud ارسال و ذخیره می‌شوند؛ اطلاعات حساس نفرست.</p>
          <label className="sr-only" htmlFor="zitech-chat-question">پیام شما</label>
          <textarea autoComplete="off" className={styles.input} disabled={pending} id="zitech-chat-question" maxLength={2_000}
            onChange={(event) => setDraft(event.target.value)} placeholder="پیامت را اینجا بنویس…" ref={field} required rows={2} value={draft} />
          {turnstileSiteKey ? <>
            <div ref={challenge} />
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" onReady={renderChallenge}
              onError={() => setError("تأیید امنیتی بارگذاری نشد. لطفاً صفحه را دوباره باز کنید.")} />
          </> : <p role="status">گفتگو هنوز فعال نشده است. لطفاً از فرم تماس استفاده کنید.</p>}
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <div className={styles.actions}>
            <button className={styles.submit} disabled={pending || !token || !draft.trim()} type="submit"><span>{pending ? "در انتظار پاسخ" : "ارسال پیام"}</span><Icon name="send" /></button>
            <button className={styles.restart} disabled={pending} onClick={() => { setMessages([]); setError(""); setDraft(""); field.current?.focus(); }} type="button">گفتگوی تازه</button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
