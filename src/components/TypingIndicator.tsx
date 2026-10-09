import { useCurrentFrame } from "remotion";
import { brand } from "../config/brand";
import { video } from "../config/video";

/** Three bouncing dots, frame-driven. */
export const TypingIndicator: React.FC<{ size?: number }> = ({ size = 12 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: size * 0.6, alignItems: "center", height: size * 2 }}>
      {[0, 1, 2].map((i) => {
        const t = ((frame / video.fps) * 2.4 - i * 0.22) * Math.PI;
        const lift = Math.max(0, Math.sin(t));
        return (
          <div
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: size,
              background: brand.colors.textSubtle,
              translate: `0 ${-lift * size * 0.55}px`,
              opacity: 0.45 + lift * 0.55,
            }}
          />
        );
      })}
    </div>
  );
};
