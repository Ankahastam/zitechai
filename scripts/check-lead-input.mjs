import assert from "node:assert/strict";
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

console.log("lead input check passed");
