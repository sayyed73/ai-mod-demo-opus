/**
 * "Why is it so hard to put the glass down?" — 9:16 narrated explainer.
 * ✏️ Shot timing, framing and on-screen text live here.
 * Clips: public/explainer/alcohol/clips/NN.mp4 (Higgsfield, Kling 3.0 Pro, 5 s, 1920×1080).
 */
export const explainer = {
  id: "AlcoholExplainer",
  width: 1080,
  height: 1920,
  fps: 30,
  /** Seconds. Narration is 60.24 s; the last shot holds and fades out. */
  durationSec: 61.5,
  narration: "explainer/alcohol/narration.mp3",
  music: "explainer/alcohol/music.wav",
  musicVolume: 0.24,
  /** Picture window inside the 9:16 frame (black above and below, like the reference). */
  picture: { width: 1080, height: 960 },
  crossfadeSec: 0.35,
  colors: { gold: "#E8C27A", text: "#F4EFE6" },
  captionFont: "Libre Baskerville, Georgia, serif",
} as const;

export type Shot = {
  clip: string; // file in public/
  start: number; // seconds, when the shot begins
  /** Horizontal focus 0–100 (%) for the crop to the picture window. */
  focusX?: number;
  /** Extra zoom (1 = none). Used to crop an artefact out of shot 4. */
  zoom?: number;
};

const c = (n: string) => `explainer/alcohol/clips/${n}.mp4`;

/** Shot list, aligned to the narration phrases. Each shot runs until the next starts. */
export const shots: Shot[] = [
  { clip: c("01"), start: 0 }, // Why is it so hard to put the glass down?
  { clip: c("02"), start: 3.15 }, // It feels like just a drink. But here's the thing —
  { clip: c("03"), start: 7.1, focusX: 42 }, // alcohol doesn't just relax you… dopamine in your brain
  { clip: c("04"), start: 12.0, zoom: 1.08 }, // and quiets the signals that keep you alert.
  { clip: c("05"), start: 15.1, focusX: 30 }, // That's the calm you feel.
  { clip: c("06"), start: 17.3 }, // But your brain fights back. It adapts — so next time,
  { clip: c("07"), start: 21.2, focusX: 38 }, // you need a little more to feel the same.
  { clip: c("08"), start: 23.5, focusX: 75 }, // That's tolerance… dependence quietly begins.
  { clip: c("09"), start: 28.3, focusX: 45 }, // Most people never notice. It's at every celebration,
  { clip: c("10"), start: 32.4, focusX: 42 }, // every bad day, every "just one more."
  { clip: c("11"), start: 36.1 }, // Today… 2.6 million deaths every year.
  { clip: c("12"), start: 41.9 }, // …no level of drinking that's completely safe for your health.
  { clip: c("13"), start: 48.2, focusX: 40 }, // It's not weakness. It's chemistry.
  { clip: c("14"), start: 50.9, focusX: 52 }, // And the good news? Your brain can heal.
  { clip: c("15"), start: 54.4, focusX: 45 }, // If you're cutting back… talk to a doctor first —
  { clip: c("16"), start: 58.5 }, // it's the safest way to start.
];

/** Big on-screen stat (drawn as real text, so it's always sharp). */
export const stat = {
  at: 38.6,
  until: 41.8,
  value: "2.6 million",
  label: "alcohol-related deaths every year",
};

/** Small source note at the end. */
export const sourceNote = {
  at: 56.0,
  text: "Sources: WHO Global status report on alcohol (2024); WHO Europe statement (2023)",
};
