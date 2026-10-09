import { brand } from "../config/brand";

/** Pressable button. `press` (0–1) dips it; `variant` sets the style. */
export const Button: React.FC<{
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "done" | "dark";
  press?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ children, variant = "primary", press = 0, fontSize = 26, style }) => {
  const c = brand.colors;
  const looks = {
    primary: { bg: c.accent, fg: c.onAccent, border: c.accent },
    dark: { bg: c.text, fg: "#FFFFFF", border: c.text },
    ghost: { bg: c.card, fg: c.text, border: c.border },
    done: { bg: c.accentTint, fg: c.accentDark, border: c.accentTint },
  }[variant];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: `${fontSize * 0.62}px ${fontSize * 1.1}px`,
        borderRadius: brand.radii.md,
        background: looks.bg,
        color: looks.fg,
        border: `2px solid ${looks.border}`,
        fontSize,
        fontWeight: 700,
        scale: `${1 - press * 0.05}`,
        filter: press > 0 ? `brightness(${1 - press * 0.12})` : undefined,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** 0–1 press amount around a click time (frames). */
export const pressAmount = (frame: number, clickFrame: number) => {
  const d = frame - clickFrame;
  if (d < -3 || d > 6) return 0;
  return 1 - Math.abs(d - 1) / 5;
};
