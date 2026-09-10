const MAX_NOTE = 200;

/* The SMS is the only record of a lead, so optional fields are appended rather
   than dropped.
   ponytail: long notes are truncated to keep the message inside a few parts;
   add durable storage if the full text has to survive. */
export function buildAdminSms({ channels = "", mobile, name, note = "", profile }) {
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

  return lines.join("\n");
}
