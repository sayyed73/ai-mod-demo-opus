import { video, type CurrencyCode } from "../config/video";

/** Format minor units (e.g. 4900) as money (e.g. "$49.00"). */
export const formatCurrency = (
  minor: number,
  opts: { currency?: CurrencyCode; locale?: string; trimZeros?: boolean } = {},
) => {
  const currency = opts.currency ?? video.currency;
  const value = minor / 100;
  const whole = opts.trimZeros && Number.isInteger(value);
  return new Intl.NumberFormat(opts.locale ?? video.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(value);
};
