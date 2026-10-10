#!/usr/bin/env node
/**
 * Original ambient score for the alcohol explainer (no samples).
 * Dark A-minor drone and sparse soft piano notes; lifts to a warm major chord
 * at the "good news" moment. Deterministic. Output: public/explainer/alcohol/music.wav
 * Run: node scripts/generate-explainer-music.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "explainer", "alcohol");
const SR = 44100;
const SECONDS = 62;
const LIFT = 51; // seconds: "And the good news?"
const TAU = Math.PI * 2;
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

const out = new Float32Array(SECONDS * SR);

// pad chords: [startSec, notes]
const chords = [
  [0, [45, 52, 57, 60]], // Am
  [12, [41, 48, 53, 57]], // F
  [24, [43, 50, 55, 59]], // G (sus feel)
  [36, [45, 52, 57, 60]], // Am (stat)
  [44, [41, 48, 53, 60]], // Fadd9-ish
  [LIFT, [48, 55, 60, 64]], // C major — lift
  [56, [41, 48, 57, 64]], // Fmaj7 — resolve
];
const chordAt = (t) => {
  let idx = 0;
  for (let i = 0; i < chords.length; i++) if (t >= chords[i][0]) idx = i;
  return idx;
};

for (let i = 0; i < out.length; i++) {
  const t = i / SR;
  const idx = chordAt(t);
  const local = t - chords[idx][0];
  const xf = idx === 0 ? 1 : Math.min(1, local / 2.5);
  const voice = (notes) =>
    notes.reduce((s, n, k) => {
      const f = midi(n);
      const w = k === 0 ? 0.9 : 0.55;
      return s + w * (Math.sin(TAU * f * t) + 0.5 * Math.sin(TAU * f * 1.004 * t + k) + 0.08 * Math.sin(TAU * f * 2 * t));
    }, 0);
  const prev = chords[Math.max(0, idx - 1)][1];
  const breathe = 0.8 + 0.2 * Math.sin((TAU * t) / 9);
  out[i] += 0.03 * breathe * (xf * voice(chords[idx][1]) + (1 - xf) * voice(prev));
  // sub drone
  out[i] += 0.05 * Math.sin(TAU * midi(33) * t) * (t < LIFT ? 1 : 0.6);
}

// sparse soft piano-like notes
const notes = [
  [1.5, 69], [4.5, 72], [7.5, 76], [10.5, 72],
  [13.5, 69], [16.5, 72], [19.5, 77], [22.5, 74],
  [25.5, 71], [28.5, 74], [31.5, 79], [34.5, 74],
  [38.6, 69], [42.0, 72], [45.5, 77],
  [LIFT + 0.2, 72], [LIFT + 1.6, 76], [LIFT + 3.0, 79], [LIFT + 4.6, 84],
  [57.0, 76], [58.8, 72],
];
for (const [at, n] of notes) {
  const f = midi(n);
  for (let j = 0; j < 4 * SR; j++) {
    const i = Math.floor(at * SR) + j;
    if (i >= out.length) break;
    const tt = j / SR;
    const env = Math.min(1, tt / 0.006) * Math.exp(-tt / 1.1);
    out[i] += 0.07 * env * (Math.sin(TAU * f * tt) + 0.35 * Math.sin(TAU * f * 2 * tt) * Math.exp(-tt / 0.4) + 0.1 * Math.sin(TAU * f * 3 * tt) * Math.exp(-tt / 0.2));
  }
}

// soft low impact under the "2.6 million" stat
for (let j = 0; j < 3 * SR; j++) {
  const i = Math.floor(38.55 * SR) + j;
  const tt = j / SR;
  const f = 55 * Math.exp(-tt * 0.6);
  out[i] += 0.35 * Math.exp(-tt / 0.7) * Math.sin(TAU * f * tt);
}

// fades + normalise
let peak = 0;
for (let i = 0; i < out.length; i++) {
  const t = i / SR;
  out[i] *= Math.min(1, t / 2) * Math.min(1, (SECONDS - t) / 3);
  peak = Math.max(peak, Math.abs(out[i]));
}
const data = Buffer.alloc(out.length * 2);
out.forEach((s, i) => data.writeInt16LE(Math.round((s / peak) * 0.89 * 32767), i * 2));
const h = Buffer.alloc(44);
h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(SR, 24);
h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(data.length, 40);
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "music.wav"), Buffer.concat([h, data]));
console.log("wrote public/explainer/alcohol/music.wav");
