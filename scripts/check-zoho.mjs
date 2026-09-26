import assert from "node:assert/strict";
import { onRequestPost } from "../functions/api/lead.js";
import {
  buildZohoNote,
  getLeadSource,
  normalizeIranianPhone,
  syncWebsiteLeadToZoho,
} from "../functions/lib/zoho.mjs";

assert.equal(normalizeIranianPhone("09121234567"), "+989121234567");
assert.equal(normalizeIranianPhone("+989121234567"), "+989121234567");
assert.equal(normalizeIranianPhone("989121234567"), "+989121234567");
assert.equal(getLeadSource({ referrer: "l.instagram.com" }), "Instagram");
assert.equal(getLeadSource({ utmSource: "google" }), "Google");
assert.equal(getLeadSource({}), "Website");

const env = {
  ZOHO_ACCOUNTS_URL: "https://accounts.zoho.test",
  ZOHO_CLIENT_ID: "client-id",
  ZOHO_CLIENT_SECRET: "client-secret",
  ZOHO_REFRESH_TOKEN: "refresh-token",
};
const lead = {
  business: "کلینیک زیبایی",
  extraFields: { channels: "وب‌سایت", request_kind: "دمو" },
  formName: "درخواست منشی تلفنی",
  landingPage: "/",
  name: "علی رضایی",
  originalPhone: "0912 123 4567",
  phone: "09121234567",
  referrer: "l.instagram.com",
  sessionPath: ["/", "/voice-agent"],
  submittedAt: "2026-09-26T12:00:00.000Z",
  submittedFrom: "/voice-agent",
  timeToSubmitSeconds: 192,
  utmContent: "link_in_bio",
  utmMedium: "social",
  utmSource: "ig",
};

const note = buildZohoNote(lead);
assert.ok(note.includes("Session Path:\n/ → /voice-agent"));
assert.ok(note.includes("شماره واردشده: 0912 123 4567"));
assert.ok(note.includes("UTM Content: link_in_bio"));

const realFetch = globalThis.fetch;
const realConsoleError = console.error;
let phase = "new";
let tokenRequests = 0;
let leadCreates = 0;
let notes = 0;
let sourceAttempts = 0;
let firstUnauthorized = true;

globalThis.fetch = async (input, init = {}) => {
  const url = new URL(String(input));
  if (url.hostname === "accounts.zoho.test") {
    tokenRequests += 1;
    assert.ok(init.body instanceof URLSearchParams);
    assert.equal(init.body.get("grant_type"), "refresh_token");
    return Response.json({
      access_token: `access-${tokenRequests}`,
      api_domain: "https://api.zoho.test",
      expires_in: 3_600,
    });
  }
  if (url.pathname.endsWith("/Leads/search")) {
    assert.ok(["+989121234567", "09121234567", "989121234567"].includes(url.searchParams.get("phone")));
    if (phase === "new" || phase === "source-fallback") return new Response(null, { status: 204 });
    if (phase === "unauthorized" && firstUnauthorized) {
      firstUnauthorized = false;
      return Response.json({ code: "INVALID_TOKEN" }, { status: 401 });
    }
    return Response.json({ data: [{ id: "lead-1", Phone: "+989121234567" }] });
  }
  if (url.pathname.endsWith("/Leads") && init.method === "POST") {
    leadCreates += 1;
    const payload = JSON.parse(String(init.body));
    assert.equal(payload.data[0].Phone, "+989121234567");
    if (phase === "source-fallback" && sourceAttempts++ === 0) {
      assert.equal(payload.data[0].Lead_Source, "Instagram");
      return Response.json({
        data: [{ code: "INVALID_DATA", details: { api_name: "Lead_Source" }, status: "error" }],
      }, { status: 202 });
    }
    if (phase === "source-fallback") assert.ok(!Object.hasOwn(payload.data[0], "Lead_Source"));
    return Response.json({ data: [{ details: { id: phase === "source-fallback" ? "lead-2" : "lead-1" }, status: "success" }] }, { status: 201 });
  }
  if (url.pathname.endsWith("/Notes")) {
    notes += 1;
    const payload = JSON.parse(String(init.body));
    assert.equal(payload.data[0].Note_Title, "Website Form Submission");
    assert.ok(payload.data[0].Note_Content.includes("فرم سایت: درخواست منشی تلفنی"));
    return Response.json({ data: [{ details: { id: `note-${notes}` }, status: "success" }] }, { status: 201 });
  }
  throw new Error(`Unexpected URL: ${url}`);
};

try {
  // New number: one Lead and one Note.
  assert.equal(await syncWebsiteLeadToZoho(env, lead), "lead-1");
  assert.equal(leadCreates, 1);
  assert.equal(notes, 1);

  // Same Iranian number in international form: no second Lead, one more Note.
  phase = "duplicate";
  assert.equal(await syncWebsiteLeadToZoho(env, { ...lead, phone: "+989121234567" }), "lead-1");
  assert.equal(leadCreates, 1);
  assert.equal(notes, 2);

  // A CRM picklist rejection retries the insert without Lead_Source.
  phase = "source-fallback";
  assert.equal(await syncWebsiteLeadToZoho(env, lead), "lead-2");
  assert.equal(leadCreates, 3);
  assert.equal(notes, 3);

  // A 401 refreshes the cached token once and retries the CRM request.
  phase = "unauthorized";
  await syncWebsiteLeadToZoho(env, lead);
  assert.equal(tokenRequests, 2);

  async function formResponse(clientId, zohoFetch) {
    const form = new FormData();
    form.set("name", "سارا");
    form.set("mobile", "09123456789");
    form.set("job", "کلینیک");
    form.set("form_id", "contact");
    form.set("cf-turnstile-response", "verified-token");
    const pending = [];
    globalThis.fetch = zohoFetch;
    const response = await onRequestPost({
      env: {
        ...env,
        TELEGRAM_BOT_TOKEN: "telegram-token",
        TELEGRAM_CHAT_ID: "123",
        TURNSTILE_SECRET_KEY: "turnstile-secret",
        ZOHO_CLIENT_ID: clientId,
      },
      request: new Request("https://zitech.example/api/lead", {
        body: form,
        headers: { Origin: "https://zitech.example" },
        method: "POST",
      }),
      waitUntil(promise) { pending.push(promise); },
    });
    await Promise.all(pending);
    return response;
  }

  const errors = [];
  console.error = (message) => errors.push(String(message));
  const integrationFetch = async (input) => {
    const url = String(input);
    if (url.includes("turnstile")) return Response.json({ action: "lead_form", hostname: "zitech.example", success: true });
    if (url.includes("api.telegram.org")) return Response.json({ ok: true });
    if (url.includes("accounts.zoho.test")) return Response.json({ error: "invalid_client" }, { status: 400 });
    throw new Error(`Unexpected URL: ${url}`);
  };

  // Bad Zoho credentials do not change the successful form/Telegram response.
  assert.equal((await formResponse("invalid-client", integrationFetch)).status, 200);
  assert.ok(errors.some((message) => message.includes("[ZOHO]") && message.includes("HTTP_400")));
  assert.ok(errors.every((message) => !message.includes("refresh-token") && !message.includes("client-secret")));

  // Timeout/network abort is isolated in the same way.
  errors.length = 0;
  assert.equal((await formResponse("timeout-client", async (input) => {
    const url = String(input);
    if (url.includes("turnstile")) return Response.json({ action: "lead_form", hostname: "zitech.example", success: true });
    if (url.includes("api.telegram.org")) return Response.json({ ok: true });
    throw new DOMException("timed out", "AbortError");
  })).status, 200);
  assert.ok(errors.some((message) => message.includes("[ZOHO]") && message.includes("TIMEOUT")));
} finally {
  globalThis.fetch = realFetch;
  console.error = realConsoleError;
}

console.log("Zoho integration check passed");
