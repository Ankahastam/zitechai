"use client";

import { useEffect, useState } from "react";

const storageKey = "zitech:hero-chatgpt-dismissed:v1";
const prompt = `من می‌خواهم بررسی کنم آیا زی‌تک می‌تواند برای من مفید باشد یا نه.

با توجه به تمام اطلاعاتی که از من در گفتگوهای قبلی داری، شامل شغل، کسب‌وکار، اهداف و چالش‌هایم، سایت زی‌تک را بررسی کن:

https://www.zitechai.com/

تحلیل کن:
1. مهم‌ترین فرصت‌هایی که زی‌تک می‌تواند برای من ایجاد کند چیست؟
2. چه کارهایی در کسب‌وکار من قابلیت هوشمندسازی یا اتوماسیون دارند؟
3. کدام راهکارهای زی‌تک (AI Agent، Voice Agent، اتوماسیون فروش، تحلیل داده و...) برای من مناسب‌تر هستند؟
4. یک پیشنهاد عملی برای شروع بده.

اگر اطلاعات کافی درباره من نداری، ابتدا سوالات لازم را بپرس.`;

export function HeroChatGptPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey)) return;
    } catch {
      // Storage can be unavailable in privacy modes; the prompt still works.
    }

    const timeout = window.setTimeout(() => setVisible(true), 800);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      // Dismissing for this visit is enough when storage is unavailable.
    }
  }

  return (
    <aside aria-label="پرسش از چت‌جی‌پی‌تی درباره زی‌تک" className="hero-chatgpt">
      <a href={`https://chatgpt.com/?prompt=${encodeURIComponent(prompt)}`} rel="noopener noreferrer" target="_blank">
        <span aria-hidden="true" className="hero-chatgpt__mark">
          <svg viewBox="0 0 24 24">
            <path d="M12 3.5a4.2 4.2 0 0 1 7.1 3 4.2 4.2 0 0 1 1.4 7.6 4.2 4.2 0 0 1-5.7 6 4.2 4.2 0 0 1-7.1-3 4.2 4.2 0 0 1-1.4-7.6A4.2 4.2 0 0 1 12 3.5Z" />
            <path d="m8 9 4-2.3L16 9v4.7L12 16l-4-2.3Z" />
          </svg>
        </span>
        <span className="hero-chatgpt__copy">
          <strong>از چت‌جی‌پی‌تی درباره ما بپرس</strong>
          <small>ببین او چه نظری دارد</small>
        </span>
      </a>
      <button aria-label="بستن پیشنهاد پرسش از چت‌جی‌پی‌تی" onClick={dismiss} type="button">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m18 6-12 12M6 6l12 12" /></svg>
      </button>
    </aside>
  );
}
