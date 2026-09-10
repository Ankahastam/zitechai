const digitMap = "۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩";

export function normalizeMobile(value) {
  const digits = String(value)
    .replace(/[۰-۹٠-٩]/g, (digit) => String(digitMap.indexOf(digit) % 10))
    .replace(/\D/g, "");

  if (/^00989\d{9}$/.test(digits)) return digits.slice(4);
  if (/^989\d{9}$/.test(digits)) return digits.slice(2);
  if (/^09\d{9}$/.test(digits)) return digits.slice(1);
  return /^9\d{9}$/.test(digits) ? digits : null;
}
