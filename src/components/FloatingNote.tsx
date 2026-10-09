import { brand } from "../config/brand";

/** Small floating "system" panel (inventory check, order draft…). */
export const FloatingNote: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  highlight?: number; // 0–1 accent outline strength
  style?: React.CSSProperties;
}> = ({ icon, title, children, highlight = 0, style }) => (
  <div
    style={{
      background: brand.colors.card,
      borderRadius: brand.radii.lg,
      boxShadow: `${brand.shadows.float}, 0 0 0 ${3 * highlight}px ${brand.colors.accentRing}`,
      border: `1px solid ${brand.colors.divider}`,
      padding: "22px 26px",
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: brand.colors.accentTint,
          color: brand.colors.accentDark,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 21,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: brand.colors.textMuted,
        }}
      >
        {title}
      </div>
    </div>
    {children}
  </div>
);
