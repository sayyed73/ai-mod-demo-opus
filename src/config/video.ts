/**
 * Video format + number formatting.
 * Change `currency` to "EUR" or "GBP" to re-label every price in the video.
 * (Prices themselves live in src/data/demo.ts — this only changes formatting.)
 */
export type CurrencyCode = "USD" | "EUR" | "GBP";

export const video = {
  /** Composition ID used by the render scripts. */
  id: "ProductDemo",
  width: 1080,
  height: 1350, // 4:5
  fps: 30,
  /** Locale used for number/currency formatting. */
  locale: "en-US",
  currency: "USD" as CurrencyCode,
} as const;
