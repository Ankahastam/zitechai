import localFont from "next/font/local";

export const iranSansX = localFont({
  src: "./iransansx/IRANSansX-Medium.woff2",
  weight: "500",
  style: "normal",
  variable: "--font-persian",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

export const pinar = localFont({
  src: "./pinar/Pinar-DS4-FD-Bold.woff2",
  weight: "700",
  style: "normal",
  variable: "--font-pinar",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
  adjustFontFallback: false,
});
