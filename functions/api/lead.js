import { buildAdminSms } from "../lib/lead-message.mjs";
import { normalizeMobile } from "../lib/normalize-mobile.mjs";

const API_URL = "https://mydnspanel.com/webservice/server";
const PHONEBOOK_ID = 64161;
const NAME_FIELD_ID = "FMjUyMjUz";
const JOB_FIELD_ID = "FMzQ5NDA2";
const FORM_NAMES = {
  "chat-agent": "درخواست چت ایجنت",
  contact: "گفت‌وگوی عمومی",
  "footer-callback": "درخواست تماس فوتر",
};
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  headers: { "Cache-Control": "no-store", "Content-Type": "application/json; charset=utf-8" },
  status,
});

async function verifyTurnstile(request, secret, token) {
  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  body.set("remoteip", request.headers.get("CF-Connecting-IP") || "");

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    body,
    method: "POST",
  });
  const result = await response.json();
  return response.ok
    && result.success === true
    && result.action === "lead_form"
    && result.hostname === new URL(request.url).hostname;
}

async function callSmsApi(apiKey, payload) {
  const response = await fetch(API_URL, {
    body: JSON.stringify(payload),
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
    method: "POST",
  });
  const result = await response.json().catch(() => null);
  return { ok: response.ok && String(result?.result) === "1", result: result?.result ?? "invalid-response" };
}

async function callTelegramApi(botToken, chatId, text) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    body: JSON.stringify({ chat_id: chatId, text }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const result = await response.json().catch(() => null);
  return { ok: response.ok && result?.ok === true, result: result?.description ?? "invalid-response" };
}

function sourcePage(request) {
  try {
    const page = new URL(request.headers.get("Referer") || "");
    return page.origin === new URL(request.url).origin ? page.pathname : "";
  } catch {
    return "";
  }
}

export async function onRequestPost({ env, request }) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID || !env.TURNSTILE_SECRET_KEY) {
    console.error(JSON.stringify({ event: "lead_configuration_missing" }));
    return json({ message: "فرم در حال حاضر در دسترس نیست.", ok: false }, 503);
  }
  const smsConfigured = Boolean(env.SMS_API_KEY && env.SMS_ADMIN_MOBILE);

  const origin = request.headers.get("Origin");
  if (origin !== new URL(request.url).origin) {
    return json({ message: "درخواست نامعتبر است.", ok: false }, 403);
  }

  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength > 8_192) return json({ message: "درخواست بیش از حد بزرگ است.", ok: false }, 413);

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ message: "اطلاعات فرم معتبر نیست.", ok: false }, 400);
  }

  if (String(form.get("website") || "")) return json({ ok: true });

  const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const name = clean(form.get("name"));
  /* The contact dialog sends a trade (`job`); the chat deployment form sends a
     business name. Either one identifies the lead. */
  const profile = clean(form.get("job")) || clean(form.get("business"));
  /* The chat form posts one entry per checked channel, so all of them are kept. */
  const channels = clean(form.getAll("channels").join("، "));
  const note = clean(form.get("note"));
  const mobile = normalizeMobile(form.get("mobile"));
  const formId = clean(form.get("form_id"));
  const currentPage = clean(form.get("current_page"));
  const landingPage = clean(form.get("landing_page"));
  const journey = clean(form.get("journey"));
  const referrer = clean(form.get("referrer"));
  const campaign = clean(form.get("campaign"));
  const durationSeconds = Number.parseInt(clean(form.get("duration_seconds")), 10);
  const adminMobile = smsConfigured ? normalizeMobile(env.SMS_ADMIN_MOBILE) : null;
  const turnstileToken = String(form.get("cf-turnstile-response") || "");

  if (!name || name.length > 80 || !profile || profile.length > 100 || !mobile) {
    return json({ message: "نام، شماره موبایل و شغل یا نام کسب‌وکار را درست وارد کنید.", ok: false }, 400);
  }
  if (channels.length > 200 || note.length > 600) {
    return json({ message: "توضیحات یا کانال‌های انتخابی بیش از حد بلند است.", ok: false }, 400);
  }
  if (currentPage.length > 200 || landingPage.length > 200 || journey.length > 500 || referrer.length > 100 || campaign.length > 300) {
    return json({ message: "اطلاعات منبع فرم معتبر نیست.", ok: false }, 400);
  }
  if (smsConfigured && !adminMobile) {
    console.error(JSON.stringify({ event: "lead_admin_mobile_invalid" }));
    return json({ message: "فرم در حال حاضر در دسترس نیست.", ok: false }, 503);
  }

  try {
    if (!turnstileToken || !await verifyTurnstile(request, env.TURNSTILE_SECRET_KEY, turnstileToken)) {
      return json({ message: "تأیید امنیتی انجام نشد. لطفاً دوباره تلاش کنید.", ok: false }, 403);
    }

    const lead = { channels, mobile, name, note, profile };
    const adminMessage = buildAdminSms(lead);
    const formName = Object.hasOwn(FORM_NAMES, formId) ? FORM_NAMES[formId] : "";
    const telegramMessage = formName ? buildAdminSms({
      ...lead,
      attribution: {
        campaign,
        durationSeconds: Number.isFinite(durationSeconds) ? Math.min(Math.max(durationSeconds, 0), 604_800) : 0,
        form: formName,
        journey,
        landingPage,
        page: sourcePage(request) || currentPage,
        referrer,
      },
    }) : adminMessage;
    const [telegram, contact, visitorSms, adminSms] = await Promise.all([
      callTelegramApi(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID, telegramMessage),
      ...(smsConfigured ? [
        callSmsApi(env.SMS_API_KEY, {
          action: "newContact",
          cFields: { [NAME_FIELD_ID]: name, [JOB_FIELD_ID]: profile },
          cNumber: mobile,
          phoneId: PHONEBOOK_ID,
        }),
        callSmsApi(env.SMS_API_KEY, {
          action: "send",
          from: "auto",
          receivers: mobile,
          text: "درخواست همکاری شما در زی‌تک ثبت شد. برای ادامه گفتگو با شما در تماس خواهیم بود.",
          trySend: 2,
          type: 1,
        }),
        callSmsApi(env.SMS_API_KEY, {
          action: "send",
          from: "auto",
          receivers: adminMobile,
          text: adminMessage,
          trySend: 2,
          type: 1,
        }),
      ] : []),
    ]);

    if (smsConfigured && !contact.ok) {
      console.error(JSON.stringify({ event: "lead_contact_save_failed", result: contact.result }));
    }
    if (smsConfigured && (!visitorSms.ok || !adminSms.ok)) {
      // ponytail: provider has no idempotency key; add durable storage if duplicate retries become measurable.
      console.error(JSON.stringify({
        adminResult: adminSms.result,
        event: "lead_sms_failed",
        visitorResult: visitorSms.result,
      }));
      return json({ message: "در ارسال پیامک مشکلی پیش آمد. لطفاً دوباره تلاش کنید.", ok: false }, 502);
    }
    if (!telegram.ok) {
      console.error(JSON.stringify({ event: "lead_telegram_failed", result: telegram.result }));
      return json({ message: "در ارسال اعلان مشکلی پیش آمد. لطفاً دوباره تلاش کنید.", ok: false }, 502);
    }

    return json({ ok: true });
  } catch (error) {
    console.error(JSON.stringify({ event: "lead_unexpected_error", message: String(error) }));
    return json({ message: "ارتباط با سرویس ارسال برقرار نشد. لطفاً دوباره تلاش کنید.", ok: false }, 502);
  }
}

export function onRequest() {
  return json({ message: "Method not allowed", ok: false }, 405);
}
