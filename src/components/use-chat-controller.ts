"use client";

import { useEffect, useRef, useState } from "react";
import { turnstileSiteKey } from "./turnstile";

export type ChatMessage = { role: "user" | "assistant"; text: string; sources?: { title: string; url: string | null }[] };

/** Keeps the existing HTTP, Turnstile and server-owned conversation contract. */
export function useChatController() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const challenge = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => {
    request.current?.abort();
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

  async function send() {
    const question = draft.trim();
    // The ref closes the gap before React commits the pending state.
    if (!question || request.current || !token) return;
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    setError("");
    setMessages((previous) => [...previous, { role: "user", text: question }]);
    setDraft("");
    try {
      const response = await fetch("/api/chat", {
        body: JSON.stringify({ question, token, newConversation: messages.length === 0 }),
        headers: { "Content-Type": "application/json" }, method: "POST",
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(70_000)]),
      });
      const result = await response.json().catch(() => null) as { ok?: boolean; answer?: string; message?: string; sources?: ChatMessage["sources"] } | null;
      if (!response.ok || !result?.ok || typeof result.answer !== "string") throw new Error(result?.message || "دریافت پاسخ انجام نشد. لطفاً کمی بعد دوباره تلاش کنید.");
      const answer = result.answer;
      setMessages((previous) => [...previous, { role: "assistant", text: answer, sources: result.sources }]);
    } catch (cause) {
      if (controller.signal.aborted) return;
      setMessages((previous) => previous.slice(0, -1));
      setDraft(question);
      setError(cause instanceof Error && cause.name === "Error" ? cause.message
        : cause instanceof Error && ["TimeoutError", "AbortError"].includes(cause.name)
          ? "دریافت پاسخ بیش از حد طول کشید. لطفاً دوباره تلاش کنید."
          : "ارتباط با سرویس گفتگو برقرار نشد. لطفاً کمی بعد دوباره تلاش کنید.");
    } finally {
      request.current = null;
      if (!controller.signal.aborted) {
        setPending(false);
        setToken("");
        if (widget.current) window.turnstile?.reset(widget.current);
      }
    }
  }

  function restart() {
    if (request.current) return;
    setMessages([]); setError(""); setDraft("");
  }

  return { messages, draft, setDraft, pending, error, setError, token, challenge, renderChallenge, send, restart };
}
