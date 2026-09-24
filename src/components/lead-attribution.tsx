"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "zitech-lead-attribution";
const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

type LeadSession = {
  campaign: string;
  landingPage: string;
  pages: string[];
  referrer: string;
  startedAt: number;
};

function currentPage() {
  return window.location.pathname || "/";
}

function createSession(): LeadSession {
  const search = new URLSearchParams(window.location.search);
  const campaign = CAMPAIGN_KEYS
    .flatMap((key) => search.get(key) ? [`${key.replace("utm_", "")}: ${search.get(key)}`] : [])
    .join("، ");
  let referrer = "";

  try {
    const url = new URL(document.referrer);
    if (url.origin !== window.location.origin) referrer = url.hostname;
  } catch {
    // Direct visits and invalid referrers intentionally stay empty.
  }

  return { campaign, landingPage: currentPage(), pages: [], referrer, startedAt: Date.now() };
}

function readSession(): LeadSession {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null") as LeadSession | null;
    if (stored?.startedAt && Array.isArray(stored.pages)) return stored;
  } catch {
    // Storage may be disabled; the current page is still attached below.
  }

  return createSession();
}

function recordPageView() {
  const session = readSession();
  const page = currentPage();

  if (session.pages.at(-1) !== page) session.pages.push(page);
  session.pages = session.pages.slice(-8);

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Submission still works when storage is unavailable.
  }

  return session;
}

export function getLeadFormData(form: HTMLFormElement, formId: string) {
  const session = recordPageView();
  const data = new FormData(form);

  data.set("form_id", formId);
  data.set("current_page", currentPage());
  data.set("landing_page", session.landingPage);
  data.set("journey", session.pages.join(" ← "));
  data.set("referrer", session.referrer);
  data.set("campaign", session.campaign);
  data.set("duration_seconds", String(Math.max(0, Math.round((Date.now() - session.startedAt) / 1000))));

  return data;
}

export function LeadAttribution() {
  const pathname = usePathname();

  useEffect(() => {
    recordPageView();
  }, [pathname]);

  return null;
}
