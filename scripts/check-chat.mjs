import assert from "node:assert/strict";
import { onRequest, onRequestPost } from "../functions/api/chat.js";

const env = { DOCSGPT_API_KEY: "private-agent-key", CHAT_SESSION_SECRET: "a-test-secret-with-at-least-32-characters", TURNSTILE_SECRET_KEY: "private-turnstile-secret" };
const originalFetch = globalThis.fetch;
const originalError = console.error;
const originalLog = console.log;
const errors = [];
const logs = [];
let calls = [];
let verification = { success: true, action: "website_chat", hostname: "zitech.example" };
let upstreamStatus = 200;
let upstream = {
  answer: "پاسخ فارسی", conversation_id: "visitor-conversation-1", thought: "private reasoning", api_key: env.DOCSGPT_API_KEY,
  sources: [{ title: "راهنما", url: "https://zitech.example/chat" }, { title: "unsafe", url: "javascript:alert(1)" }],
};
let throwNetwork = false;
let networkTarget = "turnstile";
let networkError = "TimeoutError";
let malformedTarget = null;
const request = (body = { question: "خدمات شما چیست؟", token: "single-use-token" }, headers = {}) => new Request("https://zitech.example/api/chat", {
  body: typeof body === "string" ? body : JSON.stringify(body),
  headers: { Origin: "https://zitech.example", "Content-Type": "application/json", ...headers }, method: "POST",
});
const send = (body, headers, overrideEnv = env) => onRequestPost({ request: request(body, headers), env: overrideEnv });

globalThis.fetch = async (url, options) => {
  calls.push({ url: String(url), options });
  // Node accepts "error", but Cloudflare's workerd rejects it before sending a request.
  assert.ok([undefined, "follow", "manual"].includes(options.redirect));
  const target = String(url).includes("siteverify") ? "turnstile" : "docsgpt";
  if (throwNetwork && target === networkTarget) throw new DOMException("secret provider details", networkError);
  if (malformedTarget === target) return new Response("<html>secret provider details</html>");
  if (target === "turnstile") return Response.json(verification);
  assert.equal(String(url), "https://gptcloud.arc53.com/api/answer");
  assert.equal(options.redirect, "manual");
  return Response.json(upstreamStatus === 200 ? upstream : { error: env.DOCSGPT_API_KEY }, {
    status: upstreamStatus,
    headers: upstreamStatus >= 300 && upstreamStatus < 400 ? { Location: "https://other.example/collect-key" } : {},
  });
};
console.error = (value) => errors.push(String(value));
console.log = (value) => logs.push(String(value));
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
  const empty = await send({});
  assert.equal(empty.status, 400);
  const emptyBody = await empty.json();
  assert.match(emptyBody.requestId, /^[a-f0-9-]{36}$/);
  assert.equal(empty.headers.get("X-Zitech-Request-Id"), emptyBody.requestId);
  assert.equal(empty.headers.get("X-Zitech-Chat"), "3");
  assert.ok(logs.some((entry) => JSON.parse(entry).requestId === emptyBody.requestId));

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
  const requestId = first.headers.get("X-Zitech-Request-Id");
  const stages = logs.map((entry) => JSON.parse(entry)).filter((entry) => entry.requestId === requestId);
  assert.deepEqual(stages.filter((entry) => entry.event === "chat_stage_started").map((entry) => entry.stage), ["turnstile", "docsgpt"]);
  assert.equal(stages.at(-1).status, 200);
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
  for (const status of [301, 302, 303, 307, 308]) {
    calls = [];
    upstreamStatus = status;
    const redirected = await send();
    assert.equal(redirected.status, 502);
    assert.equal(calls.length, 2);
    assert.equal(calls[1].url, "https://gptcloud.arc53.com/api/answer");
    assert.ok(!(await redirected.text()).includes(env.DOCSGPT_API_KEY));
  }
  upstreamStatus = 429;
  assert.equal((await send()).status, 429);
  upstreamStatus = 401;
  const rejected = await send();
  assert.equal(rejected.status, 502);
  assert.ok(errors.map((entry) => JSON.parse(entry)).some((entry) => entry.requestId === rejected.headers.get("X-Zitech-Request-Id") && entry.stage === "docsgpt" && entry.status === 401));
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
  for (const target of ["turnstile", "docsgpt"]) {
    networkTarget = target;
    for (const name of ["TimeoutError", "TypeError"]) {
      networkError = name;
      const failed = await send();
      assert.equal(failed.status, name === "TimeoutError" ? 504 : 502);
      const event = errors.map((entry) => JSON.parse(entry)).find((entry) => entry.requestId === failed.headers.get("X-Zitech-Request-Id") && entry.event === "chat_request_failed");
      assert.equal(event.stage, target);
      assert.equal(event.kind, name === "TimeoutError" ? "timeout" : "unavailable");
    }
  }
  throwNetwork = false;
  for (const target of ["turnstile", "docsgpt"]) {
    malformedTarget = target;
    const failed = await send();
    assert.equal(failed.status, 502);
    const event = errors.map((entry) => JSON.parse(entry)).find((entry) => entry.requestId === failed.headers.get("X-Zitech-Request-Id") && entry.event === "chat_request_failed");
    assert.equal(event.stage, target === "docsgpt" ? "docsgpt_response" : target);
    assert.equal(event.kind, "invalid_json");
  }
  for (const entry of [...logs, ...errors]) {
    assert.ok(![...Object.values(env), "secret provider details", "پاسخ فارسی", "سلام", "single-use-token", "visitor-conversation-1", "https://zitech.example"].some((secret) => entry.includes(secret)));
    assert.ok(Object.keys(JSON.parse(entry)).every((key) => ["event", "requestId", "stage", "durationMs", "status", "kind"].includes(key)));
  }
} finally {
  globalThis.fetch = originalFetch;
  console.error = originalError;
  console.log = originalLog;
}
console.log("Chat gateway checks passed: validation, Turnstile, isolated signed sessions, secret filtering and provider errors.");
