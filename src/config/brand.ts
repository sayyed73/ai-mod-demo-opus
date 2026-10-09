/**
 * Brand settings — names, colours, fonts, logo, radii, shadows.
 * Change `colors.accent` and every teal shade in the video follows.
 */
import { alpha, deriveAccentPalette } from "../lib/color";

// ✏️ Change these freely.
const BASE = {
  productName: "InboxPilot",
  merchantName: "Northline Apparel",
  background: "#F6F3EC", // warm ivory
  text: "#18201E", // charcoal
  accent: "#00897B", // teal — tints/shades are derived from this
  card: "#FFFFFF",
};

const accent = deriveAccentPalette(BASE.accent);

export const brand = {
  productName: BASE.productName,
  merchantName: BASE.merchantName,

  colors: {
    background: BASE.background,
    text: BASE.text,
    textMuted: alpha(BASE.text, 0.62),
    textSubtle: alpha(BASE.text, 0.45),
    border: alpha(BASE.text, 0.1),
    divider: alpha(BASE.text, 0.07),
    card: BASE.card,
    surface: "#FBFAF6", // slightly warm off-white inside cards
    accent: accent.accent,
    accentTint: accent.tint,
    accentDark: accent.dark,
    accentRing: accent.ring,
    accentGlow: accent.glow,
    onAccent: "#FFFFFF",
    // Status colours (not accent-derived on purpose: they carry meaning).
    warning: "#B86E00",
    warningTint: "#FBEBCF",
    human: "#3F4A9E",
    humanTint: "#E4E7F8",
  },

  /** Channel colours are neutral dots, not third-party logos. */
  channelColors: {
    messenger: "#4C6FFF",
    whatsapp: "#2E9E5B",
    instagram: "#C1457A",
  },

  fonts: {
    family: "Inter",
    // Local files in public/fonts (SIL OFL — see public/fonts/OFL-Inter.txt).
    files: [
      { weight: "400", file: "fonts/Inter-Regular.otf" },
      { weight: "500", file: "fonts/Inter-Medium.otf" },
      { weight: "600", file: "fonts/Inter-SemiBold.otf" },
      { weight: "700", file: "fonts/Inter-Bold.otf" },
      { weight: "800", file: "fonts/Inter-ExtraBold.otf" },
    ],
    stack: "Inter, system-ui, sans-serif",
  },

  logo: {
    /**
     * null → use the built-in SVG mark (src/components/Logo.tsx), coloured by the accent.
     * Or set a file inside public/, e.g. "logos/my-logo.svg".
     */
    customSrc: null as string | null,
  },

  radii: { sm: 12, md: 18, lg: 26, xl: 36, pill: 999 },

  shadows: {
    card: `0 2px 6px ${alpha(BASE.text, 0.05)}, 0 18px 40px ${alpha(BASE.text, 0.08)}`,
    float: `0 4px 10px ${alpha(BASE.text, 0.06)}, 0 30px 70px ${alpha(BASE.text, 0.14)}`,
    soft: `0 1px 3px ${alpha(BASE.text, 0.06)}, 0 8px 20px ${alpha(BASE.text, 0.06)}`,
  },
} as const;

export type ChannelId = keyof typeof brand.channelColors;
