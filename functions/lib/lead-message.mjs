const MAX_NOTE = 200;

/* The SMS is the only record of a lead, so optional fields are appended rather
   than dropped.
   ponytail: long notes are truncated to keep the message inside a few parts;
   add durable storage if the full text has to survive. */
export function buildAdminSms({ attribution, channels = "", mobile, name, note = "", profile }) {
  const lines = [
    "لید جدید سایت زی‌تک",
    `نام: ${name}`,
    `شماره: 0${mobile}`,
    `شغل/کسب‌وکار: ${profile}`,
  ];

  if (channels) lines.push(`کانال‌ها: ${channels}`);
  if (note) {
    lines.push(`توضیح: ${note.length > MAX_NOTE ? `${note.slice(0, MAX_NOTE)}…` : note}`);
  }
  if (attribution) {
    lines.push(
      `فرم: ${attribution.form}`,
      `صفحه ثبت: ${attribution.page || "نامشخص"}`,
    );
    if (attribution.landingPage) lines.push(`صفحه ورود: ${attribution.landingPage}`);
    if (attribution.journey) lines.push(`مسیر نشست: ${attribution.journey}`);
    if (attribution.durationSeconds >= 0) lines.push(`زمان تا ثبت: ${attribution.durationSeconds} ثانیه`);
    if (attribution.referrer) lines.push(`ارجاع‌دهنده: ${attribution.referrer}`);
    if (attribution.campaign) lines.push(`کمپین: ${attribution.campaign}`);
  }

  return lines.join("\n");
}
