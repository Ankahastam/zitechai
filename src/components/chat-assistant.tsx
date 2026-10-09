"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useChatController } from "./use-chat-controller";
import { ChatSuggestions } from "./chat-suggestions";
import { turnstileSiteKey } from "./turnstile";
import styles from "./chat-assistant.module.css";

const ChatPanel = dynamic(() => import("./chat-panel"), { ssr: false });
type ChatMode = "idle" | "focused" | "collapsed";

export function ChatAssistant() {
  const pathname = usePathname();
  const { messages, draft, setDraft, pending, error, setError, token, challenge, renderChallenge, send, restart } = useChatController();
  const [mode, setMode] = useState<ChatMode>("idle");
  const field = useRef<HTMLTextAreaElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  const atmosphere = useRef<HTMLDivElement>(null);
  const restoringFocus = useRef(false);
  const active = mode === "focused";
  const initialized = mode !== "idle";
  const state = active ? (pending ? "generating" : messages.length ? "conversing" : "focused") : mode;

  useEffect(() => {
    const element = dock.current;
    if (!element) return;
    const hero = document.querySelector(".hero");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let range = 1;
    let current = 0;
    let target = 0;
    let frame = 0;
    let previous = 0;

    function animate(time: number) {
      if (!element) return;
      const elapsed = Math.min(time - previous, 64);
      previous = time;
      current = motion.matches ? target : current + (target - current) * (1 - Math.exp(-elapsed / 90));
      if (Math.abs(target - current) < .001) current = target;
      element.style.setProperty("--chat-scroll-progress", String(current));
      frame = current === target ? 0 : requestAnimationFrame(animate);
    }

    function update() {
      const progress = Math.max(0, Math.min(1, window.scrollY / range));
      target = motion.matches ? 0 : progress * progress * (3 - 2 * progress);
      if (!frame) {
        previous = performance.now();
        frame = requestAnimationFrame(animate);
      }
    }

    function measure() {
      range = Math.max(1, hero ? hero.getBoundingClientRect().bottom + window.scrollY : window.innerHeight);
      update();
    }

    measure();
    const observer = new ResizeObserver(measure);
    if (hero) observer.observe(hero);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    motion.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      motion.removeEventListener("change", update);
      element.style.removeProperty("--chat-scroll-progress");
    };
  }, [pathname]);

  useEffect(() => {
    const input = field.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 144)}px`;
  }, [draft]);

  useEffect(() => {
    const viewport = window.visualViewport;
    const element = dock.current;
    const fog = atmosphere.current;
    if (!initialized || !viewport || !element) return;
    function updateViewport() {
      if (!viewport || !element) return;
      for (const target of [element, fog]) {
        target?.style.setProperty("--chat-viewport", `${viewport.height}px`);
        target?.style.setProperty("--chat-keyboard", `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`);
      }
    }
    updateViewport();
    viewport.addEventListener("resize", updateViewport);
    viewport.addEventListener("scroll", updateViewport, { passive: true });
    return () => {
      viewport.removeEventListener("resize", updateViewport);
      viewport.removeEventListener("scroll", updateViewport);
      for (const target of [element, fog]) {
        target?.style.removeProperty("--chat-viewport");
        target?.style.removeProperty("--chat-keyboard");
      }
    };
  }, [initialized]);

  function collapse() {
    setMode("collapsed");
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
      if (document.activeElement instanceof HTMLElement && dock.current?.contains(document.activeElement)) document.activeElement.blur();
      return;
    }
    if (document.activeElement !== field.current) {
      restoringFocus.current = true;
      field.current?.focus({ preventScroll: true });
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMode("focused");
    void send();
    field.current?.focus({ preventScroll: true });
  }

  return (
    <>
    <div aria-hidden="true" className={styles.atmosphere} data-active={active} id="zitech-chat-atmosphere" ref={atmosphere}><i /><i /><i /></div>
    <div className={styles.dock} data-state={state} ref={dock}>
      <section aria-label="گفتگو با دستیار زی‌تک" className={styles.stack} onKeyDown={(event) => {
        if (event.key === "Escape" && !event.nativeEvent.isComposing) { event.preventDefault(); collapse(); }
      }}>
        <div aria-hidden={!active} className={styles.conversation} inert={!active}>
          {mode !== "idle" ? <>
            <div className={styles.toolbar}>
              <span className={styles.identity}>دستیار زی‌تک</span>
              <div>
                {messages.length ? <button className={styles.restart} disabled={pending} onClick={() => { restart(); field.current?.focus({ preventScroll: true }); }} type="button">گفتگوی تازه</button> : null}
                <button aria-label="جمع‌کردن گفتگو" className={styles.collapse} onClick={collapse} type="button">
                  <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m7 10 5 5 5-5" /></svg>
                </button>
              </div>
            </div>
            <ChatPanel messages={messages} pending={pending} active={active} />
          </> : null}
        </div>
        <form aria-label="ارسال پیام به دستیار زی‌تک" className={styles.composer} onSubmit={submit}>
          <div className={styles.inputRow}>
            <label className="sr-only" htmlFor="zitech-chat-question">پیام شما به دستیار زی‌تک</label>
            {!active && !draft ? <ChatSuggestions /> : null}
            <textarea aria-controls={mode !== "idle" ? "zitech-chat" : undefined} aria-describedby={active ? "zitech-chat-security" : undefined}
              autoComplete="off" className={styles.input} dir={draft ? "auto" : "rtl"} id="zitech-chat-question" maxLength={2_000}
              onChange={(event) => { setDraft(event.target.value); setMode("focused"); }} onClick={() => setMode("focused")}
              onFocus={() => { if (!restoringFocus.current) setMode("focused"); restoringFocus.current = false; }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
                  event.preventDefault(); event.currentTarget.form?.requestSubmit();
                }
              }} placeholder={active ? "پیام خود را بنویسید…" : ""} readOnly={pending} ref={field} required rows={1} value={draft} />
            <button aria-label={pending ? "در انتظار پاسخ" : "ارسال پیام"} className={styles.send}
              disabled={pending || !token || !draft.trim()} type="submit">
              {pending ? <span aria-hidden="true" className={styles.dots}><i /><i /><i /></span>
                : <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>}
            </button>
          </div>
          <div aria-hidden={!active} className={styles.details} inert={!active}>
            <div>
              <span className="sr-only" id="zitech-chat-security" role="status">{!turnstileSiteKey ? "گفتگو هنوز فعال نشده است. لطفاً از فرم تماس استفاده کنید." : !token && !pending ? "در حال تأیید امنیتی…" : ""}</span>
              {error ? <p className={styles.error} role="alert">{error}</p> : null}
            </div>
          </div>
          {mode !== "idle" && turnstileSiteKey ? <div className={styles.challenge}>
            <div ref={challenge} />
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" onReady={() => renderChallenge()}
              onError={() => setError("تأیید امنیتی بارگذاری نشد. لطفاً صفحه را دوباره باز کنید.")} />
          </div> : null}
        </form>
      </section>
    </div>
    </>
  );
}
