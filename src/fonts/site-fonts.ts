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

export const lahzeh = localFont({
  src: "./lahzeh/Lahzeh-SemiBold.ttf",
  weight: "600",
  style: "normal",
  variable: "--font-lahzeh",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
  adjustFontFallback: false,
});
