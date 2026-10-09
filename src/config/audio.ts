/**
 * Audio settings. All audio is optional: a missing file is skipped silently,
 * so rendering never breaks.
 *
 * Music + sound effects are synthesised by `npm run audio`
 * (scripts/generate-audio.mjs) — original, no third-party samples.
 * Sound-effect timings come from src/config/timing.ts (see src/lib/audioCues.ts).
 */
export const audio = {
  music: {
    enabled: true,
    file: "audio/music.wav",
    volume: 0.32,
    fadeInSec: 1,
    fadeOutSec: 2.5,
  },
  sfx: {
    enabled: true,
    files: {
      click: "audio/sfx-click.wav",
      pop: "audio/sfx-pop.wav",
      chime: "audio/sfx-chime.wav",
    },
    volume: { click: 0.7, pop: 0.45, chime: 0.5 },
  },
  voiceover: {
    /**
     * Narration plays automatically once public/audio/voiceover.mp3 exists.
     * Set `enabled: false` to mute it without deleting the file.
     */
    enabled: true,
    file: "audio/voiceover.mp3",
    volume: 1,
    /** Music volume multiplier while a voiceover is present. */
    musicDuck: 0.45,
  },
} as const;

export type SfxKind = keyof typeof audio.sfx.files;
