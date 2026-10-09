/**
 * Frame-driven animation helpers. Everything is a pure function of the frame —
 * no CSS transitions, timers or randomness.
 */
import { Easing, interpolate, spring } from "remotion";
import { sec } from "../config/timing";
import { video } from "../config/video";

export { sec };

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 between `startSec` and `startSec + durSec` (seconds within the scene). */
export const progress = (
  frame: number,
  startSec: number,
  durSec = 0.6,
  easing: (t: number) => number = easeOut,
) =>
  interpolate(frame, [sec(startSec), sec(startSec) + Math.max(1, sec(durSec))], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Restrained spring starting at `startSec`. Slight overshoot only. */
export const springAt = (
  frame: number,
  startSec: number,
  config: { damping?: number; stiffness?: number; mass?: number } = {},
) =>
  spring({
    frame: frame - sec(startSec),
    fps: video.fps,
    config: { damping: 18, stiffness: 140, mass: 0.9, ...config },
  });

/** Soft, critically-damped spring (no overshoot). */
export const smoothAt = (frame: number, startSec: number, durSec = 0.8) =>
  spring({
    frame: frame - sec(startSec),
    fps: video.fps,
    config: { damping: 200 },
    durationInFrames: sec(durSec),
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Is the frame at/after an event? */
export const after = (frame: number, atSec: number) => frame >= sec(atSec);

/** Gentle deterministic float (px) for idle panels. */
export const float = (frame: number, amp = 6, periodSec = 4, phase = 0) =>
  Math.sin(((frame / video.fps) * Math.PI * 2) / periodSec + phase) * amp;
