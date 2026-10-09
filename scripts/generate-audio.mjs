#!/usr/bin/env node
/**
 * Synthesises ORIGINAL audio for the demo — no samples, no third-party audio.
 *   public/audio/music.wav      60 s calm music bed (looped/faded in the video)
 *   public/audio/sfx-click.wav  cursor click
 *   public/audio/sfx-pop.wav    message pop
 *   public/audio/sfx-chime.wav  success chime
 *
 * Deterministic: the same output every run (seeded noise, no Math.random).
 * Sound-effect *timing* is not baked in here — the video places each effect
 * at frames derived from src/config/timing.ts (see src/lib/audioCues.ts).
 *
 * Run: npm run audio
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "audio");
const SR = 44100;

// ---------- helpers ----------
let seed = 1234567;
const noise = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 4294967296) * 2 - 1;
};
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);
const TAU = Math.PI * 2;

const writeWav = (file, samples) => {
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const gain = peak > 0 ? 0.89 / peak : 1;
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s * gain)) * 32767), i * 2));
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SR, 24);
  header.writeUInt32LE(SR * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  writeFileSync(join(OUT, file), Buffer.concat([header, data]));
  console.log(`  wrote public/audio/${file} (${(samples.length / SR).toFixed(2)} s)`);
};

// ---------- music ----------
const music = () => {
  const SECONDS = 60;
  const BPM = 96;
  const beat = 60 / BPM;
  const bar = beat * 4;
  const out = new Float32Array(SECONDS * SR);

  // ✏️ Chord progression (MIDI notes), 2 bars each, looping. Cmaj7 – Am7 – Fmaj7 – G6.
  const chords = [
    { root: 48, notes: [60, 64, 67, 71] },
    { root: 45, notes: [57, 60, 64, 67] },
    { root: 41, notes: [57, 60, 65, 69] },
    { root: 43, notes: [59, 62, 67, 69] },
  ];
  const chordLen = bar * 2;
  const chordAt = (t) => chords[Math.floor(t / chordLen) % chords.length];
  const endHold = SECONDS - 4; // last 4 s: sustained final chord, no arp

  // pad: two detuned sines per note, slow crossfade between chords
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    const tc = Math.min(t, endHold);
    const idx = Math.floor(tc / chordLen);
    const local = tc - idx * chordLen;
    const cur = chords[idx % chords.length];
    const prev = chords[(idx + chords.length - 1) % chords.length];
    const xf = idx === 0 ? 1 : Math.min(1, local / 1.2);
    const voice = (notes) =>
      notes.reduce((s, n) => {
        const f = midi(n);
        return s + Math.sin(TAU * f * t) + 0.6 * Math.sin(TAU * f * 1.003 * t + 1.1) + 0.12 * Math.sin(TAU * f * 2 * t);
      }, 0);
    const swell = 0.85 + 0.15 * Math.sin(TAU * t / chordLen);
    out[i] += 0.035 * swell * (xf * voice(cur.notes) + (1 - xf) * voice(prev.notes));
  }

  // bass: soft root on beats 1 and 3
  for (let b = 0; b * beat * 2 < endHold + 2; b++) {
    const start = b * beat * 2;
    const f = midi(chordAt(Math.min(start, endHold)).root);
    const len = beat * 2;
    for (let j = 0; j < len * SR; j++) {
      const i = Math.floor(start * SR) + j;
      if (i >= out.length) break;
      const tt = j / SR;
      const env = Math.min(1, tt / 0.02) * Math.exp(-tt / 0.7);
      out[i] += 0.16 * env * (Math.sin(TAU * f * tt) + 0.25 * Math.sin(TAU * f * 2 * tt));
    }
  }

  // arpeggio pluck: eighth notes, from bar 2, with a soft echo
  const eighth = beat / 2;
  const pattern = [0, 1, 2, 3, 2, 1, 3, 2];
  for (let k = 0; k * eighth < endHold; k++) {
    const start = k * eighth;
    if (start < bar * 2) continue;
    const ch = chordAt(start);
    const n = ch.notes[pattern[k % pattern.length]] + 12;
    const f = midi(n);
    const vel = k % 2 === 0 ? 1 : 0.7;
    for (const [delay, g] of [[0, 1], [eighth * 3, 0.28], [eighth * 6, 0.1]]) {
      for (let j = 0; j < 0.9 * SR; j++) {
        const i = Math.floor((start + delay) * SR) + j;
        if (i >= out.length) break;
        const tt = j / SR;
        const env = Math.min(1, tt / 0.004) * Math.exp(-tt / 0.22);
        out[i] += 0.05 * vel * g * env * (Math.sin(TAU * f * tt) + 0.2 * Math.sin(TAU * f * 3 * tt) * Math.exp(-tt / 0.05));
      }
    }
  }

  // very soft shaker on off-beats from bar 4
  for (let k = 0; k * beat < endHold; k++) {
    const start = k * beat + beat / 2;
    if (start < bar * 4) continue;
    let lp = 0;
    for (let j = 0; j < 0.08 * SR; j++) {
      const i = Math.floor(start * SR) + j;
      if (i >= out.length) break;
      const nz = noise();
      lp += 0.5 * (nz - lp);
      out[i] += 0.012 * (nz - lp) * Math.exp(-(j / SR) / 0.02);
    }
  }

  // gentle global fade in/out (the video also fades)
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    out[i] *= Math.min(1, t / 1.5) * Math.min(1, (SECONDS - t) / 3);
  }
  return out;
};

// ---------- sfx ----------
const click = () => {
  const out = new Float32Array(Math.floor(0.08 * SR));
  let prev = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    const nz = noise();
    const hp = nz - prev;
    prev = nz;
    out[i] = 0.5 * hp * Math.exp(-t / 0.003) + 0.6 * Math.sin(TAU * 1900 * t) * Math.exp(-t / 0.012) + 0.4 * Math.sin(TAU * 900 * t) * Math.exp(-t / 0.02);
  }
  return out;
};

const pop = () => {
  const out = new Float32Array(Math.floor(0.2 * SR));
  let phase = 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    const f = 480 + 520 * Math.min(1, t / 0.05);
    phase += (TAU * f) / SR;
    const env = Math.min(1, t / 0.003) * Math.exp(-t / 0.05);
    out[i] = env * (Math.sin(phase) + 0.15 * Math.sin(2 * phase));
  }
  return out;
};

const chime = () => {
  const out = new Float32Array(Math.floor(1.5 * SR));
  const notes = [
    { f: midi(88), at: 0 }, // E6
    { f: midi(95), at: 0.09 }, // B6
  ];
  for (const n of notes) {
    for (let j = 0; j < out.length; j++) {
      const i = j + Math.floor(n.at * SR);
      if (i >= out.length) break;
      const t = j / SR;
      const env = Math.min(1, t / 0.004) * Math.exp(-t / 0.45);
      out[i] += 0.5 * env * (Math.sin(TAU * n.f * t) + 0.3 * Math.sin(TAU * n.f * 2.01 * t) * Math.exp(-t / 0.2) + 0.08 * Math.sin(TAU * n.f * 3 * t));
    }
  }
  return out;
};

mkdirSync(OUT, { recursive: true });
console.log("Generating original audio…");
writeWav("music.wav", music());
writeWav("sfx-click.wav", click());
writeWav("sfx-pop.wav", pop());
writeWav("sfx-chime.wav", chime());
console.log("Done.");
