import { useCurrentFrame } from "remotion";
import { brand } from "../config/brand";
import { easeInOut, lerp, progress } from "../lib/timeline";

/**
 * Masked text reveal: each line slides up from behind a clip mask.
 * `text` may contain "\n" for line breaks. `at` is seconds within the scene.
 */
export const Headline: React.FC<{
  text: string;
  at: number;
  size?: number;
  weight?: number;
  color?: string;
  align?: "left" | "center";
  stagger?: number;
  lineHeight?: number;
  /** Optional exit time (seconds in scene): lines slide back up behind the mask. */
  outAt?: number;
}> = ({
  text,
  at,
  size = 72,
  weight = 800,
  color = brand.colors.text,
  align = "center",
  stagger = 0.12,
  lineHeight = 1.08,
  outAt,
}) => {
  const frame = useCurrentFrame();
  const lines = text.split("\n");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
      }}
    >
      {lines.map((line, i) => {
        const p = progress(frame, at + i * stagger, 0.8);
        const out = outAt === undefined ? 0 : progress(frame, outAt + i * 0.06, 0.4, easeInOut);
        return (
          <div
            key={i}
            style={{
              overflow: "hidden",
              // extra padding so descenders aren't clipped by the mask
              paddingBottom: size * 0.12,
              marginBottom: -size * 0.12,
            }}
          >
            <div
              style={{
                fontSize: size,
                fontWeight: weight,
                lineHeight,
                letterSpacing: "-0.03em",
                color,
                translate: `0 ${lerp(110, 0, p) - out * 110}%`,
                opacity: lerp(0.2, 1, p) * (1 - out),
                whiteSpace: "pre",
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};
