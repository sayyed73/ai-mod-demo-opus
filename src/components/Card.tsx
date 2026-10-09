import { brand } from "../config/brand";

/** White card with soft shadow. */
export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  float?: boolean;
}> = ({ children, style, float }) => (
  <div
    style={{
      background: brand.colors.card,
      borderRadius: brand.radii.lg,
      boxShadow: float ? brand.shadows.float : brand.shadows.card,
      border: `1px solid ${brand.colors.divider}`,
      ...style,
    }}
  >
    {children}
  </div>
);
