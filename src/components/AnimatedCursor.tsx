import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "../config/brand";
import { easeInOut, sec } from "../lib/timeline";

export type CursorPoint = { at: number; x: number; y: number }; // seconds in scene, px

/**
 * Mouse cursor that glides between waypoints and shows a click ripple.
 * `clicks` are seconds within the scene. The tip of the arrow is at (x, y).
 */
export const AnimatedCursor: React.FC<{
  path: CursorPoint[];
  clicks?: number[];
  size?: number;
  /** Seconds in scene when the cursor fades away. */
  hideAt?: number;
}> = ({ path, clicks = [], size = 44, hideAt }) => {
  const frame = useCurrentFrame();
  const frames = path.map((p) => sec(p.at));
  const opts = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
    easing: easeInOut,
  };
  const x = path.length > 1 ? interpolate(frame, frames, path.map((p) => p.x), opts) : path[0].x;
  const y = path.length > 1 ? interpolate(frame, frames, path.map((p) => p.y), opts) : path[0].y;
  const opacity =
    interpolate(frame, [frames[0] - 8, frames[0]], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    (hideAt === undefined
      ? 1
      : interpolate(frame, [sec(hideAt), sec(hideAt) + 9], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }));

  let press = 0;
  let ripple = -1;
  for (const c of clicks) {
    const d = frame - sec(c);
    if (d >= -3 && d <= 5) press = Math.max(press, 1 - Math.abs(d - 1) / 4);
    if (d >= 0 && d <= 18) ripple = d / 18;
  }

  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity, zIndex: 50, pointerEvents: "none" }}>
      {ripple >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: x - 40,
            top: y - 40,
            width: 80,
            height: 80,
            borderRadius: 80,
            border: `4px solid ${brand.colors.accent}`,
            scale: `${0.3 + ripple * 0.9}`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        style={{
          position: "absolute",
          left: x - 5,
          top: y - 3,
          scale: `${1 - press * 0.14}`,
          transformOrigin: "5px 3px",
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))",
        }}
      >
        <path
          d="M5 3 L5 25 L11 19.5 L15 28.5 L19 26.8 L15.2 18 L23 18 Z"
          fill={brand.colors.text}
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
