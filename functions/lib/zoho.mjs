import { normalizeMobile } from "./normalize-mobile.mjs";

const REQUEST_TIMEOUT_MS = 4_000;
const TRANSIENT_STATUSES = new Set([429, 500, 502, 503, 504]);
const ZOHO_ENV_KEYS = ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN", "ZOHO_ACCOUNTS_URL"];

let tokenCache = null;

class ZohoError extends Error {
  constructor(code, status = 0, field = "", recordId = "") {
    super(code);
    this.code = code;
    this.field = field;
    this.recordId = recordId;
    this.status = status;
  }
}

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function configuredEnv(env) {
  const missing = ZOHO_ENV_KEYS.filter((key) => !env[key]);
  if (missing.length) throw new ZohoError(`CONFIG_MISSING_${missing.join("_")}`);
  return env;
}

function safeHttpsUrl(value, code) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new ZohoError(code);
  }
  if (url.protocol !== "https:") throw new ZohoError(code);
  return url.origin;
}

async function fetchWithTimeout(url, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithRetry(url, init) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, init);
      if (!TRANSIENT_STATUSES.has(response.status) || attempt === 1) return response;

      const retryAfter = Number(response.headers.get("Retry-After"));
      await delay(Number.isFinite(retryAfter) ? Math.min(retryAfter * 1_000, 1_000) : 250);
    } catch (error) {
      if (attempt === 1) {
        throw new ZohoError(error?.name === "AbortError" ? "TIMEOUT" : "NETWORK_ERROR");
      }
      await delay(250);
    }
  }
  throw new ZohoError("NETWORK_ERROR");
}

async function responseJson(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new ZohoError("INVALID_JSON", response.status);
  }
}

function responseError(body, status) {
  const item = body?.data?.[0] || body;
  return new ZohoError(
    String(item?.code || `HTTP_${status}`),
    status,
    String(item?.details?.api_name || ""),
    String(item?.details?.id || ""),
  );
}

function mutationId(body, status) {
  const item = body?.data?.[0];
  const id = item?.details?.id;
  if (item?.status === "success" && id) return String(id);
  throw responseError(body, status);
}

export function hasZohoConfiguration(env) {
  return ZOHO_ENV_KEYS.every((key) => Boolean(env[key]));
}

export function hasPartialZohoConfiguration(env) {
  return ZOHO_ENV_KEYS.some((key) => Boolean(env[key])) && !hasZohoConfiguration(env);
}

export function normalizeIranianPhone(value) {
  const mobile = normalizeMobile(value);
  return mobile ? `+98${mobile}` : null;
}

export async function getZohoAccessToken(env, forceRefresh = false) {
  configuredEnv(env);
  const cacheKey = `${env.ZOHO_ACCOUNTS_URL}|${env.ZOHO_CLIENT_ID}`;
  if (!forceRefresh && tokenCache?.cacheKey === cacheKey && tokenCache.expiresAt > Date.now() + 30_000) return tokenCache;

  const accountsUrl = safeHttpsUrl(env.ZOHO_ACCOUNTS_URL, "INVALID_ACCOUNTS_URL");
  const body = new URLSearchParams({
    client_id: env.ZOHO_CLIENT_ID,
    client_secret: env.ZOHO_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: env.ZOHO_REFRESH_TOKEN,
  });
  const response = await fetchWithRetry(`${accountsUrl}/oauth/v2/token`, {
    body,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
  });
  const result = await responseJson(response);

  if (!response.ok || !result?.access_token || !result?.api_domain) {
    throw responseError(result, response.status);
  }

  const expiresIn = Number(result.expires_in) || 3_600;
  tokenCache = {
    accessToken: String(result.access_token),
    apiDomain: safeHttpsUrl(result.api_domain, "INVALID_API_DOMAIN"),
    cacheKey,
    expiresAt: Date.now() + Math.max(expiresIn - 60, 5) * 1_000,
  };
  console.info("[ZOHO] Token refreshed");
  return tokenCache;
}

async function crmRequest(env, path, init = {}) {
  let token = await getZohoAccessToken(env);
  let response = await fetchWithRetry(`${token.apiDomain}${path}`, {
    ...init,
    headers: {
      Authorization: `Zoho-oauthtoken ${token.accessToken}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  if (response.status === 401) {
    tokenCache = null;
    token = await getZohoAccessToken(env, true);
    response = await fetchWithRetry(`${token.apiDomain}${path}`, {
      ...init,
      headers: {
        Authorization: `Zoho-oauthtoken ${token.accessToken}`,
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
  }

  const body = await responseJson(response);
  if (!response.ok && response.status !== 204) throw responseError(body, response.status);
  return { body, status: response.status };
}

export async function findLeadByPhone(env, phone) {
  const normalized = normalizeIranianPhone(phone);
  if (!normalized) return null;
  const local = `0${normalized.slice(3)}`;
  const internationalDigits = normalized.slice(1);

  for (const candidate of [normalized, local, internationalDigits]) {
    const query = new URLSearchParams({ phone: candidate });
    const { body } = await crmRequest(env, `/crm/v8/Leads/search?${query}`);
    const id = body?.data?.[0]?.id;
    if (id) return String(id);
  }
  return null;
}

export function getLeadSource(lead) {
  const source = `${lead.utmSource || ""} ${lead.referrer || ""}`.toLowerCase();
  if (/(^|[^a-z])(ig|instagram)([^a-z]|$)|instagram\./.test(source)) return "Instagram";
  if (/(^|[^a-z])google([^a-z]|$)|google\./.test(source)) return "Google";
  return "Website";
}

export async function createLead(env, lead) {
  const phone = normalizeIranianPhone(lead.phone);
  const fields = {
    Last_Name: lead.name || "Website Lead",
    ...(phone ? { Phone: phone } : {}),
    ...(lead.business ? { Company: lead.business } : {}),
    Lead_Source: getLeadSource(lead),
  };

  const insert = async (data) => {
    const result = await crmRequest(env, "/crm/v8/Leads", {
      body: JSON.stringify({ data: [data] }),
      method: "POST",
    });
    return mutationId(result.body, result.status);
  };

  try {
    return { existing: false, id: await insert(fields) };
  } catch (error) {
    if (error instanceof ZohoError && error.code === "DUPLICATE_DATA" && error.recordId) {
      return { existing: true, id: error.recordId };
    }
    if (error instanceof ZohoError && error.field === "Lead_Source") {
      const withoutSource = { ...fields };
      delete withoutSource.Lead_Source;
      return { existing: false, id: await insert(withoutSource) };
    }
    throw error;
  }
}

function displayValue(value) {
  if (Array.isArray(value)) return value.join("، ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function buildZohoNote(lead) {
  const utm = (value) => value || "-";
  const labels = { channels: "کانال‌ها", note: "توضیحات" };
  const lines = [
    `فرم سایت: ${lead.formName || "فرم وب‌سایت"}`,
    `نام: ${lead.name || "-"}`,
    `شماره واردشده: ${lead.originalPhone || lead.phone || "-"}`,
    `کسب‌وکار / شغل: ${lead.business || "-"}`,
    `صفحه ثبت: ${lead.submittedFrom || "-"}`,
    `صفحه ورود: ${lead.landingPage || "-"}`,
    `Referrer: ${lead.referrer || "-"}`,
    "",
    `UTM Source: ${utm(lead.utmSource)}`,
    `UTM Medium: ${utm(lead.utmMedium)}`,
    `UTM Campaign: ${utm(lead.utmCampaign)}`,
    `UTM Content: ${utm(lead.utmContent)}`,
    `UTM Term: ${utm(lead.utmTerm)}`,
    "",
    "Session Path:",
    lead.sessionPath?.length ? lead.sessionPath.join(" → ") : "-",
    "",
    `زمان تا ثبت: ${Number.isFinite(lead.timeToSubmitSeconds) ? `${lead.timeToSubmitSeconds} seconds` : "-"}`,
    `زمان ثبت: ${lead.submittedAt || new Date().toISOString()}`,
    `Lead Source: ${getLeadSource(lead)}`,
  ];

  const extras = Object.entries(lead.extraFields || {}).filter(([, value]) => value !== "");
  if (extras.length) {
    lines.push("", "اطلاعات تکمیلی فرم:");
    for (const [key, value] of extras) lines.push(`${labels[key] || key}: ${displayValue(value)}`);
  }
  return lines.join("\n");
}

export async function createLeadNote(env, leadId, lead) {
  const result = await crmRequest(env, `/crm/v8/Leads/${encodeURIComponent(leadId)}/Notes`, {
    body: JSON.stringify({
      data: [{ Note_Content: buildZohoNote(lead), Note_Title: "Website Form Submission" }],
    }),
    method: "POST",
  });
  const noteId = mutationId(result.body, result.status);
  console.info(`[ZOHO] Note created: ${noteId}`);
  return noteId;
}

export async function syncWebsiteLeadToZoho(env, lead) {
  configuredEnv(env);
  const existingId = await findLeadByPhone(env, lead.phone);
  let leadId = existingId;

  if (existingId) {
    console.info(`[ZOHO] Existing lead found by phone: ${existingId}`);
  } else {
    const created = await createLead(env, lead);
    leadId = created.id;
    console.info(created.existing
      ? `[ZOHO] Existing lead returned by duplicate check: ${leadId}`
      : `[ZOHO] Lead created: ${leadId}`);
  }

  await createLeadNote(env, leadId, lead);
  return leadId;
}

export function logZohoError(error) {
  const detail = error instanceof ZohoError
    ? `${error.code}${error.status ? ` (${error.status})` : ""}`
    : "UNEXPECTED_ERROR";
  console.error(`[ZOHO] Error syncing lead: ${detail}`);
}
