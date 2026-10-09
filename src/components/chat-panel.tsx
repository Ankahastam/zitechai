"use client";

import { memo, useEffect, useRef } from "react";
import { renderChatMarkdown } from "./chat-markdown";
import type { ChatMessage } from "./use-chat-controller";
import styles from "./chat-assistant.module.css";

const Message = memo(function Message({ message }: { message: ChatMessage }) {
  return <article className={message.role === "user" ? styles.user : styles.answer}>
    <span className="sr-only">{message.role === "user" ? "شما" : "دستیار زی‌تک"}</span>
    {message.role === "user" ? <p dir="auto">{message.text}</p>
      : <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: renderChatMarkdown(message.text) }} />}
    {message.sources?.length ? <ul aria-label="منابع پاسخ" className={styles.sources}>{message.sources.map((source, index) =>
      <li key={index}>{source.url ? <a href={source.url} rel="noopener noreferrer" target="_blank">{source.title}</a> : source.title}</li>)}</ul> : null}
  </article>;
});

export default function ChatPanel({ messages, pending, active }: { messages: ChatMessage[]; pending: boolean; active: boolean }) {
  const transcript = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  useEffect(() => {
    const view = transcript.current;
    if (!view || !active) return;
    const observer = new ResizeObserver(() => {
      if (atBottom.current) view.scrollTop = view.scrollHeight;
    });
    observer.observe(view);
    return () => observer.disconnect();
  }, [active]);
  useEffect(() => {
    const view = transcript.current;
    if (view && active) {
      atBottom.current = true;
      view.scrollTo({ top: view.scrollHeight, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }, [messages, pending, active]);

  return <div aria-label="پیام‌های گفتگو" aria-live="polite" aria-relevant="additions" className={styles.transcript} id="zitech-chat"
    onScroll={(event) => { const view = event.currentTarget; atBottom.current = view.scrollHeight - view.scrollTop - view.clientHeight < 24; }} ref={transcript} role="log" tabIndex={0}>
    {messages.map((message, index) => <Message message={message} key={index} />)}
    {pending ? <div className={styles.thinking} role="status"><span aria-hidden="true" className={styles.dots}><i /><i /><i /></span><span>در حال آماده‌کردن پاسخ…</span></div> : null}
  </div>;
}
