import assert from "node:assert/strict";
import { onRequestPost } from "../functions/api/lead.js";
import { buildAdminSms } from "../functions/lib/lead-message.mjs";
import { normalizeMobile } from "../functions/lib/normalize-mobile.mjs";

assert.equal(normalizeMobile("۰۹۱۲ ۳۴۵ ۶۷۸۹"), "9123456789");
assert.equal(normalizeMobile("+98 912-345-6789"), "9123456789");
assert.equal(normalizeMobile("123"), null);

const base = { mobile: "9123456789", name: "سارا", profile: "کلینیک" };

assert.equal(
  buildAdminSms(base),
  "لید جدید سایت زی‌تک\nنام: سارا\nشماره: 09123456789\nشغل/کسب‌وکار: کلینیک",
);

// Optional fields appear only when filled, so the contact dialog keeps its old text.
assert.ok(buildAdminSms({ ...base, channels: "وب‌سایت، تلگرام" }).endsWith("\nکانال‌ها: وب‌سایت، تلگرام"));
assert.ok(!buildAdminSms({ ...base, note: "" }).includes("توضیح"));

// A long note is truncated instead of blowing the message across many SMS parts.
const long = buildAdminSms({ ...base, note: "الف".repeat(400) });
assert.ok(long.includes("…"));
assert.ok(long.length < 320);

const form = new FormData();
form.set("name", "سارا");
form.set("mobile", "09123456789");
form.set("business", "کلینیک");
form.set("cf-turnstile-response", "verified-token");
form.set("form_id", "chat-agent");
form.set("current_page", "/chat");
form.set("landing_page", "/");
form.set("journey", "/ ← /chat");
form.set("referrer", "google.com");
form.set("campaign", "source: google، medium: cpc");
form.set("duration_seconds", "90");

const realFetch = globalThis.fetch;
let telegramPayload = null;
globalThis.fetch = async (input, init = {}) => {
  const url = String(input);
  if (url.includes("turnstile")) {
    return Response.json({ action: "lead_form", hostname: "zitech.example", success: true });
  }
  if (url.includes("api.telegram.org")) {
    telegramPayload = JSON.parse(String(init.body));
    return Response.json({ ok: true, result: { message_id: 1 } });
  }
  return Response.json({ result: "1" });
};

try {
  const request = new Request("https://zitech.example/api/lead", {
    body: form,
    headers: { Origin: "https://zitech.example", Referer: "https://zitech.example/chat" },
    method: "POST",
  });
  const response = await onRequestPost({
    env: {
      SMS_ADMIN_MOBILE: "09120000000",
      SMS_API_KEY: "sms-test-key",
      TELEGRAM_BOT_TOKEN: "telegram-test-token",
      TELEGRAM_CHAT_ID: "12345",
      TURNSTILE_SECRET_KEY: "turnstile-test-key",
    },
    request,
  });

  assert.equal(response.status, 200);
  assert.deepEqual(telegramPayload, {
    chat_id: "12345",
    text: [
      "لید جدید سایت زی‌تک",
      "نام: سارا",
      "شماره: 09123456789",
      "شغل/کسب‌وکار: کلینیک",
      "فرم: درخواست چت ایجنت",
      "صفحه ثبت: /chat",
      "صفحه ورود: /",
      "مسیر نشست: / ← /chat",
      "زمان تا ثبت: 90 ثانیه",
      "ارجاع‌دهنده: google.com",
      "کمپین: source: google، medium: cpc",
    ].join("\n"),
  });

  const telegramOnlyForm = new FormData();
  telegramOnlyForm.set("name", "سارا");
  telegramOnlyForm.set("mobile", "09123456789");
  telegramOnlyForm.set("job", "کلینیک");
  telegramOnlyForm.set("cf-turnstile-response", "verified-token");
  const telegramOnlyResponse = await onRequestPost({
    env: {
      TELEGRAM_BOT_TOKEN: "telegram-test-token",
      TELEGRAM_CHAT_ID: "12345",
      TURNSTILE_SECRET_KEY: "turnstile-test-key",
    },
    request: new Request("https://zitech.example/api/lead", {
      body: telegramOnlyForm,
      headers: { Origin: "https://zitech.example" },
      method: "POST",
    }),
  });
  assert.equal(telegramOnlyResponse.status, 200, "Telegram must work when optional SMS settings are absent");
} finally {
  globalThis.fetch = realFetch;
}

console.log("lead input check passed");
