"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export function FaqInteractive({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    for (const trigger of root.querySelectorAll<HTMLElement>("[data-faq-question]")) {
      const selected = trigger.dataset.faqQuestion === String(active);
      trigger.setAttribute("aria-expanded", String(selected));
    }

    for (const panel of root.querySelectorAll<HTMLElement>("[data-faq-answer]")) {
      panel.setAttribute("aria-hidden", String(panel.dataset.faqAnswer !== String(active)));
    }

    for (const trigger of root.querySelectorAll<HTMLElement>("[data-faq-mobile-trigger]")) {
      trigger.setAttribute("aria-expanded", String(trigger.dataset.faqMobileTrigger === String(open)));
    }

    for (const panel of root.querySelectorAll<HTMLElement>("[data-faq-mobile-answer]")) {
      panel.setAttribute("aria-hidden", String(panel.dataset.faqMobileAnswer !== String(open)));
    }
  }, [active, open]);

  const handleClick = (target: EventTarget | null) => {
    const element = target as Element | null;
    const question = element?.closest<HTMLElement>("[data-faq-question]");
    const mobileTrigger = element?.closest<HTMLElement>("[data-faq-mobile-trigger]");

    if (question) {
      const index = Number(question.dataset.faqQuestion);
      setActive((current) => (current === index ? 0 : index));
    }
    if (mobileTrigger) {
      const index = Number(mobileTrigger.dataset.faqMobileTrigger);
      setOpen((current) => (current === index ? 0 : index));
    }
  };

  return (
    <div
      className="faq__interactive"
      data-active={active}
      onClick={(event) => handleClick(event.target)}
      ref={rootRef}
    >
      {children}
    </div>
  );
}
