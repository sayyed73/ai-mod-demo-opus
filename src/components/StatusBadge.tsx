import { brand } from "../config/brand";

export type StatusTone = "accent" | "warning" | "human" | "neutral";

const tones: Record<StatusTone, { bg: string; fg: string }> = {
  accent: { bg: brand.colors.accentTint, fg: brand.colors.accentDark },
  warning: { bg: brand.colors.warningTint, fg: brand.colors.warning },
  human: { bg: brand.colors.humanTint, fg: brand.colors.human },
  neutral: { bg: brand.colors.divider, fg: brand.colors.textMuted },
};

/** Pill status label. Pass `icon` for a leading glyph. */
export const StatusBadge: React.FC<{
  label: string;
  tone: StatusTone;
  size?: number;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ label, tone, size = 22, icon, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.4,
      padding: `${size * 0.3}px ${size * 0.7}px`,
      borderRadius: brand.radii.pill,
      background: tones[tone].bg,
      color: tones[tone].fg,
      fontSize: size,
      fontWeight: 700,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {icon ?? (
      <div
        style={{
          width: size * 0.42,
          height: size * 0.42,
          borderRadius: size,
          background: tones[tone].fg,
        }}
      />
    )}
    {label}
  </div>
);
