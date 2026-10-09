import { Img, staticFile } from "remotion";
import { brand } from "../config/brand";

/**
 * Original InboxPilot mark: a chat bubble with a forward "pilot" chevron.
 * Coloured from brand.colors.accent. Set brand.logo.customSrc to use your own file.
 */
export const LogoMark: React.FC<{ size?: number }> = ({ size = 56 }) => {
  if (brand.logo.customSrc) {
    return (
      <Img
        src={staticFile(brand.logo.customSrc)}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  const c = brand.colors;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="18" fill={c.accent} />
      <path
        d="M16 20c0-3.3 2.7-6 6-6h20c3.3 0 6 2.7 6 6v15c0 3.3-2.7 6-6 6H30l-8.6 7.4c-1 .9-2.4.1-2.4-1.2V41h-3V20Z"
        fill={c.onAccent}
      />
      <path
        d="M27 22.5 36 28l-9 5.5"
        stroke={c.accent}
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="48" cy="16" r="5" fill={c.accentTint} stroke={c.accent} strokeWidth="2.5" />
    </svg>
  );
};

export const Wordmark: React.FC<{ size?: number; color?: string }> = ({
  size = 56,
  color = brand.colors.text,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.28 }}>
    <LogoMark size={size} />
    <div
      style={{
        fontSize: size * 0.68,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        color,
      }}
    >
      {brand.productName}
    </div>
  </div>
);
