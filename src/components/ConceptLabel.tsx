import { brand } from "../config/brand";
import { content } from "../config/content";

/** Always-visible disclaimer pill (rendered once, above every scene). */
export const ConceptLabel: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 36,
      left: 44,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 16px",
      borderRadius: brand.radii.pill,
      background: "rgba(255,255,255,0.82)",
      border: `1px solid ${brand.colors.border}`,
      fontSize: 20,
      fontWeight: 600,
      color: brand.colors.textMuted,
      zIndex: 100,
    }}
  >
    <div
      style={{
        width: 9,
        height: 9,
        borderRadius: 9,
        background: brand.colors.accent,
      }}
    />
    {content.conceptLabel}
  </div>
);
