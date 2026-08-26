import localFont from "next/font/local";

export const iranYekanX = localFont({
  src: [
    {
      path: "./iranyekanx/IRANYekanX-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./iranyekanx/IRANYekanX-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-persian",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
  adjustFontFallback: false,
});
