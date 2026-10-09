import { brand } from "../config/brand";

/** Generic phone frame (original drawing, no real device branding). */
export const PhoneMockup: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, height, children, style }) => {
  const bezel = Math.round(width * 0.035);
  const outerR = width * 0.13;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: outerR,
        background: "#1D2422",
        padding: bezel,
        boxShadow: brand.shadows.float,
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: outerR - bezel,
          background: brand.colors.surface,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* status bar */}
        <div
          style={{
            height: width * 0.1,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${width * 0.08}px`,
            fontSize: Math.max(18, width * 0.04),
            fontWeight: 600,
            color: brand.colors.text,
          }}
        >
          <span>9:41</span>
          <div
            style={{
              width: width * 0.26,
              height: width * 0.06,
              borderRadius: 99,
              background: "#1D2422",
            }}
          />
          <div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
            {[0.4, 0.6, 0.8, 1].map((h, i) => (
              <div
                key={i}
                style={{
                  width: width * 0.011,
                  height: width * 0.032 * h,
                  borderRadius: 2,
                  background: brand.colors.text,
                }}
              />
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
