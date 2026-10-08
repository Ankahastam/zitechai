"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Icon } from "./ui/icon";
import styles from "./chat-assistant.module.css";

const ChatPanel = dynamic(() => import("./chat-panel"), {
  ssr: false,
  loading: () => <p className={styles.loading} role="status">در حال آماده‌سازی گفتگو…</p>,
});

export function ChatAssistant() {
  const [state, setState] = useState<"unloaded" | "open" | "closed">("unloaded");
  return (
    <>
      <button aria-controls="zitech-chat" aria-expanded={state === "open"} aria-haspopup="dialog"
        className={styles.launcher} onClick={() => setState("open")} type="button">
        <Icon name="message-square" /><span>از زی‌تک بپرس</span>
      </button>
      {state !== "unloaded" ? <ChatPanel open={state === "open"} onClose={() => setState("closed")} /> : null}
    </>
  );
}
