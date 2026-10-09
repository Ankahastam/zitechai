"use client";

import { useEffect, useRef } from "react";
import styles from "./chat-assistant.module.css";

const questions = [
  "شما چه خدماتی ارائه می‌دهید؟",
  "زی‌تک دقیقاً چه کاری می‌کند؟",
  "مشاورهٔ اختصاصی می‌خواهم",
  "چطور کسب‌وکارم را هوشمندتر کنم؟",
].map((question) => Array.from(question));

export function ChatSuggestions() {
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const text = label.current;
    if (!text) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    let question = 0;
    let length = 0;
    let deleting = false;

    function advance() {
      if (!text || motion.matches || document.hidden) return;
      length += deleting ? -1 : 1;
      text.textContent = questions[question].slice(0, length).join("");
      let delay = deleting ? 35 : 70;
      if (!deleting && length === questions[question].length) {
        deleting = true; delay = 1_800;
      } else if (deleting && length === 0) {
        question = (question + 1) % questions.length;
        deleting = false; delay = 350;
      }
      timer = window.setTimeout(advance, delay);
    }

    function restart() {
      window.clearTimeout(timer);
      question = 0; length = 0; deleting = false;
      if (text) text.textContent = motion.matches ? questions[0].join("") : "";
      advance();
    }

    restart();
    document.addEventListener("visibilitychange", restart);
    motion.addEventListener("change", restart);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", restart);
      motion.removeEventListener("change", restart);
    };
  }, []);

  return <span aria-hidden="true" className={styles.suggestions} id="zitech-chat-suggestion" ref={label} />;
}
