import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { scenes, type SceneId } from "../config/timing";
import { brand } from "../config/brand";
import { alpha } from "../lib/color";

/**
 * Scene background (warm ivory + soft accent glow). Optional short fade at
 * the start/end of the scene, inside the scene's own time (scenes never overlap).
 */
export const SceneFrame: React.FC<{
  scene: SceneId;
  children: React.ReactNode;
  fadeIn?: boolean;
  fadeOut?: boolean;
}> = ({ scene, children, fadeIn = true, fadeOut = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = scenes[scene];
  const fade = 8;
  const opacity =
    (fadeIn ? interpolate(frame, [0, fade], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1) *
    (fadeOut
      ? interpolate(frame, [durationInFrames - fade, durationInFrames - 1], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1);
  return (
    <AbsoluteFill
      style={{
        background: brand.colors.background,
        fontFamily: brand.fonts.stack,
        color: brand.colors.text,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 85% 12%, ${alpha(brand.colors.accent, 0.08)} 0, transparent 38%), radial-gradient(circle at 10% 90%, ${alpha(brand.colors.accent, 0.06)} 0, transparent 40%)`,
        }}
      />
      <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
