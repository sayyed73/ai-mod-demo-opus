import { brand } from "../config/brand";
import { HighlightRing } from "./HighlightRing";

/** Dashboard count tile. `value` may be fractional mid-animation (rounded here). */
export const StatTile: React.FC<{
  label: string;
  value: number;
  delta?: number; // shown as a chip when non-zero
  highlight?: number; // 0–1
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ label, value, delta = 0, highlight = 0, icon, style }) => {
  const c = brand.colors;
  return (
    <div
      style={{
        position: "relative",
        background: c.card,
        borderRadius: brand.radii.lg,
        boxShadow: brand.shadows.card,
        border: `1px solid ${c.divider}`,
        padding: "26px 30px",
        ...style,
      }}
    >
      <HighlightRing p={highlight} radius={brand.radii.lg} inset={-6} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 23, fontWeight: 600, color: c.textMuted }}>
        {icon}
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 10 }}>
        <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: "-0.03em", color: c.text, fontVariantNumeric: "tabular-nums" }}>
          {Math.round(value)}
        </div>
        {delta !== 0 ? (
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: brand.radii.pill,
              background: c.accentTint,
              color: c.accentDark,
              opacity: highlight,
            }}
          >
            {delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`}
          </div>
        ) : null}
      </div>
    </div>
  );
};
