/** Tiny colour helpers so accent shades can be derived from one hex value. */

type Rgb = { r: number; g: number; b: number };
type Hsl = { h: number; s: number; l: number };

export const hexToRgb = (hex: string): Rgb => {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const toHex = (v: number) =>
  Math.round(Math.max(0, Math.min(255, v)))
    .toString(16)
    .padStart(2, "0");

export const rgbToHex = ({ r, g, b }: Rgb) =>
  `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();

export const rgbToHsl = ({ r, g, b }: Rgb): Hsl => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: h * 60, s, l };
};

export const hslToHex = ({ h, s, l }: Hsl): string => {
  const hh = (((h % 360) + 360) % 360) / 360;
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  if (s === 0) return rgbToHex({ r: l * 255, g: l * 255, b: l * 255 });
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return rgbToHex({
    r: hue2rgb(p, q, hh + 1 / 3) * 255,
    g: hue2rgb(p, q, hh) * 255,
    b: hue2rgb(p, q, hh - 1 / 3) * 255,
  });
};

/** rgba() string from a hex colour. */
export const alpha = (hex: string, a: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/** Mix two hex colours (t = 0 → a, t = 1 → b). */
export const mix = (a: string, b: string, t: number) => {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex({
    r: ca.r + (cb.r - ca.r) * t,
    g: ca.g + (cb.g - ca.g) * t,
    b: ca.b + (cb.b - ca.b) * t,
  });
};

/**
 * Every accent shade used in the video, derived from a single accent hex.
 * With the default teal (#00897B) the tint comes out at ≈ #DDF4EC.
 */
export const deriveAccentPalette = (accent: string) => {
  const hsl = rgbToHsl(hexToRgb(accent));
  return {
    accent,
    /** Pale background tint (selected rows, badges). */
    tint: hslToHex({ h: hsl.h - 15, s: Math.min(0.51, hsl.s), l: 0.912 }),
    /** Darker shade for pressed buttons and text on tint. */
    dark: hslToHex({ h: hsl.h, s: hsl.s, l: Math.max(0.12, hsl.l - 0.1) }),
    /** Translucent accent for outlines / glows. */
    ring: alpha(accent, 0.38),
    glow: alpha(accent, 0.18),
  };
};
