import { brand } from "../config/brand";

/**
 * Accent outline drawn around its parent (parent must be position: relative).
 * `p` 0–1 fades/scales it in.
 */
export const HighlightRing: React.FC<{ p: number; radius?: number; inset?: number }> = ({
  p,
  radius = brand.radii.lg,
  inset = -8,
}) =>
  p <= 0 ? null : (
    <div
      style={{
        position: "absolute",
        inset,
        borderRadius: radius - inset,
        border: `4px solid ${brand.colors.accent}`,
        boxShadow: `0 0 0 ${10 * p}px ${brand.colors.accentGlow}`,
        opacity: p,
        scale: `${1.04 - 0.04 * p}`,
        pointerEvents: "none",
      }}
    />
  );
