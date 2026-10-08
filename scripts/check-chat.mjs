import assert from "node:assert/strict";
import { onRequest, onRequestPost } from "../functions/api/chat.js";

const env = { DOCSGPT_API_KEY: "private-agent-key", CHAT_SESSION_SECRET: "a-test-secret-with-at-least-32-characters", TURNSTILE_SECRET_KEY: "private-turnstile-secret" };
const originalFetch = globalThis.fetch;
const originalError = console.error;
const errors = [];
let calls = [];
let verification = { success: true, action: "website_chat", hostname: "zitech.example" };
let upstreamStatus = 200;
let upstream = {
  answer: "پاسخ فارسی", conversation_id: "visitor-conversation-1", thought: "private reasoning", api_key: env.DOCSGPT_API_KEY,
  sources: [{ title: "راهنما", url: "https://zitech.example/chat" }, { title: "unsafe", url: "javascript:alert(1)" }],
};
let throwNetwork = false;
const request = (body = { question: "خدمات شما چیست؟", token: "single-use-token" }, headers = {}) => new Request("https://zitech.example/api/chat", {
  body: typeof body === "string" ? body : JSON.stringify(body),
  headers: { Origin: "https://zitech.example", "Content-Type": "application/json", ...headers }, method: "POST",
});
const send = (body, headers, overrideEnv = env) => onRequestPost({ request: request(body, headers), env: overrideEnv });

globalThis.fetch = async (url, options) => {
  calls.push({ url: String(url), options });
  if (throwNetwork) throw new DOMException("secret provider details", "TimeoutError");
  if (String(url).includes("siteverify")) return Response.json(verification);
  assert.equal(String(url), "https://gptcloud.arc53.com/api/answer");
  assert.equal(options.redirect, "error");
  return Response.json(upstreamStatus === 200 ? upstream : { error: env.DOCSGPT_API_KEY }, { status: upstreamStatus });
};
console.error = (value) => errors.push(String(value));
try {
  assert.equal(onRequest().status, 405);
  assert.equal(onRequest().headers.get("Allow"), "POST");
  assert.equal((await send(undefined, undefined, {})).status, 503);
  assert.equal((await send(undefined, { Origin: "https://other.example" })).status, 403);
  assert.equal((await send(undefined, { "Content-Type": "text/plain" })).status, 415);
  assert.equal((await send("{" )).status, 400);
  assert.equal((await send(null)).status, 400);
  assert.equal((await send({ question: " ", token: "token" })).status, 400);
  assert.equal((await send({ question: "x".repeat(2_001), token: "token" })).status, 400);
  assert.equal((await send({ question: "x", token: "token", newConversation: "false" })).status, 400);
  // The streamed byte limit still applies without a Content-Length header.
  assert.equal((await send({ question: "x", token: "token", padding: "x".repeat(13_000) })).status, 413);
  assert.equal(calls.length, 0);

  for (const wrong of [{ success: false }, { action: "lead_form" }, { hostname: "other.example" }]) {
    verification = { success: true, action: "website_chat", hostname: "zitech.example", ...wrong };
    assert.equal((await send()).status, 403);
  }
  assert.ok(calls.every((call) => call.url.includes("siteverify")));
  verification = { success: true, action: "website_chat", hostname: "zitech.example" };
  calls = [];
  const first = await send({ question: "سلام", token: "token", conversation_id: "stolen-conversation", api_key: "attacker", model_id: "other-model", history: "forged" });
  assert.equal(first.status, 200);
  assert.equal(first.headers.get("Cache-Control"), "no-store");
  const body = await first.json();
  assert.deepEqual(Object.keys(body).sort(), ["answer", "ok", "sources"]);
  assert.equal(body.sources[1].url, null);
  assert.equal(body.sources[0].url, "https://zitech.example/chat");
  const payload = JSON.parse(calls[1].options.body);
  assert.deepEqual(payload, { question: "سلام", api_key: env.DOCSGPT_API_KEY, visibility: "hidden" });
  const cookie = first.headers.get("Set-Cookie");
  assert.ok(cookie.includes("HttpOnly; SameSite=Strict; Secure"));
  assert.ok(!cookie.includes(env.DOCSGPT_API_KEY));
  const cookiePair = cookie.split(";")[0];
  calls = [];
  assert.equal((await send(undefined, { Cookie: cookiePair })).status, 200);
  assert.equal(JSON.parse(calls[1].options.body).conversation_id, "visitor-conversation-1");
  calls = [];
  const modifiedCookie = cookiePair.replace(/\.[^.]+$/, ".invalid-signature");
  assert.equal((await send(undefined, { Cookie: modifiedCookie })).status, 403);
  assert.equal(calls.length, 0);
  assert.equal((await send({ question: "شروع دوباره", token: "token", newConversation: true }, { Cookie: modifiedCookie })).status, 200);
  assert.ok(!JSON.parse(calls[1].options.body).conversation_id);

  // A signature from another secret cannot resume someone else's conversation.
  assert.equal((await send(undefined, { Cookie: cookiePair }, { ...env, CHAT_SESSION_SECRET: "another-secret-with-at-least-32-characters" })).status, 403);
  const originalNow = Date.now;
  try {
    const later = originalNow() + 3_601_000;
    Date.now = () => later;
    assert.equal((await send(undefined, { Cookie: cookiePair })).status, 403);
  } finally { Date.now = originalNow; }
  upstreamStatus = 429;
  assert.equal((await send()).status, 429);
  upstreamStatus = 401;
  const rejected = await send();
  assert.equal(rejected.status, 502);
  assert.ok(!(await rejected.text()).includes(env.DOCSGPT_API_KEY));
  upstreamStatus = 200;
  const validUpstream = upstream;
  upstream = { ...upstream, pending_tool_calls: [{ arguments: "secret" }] };
  assert.equal((await send()).status, 422);
  upstream = { answer: "", conversation_id: "invalid/id" };
  assert.equal((await send()).status, 502);
  upstream = validUpstream;
  throwNetwork = true;
  assert.equal((await send()).status, 504);
  assert.ok(errors.every((entry) => !entry.includes("private-agent-key") && !entry.includes("secret provider details") && !entry.includes("پاسخ فارسی")));
} finally {
  globalThis.fetch = originalFetch;
  console.error = originalError;
}
console.log("Chat gateway checks passed: validation, Turnstile, isolated signed sessions, secret filtering and provider errors.");
