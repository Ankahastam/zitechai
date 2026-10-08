const API_URL = "https://gptcloud.arc53.com/api/answer";
const COOKIE = "zitech_chat";
const SESSION_SECONDS = 3_600;
const encoder = new TextEncoder();
const json = (body, status = 200, headers = {}) => Response.json(body, {
  headers: { "Cache-Control": "no-store", ...headers }, status,
});
const fail = (message, status) => json({ ok: false, message }, status);
const base64url = (bytes) => btoa(String.fromCharCode(...bytes))
  .replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
const unbase64url = (value) => Uint8Array.from(atob(value.replaceAll("-", "+").replaceAll("_", "/")), (char) => char.charCodeAt(0));

async function readJson(response, limit) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("EMPTY_BODY");
  const chunks = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > limit) {
      await reader.cancel();
      throw new Error("BODY_TOO_LARGE");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function sessionKey(secret) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function readSession(cookie, secret) {
  const token = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!token) return null;
  try {
    if (token.length > 1_024) throw new Error("INVALID_SESSION");
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) throw new Error("INVALID_SESSION");
    const valid = await crypto.subtle.verify("HMAC", await sessionKey(secret), unbase64url(signature), encoder.encode(payload));
    if (!valid) throw new Error("INVALID_SESSION");
    const data = JSON.parse(new TextDecoder().decode(unbase64url(payload)));
    if (!validId(data.id) || !Number.isFinite(data.expires) || data.expires <= Date.now()) throw new Error("INVALID_SESSION");
    return data;
  } catch { throw new Error("INVALID_SESSION"); }
}

function validId(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,128}$/.test(value);
}

async function sessionCookie(id, secret, secure) {
  const payload = base64url(encoder.encode(JSON.stringify({ id, expires: Date.now() + SESSION_SECONDS * 1_000 })));
  const signature = base64url(new Uint8Array(await crypto.subtle.sign("HMAC", await sessionKey(secret), encoder.encode(payload))));
  return `${COOKIE}=${payload}.${signature}; Path=/api/chat; Max-Age=${SESSION_SECONDS}; HttpOnly; SameSite=Strict${secure ? "; Secure" : ""}`;
}

function sourcesForVisitor(sources) {
  if (!Array.isArray(sources)) return [];
  return sources.slice(0, 6).filter((source) => source && typeof source === "object").map((source) => {
    const name = source.title || source.metadata?.title || source.source || "منبع پاسخ";
    let url = null;
    try {
      const candidate = new URL(source.url || source.metadata?.url || source.source);
      if (["https:", "http:"].includes(candidate.protocol) && !candidate.username && !candidate.password) url = candidate.href;
    } catch { /* Uploaded files may have a title without a public URL. */ }
    return { title: String(name).slice(0, 160), url };
  });
}

export async function onRequestPost({ request, env }) {
  const origin = new URL(request.url).origin;
  if (request.headers.get("Origin") !== origin) return fail("درخواست معتبر نیست.", 403);
  if (!env.DOCSGPT_API_KEY || !env.TURNSTILE_SECRET_KEY || typeof env.CHAT_SESSION_SECRET !== "string" || env.CHAT_SESSION_SECRET.length < 32) {
    return fail("گفتگو هنوز فعال نشده است. لطفاً از فرم تماس استفاده کنید.", 503);
  }
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) return fail("درخواست معتبر نیست.", 415);
  if (Number(request.headers.get("Content-Length")) > 12_288) return fail("پیام بیش از حد بلند است.", 413);
  let input;
  try { input = await readJson(request, 12_288); }
  catch (error) { return fail("پیام معتبر نیست.", error.message === "BODY_TOO_LARGE" ? 413 : 400); }
  if (!input || typeof input !== "object" || Array.isArray(input)) return fail("پیام معتبر نیست.", 400);
  const question = typeof input.question === "string" ? input.question.trim() : "";
  if (!question || question.length > 2_000 || typeof input.token !== "string" || !input.token || input.token.length > 2_048
    || (input.newConversation !== undefined && typeof input.newConversation !== "boolean")) return fail("پیام یا تأیید امنیتی معتبر نیست.", 400);
  let session;
  try { session = input.newConversation ? null : await readSession(request.headers.get("Cookie") || "", env.CHAT_SESSION_SECRET); }
  catch { return fail("نشست گفتگو معتبر نیست یا منقضی شده است. گفتگوی تازه‌ای شروع کنید.", 403); }
  try {
    const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: input.token, remoteip: request.headers.get("CF-Connecting-IP") || "" }),
      method: "POST", signal: AbortSignal.timeout(10_000),
    });
    const verified = await readJson(verification, 16_384);
    if (!verification.ok || verified.success !== true || verified.action !== "website_chat" || verified.hostname !== new URL(request.url).hostname) {
      return fail("تأیید امنیتی انجام نشد. لطفاً دوباره تلاش کنید.", 403);
    }
    const upstream = await fetch(API_URL, {
      body: JSON.stringify({ question, api_key: env.DOCSGPT_API_KEY, ...(session ? { conversation_id: session.id } : {}), visibility: "hidden" }),
      headers: { "Content-Type": "application/json" }, method: "POST", redirect: "error", signal: AbortSignal.timeout(55_000),
    });
    if (!upstream.ok) {
      // Log only the status, never the provider body, API key, question or session.
      console.error(JSON.stringify({ event: "chat_upstream_error", status: upstream.status }));
      if (upstream.status === 429) return fail("ظرفیت گفتگو فعلاً تکمیل است. کمی بعد دوباره تلاش کنید.", 429);
      return fail("پاسخ‌گویی فعلاً در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید.", 502);
    }
    const result = await readJson(upstream, 1_048_576);
    if (result.pending_tool_calls?.length) return fail("این درخواست به اقدام دیگری نیاز دارد. لطفاً از فرم تماس استفاده کنید.", 422);
    if (typeof result.answer !== "string" || !result.answer.trim() || result.answer.length > 32_000 || !validId(result.conversation_id)) {
      return fail("پاسخ معتبری دریافت نشد. لطفاً دوباره تلاش کنید.", 502);
    }
    return json({ ok: true, answer: result.answer, sources: sourcesForVisitor(result.sources) }, 200, {
      "Set-Cookie": await sessionCookie(result.conversation_id, env.CHAT_SESSION_SECRET, new URL(request.url).protocol === "https:"),
    });
  } catch (error) {
    const timedOut = ["TimeoutError", "AbortError"].includes(error.name);
    console.error(JSON.stringify({ event: "chat_request_failed", kind: timedOut ? "timeout" : "unavailable" }));
    return fail(timedOut ? "دریافت پاسخ بیش از حد طول کشید. لطفاً کمی بعد دوباره تلاش کنید." : "ارتباط با سرویس گفتگو برقرار نشد. لطفاً کمی بعد دوباره تلاش کنید.", timedOut ? 504 : 502);
  }
}

export function onRequest() {
  return json({ ok: false, message: "Method not allowed" }, 405, { Allow: "POST" });
}
