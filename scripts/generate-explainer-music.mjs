#!/usr/bin/env node
/**
 * Original cinematic score for the alcohol explainer (synthesised, no samples).
 * Stereo, with a Freeverb-style reverb. Deterministic.
 * Output: public/explainer/alcohol/music.wav   Run: npm run music:alcohol
 *
 * Arc (seconds, matched to the narration — ✏️ edit CUES to re-time):
 *   intro      solo felt-piano motif
 *   science    soft strings + slow heartbeat
 *   tension    ticking pulse, rising strings, dissonance, riser
 *   everyday   pull back, motif returns
 *   stat       near-silence → riser → IMPACT → climax (drums + full strings)
 *   chemistry  drop to a single piano
 *   hope       key change to major, new melody, final swell, long resolve
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "explainer", "alcohol");
const SR = 44100;
const DUR = 63;
const N = DUR * SR;
const TAU = Math.PI * 2;
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

export const CUES = {
  science: 7.1,
  tension: 17.3,
  everyday: 28.3,
  statLead: 36.1,
  impact: 38.6,
  chemistry: 48.2,
  hope: 50.9,
  swell: 54.4,
  end: 61.5,
};
const C = CUES;

const L = new Float32Array(N);
const R = new Float32Array(N);
const add = (i, v, pan = 0) => {
  if (i < 0 || i >= N) return;
  L[i] += v * (1 - pan) * 0.5;
  R[i] += v * (1 + pan) * 0.5;
};

let seed = 4242;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

// ---------- instruments ----------
/** Felt piano: inharmonic partials with per-partial decay, soft hammer. */
function piano(at, note, vel = 1, pan = 0, len = 5) {
  const f0 = midi(note);
  const start = Math.floor(at * SR);
  const n = Math.floor(len * SR);
  for (let j = 0; j < n; j++) {
    const t = j / SR;
    let s = 0;
    for (let k = 1; k <= 6; k++) {
      const fk = f0 * k * Math.sqrt(1 + 0.0004 * k * k);
      s += (1 / Math.pow(k, 1.4)) * Math.exp(-t * (0.9 + 0.55 * k)) * Math.sin(TAU * fk * t);
    }
    const env = Math.min(1, t / 0.008);
    const hammer = j < 300 ? rnd() * 0.15 * (1 - j / 300) : 0;
    add(start + j, 0.11 * vel * (env * s + hammer), pan);
  }
}

/** String ensemble: detuned band-limited saws through a soft low-pass, slow attack/release. */
function strings(t0, t1, notes, level, bright = 0.5, attack = 1.6, release = 2.2) {
  const a = Math.floor(t0 * SR), b = Math.floor((t1 + release) * SR);
  const voices = [];
  notes.forEach((n, ni) => {
    for (const d of [-0.006, -0.002, 0.003, 0.007]) voices.push({ f: midi(n) * (1 + d), ph: Math.abs(rnd()), pan: ((ni % 2 ? 1 : -1) * 0.4) + d * 30 });
  });
  const harm = 9;
  let lp = 0, lpR = 0;
  for (let i = a; i < b && i < N; i++) {
    const t = (i - a) / SR;
    const env = Math.min(1, t / attack) * (i / SR > t1 ? Math.max(0, 1 - (i / SR - t1) / release) : 1);
    if (env <= 0) continue;
    let sl = 0, sr = 0;
    for (const v of voices) {
      v.ph += v.f / SR;
      let s = 0;
      for (let k = 1; k <= harm; k++) s += Math.sin(TAU * k * v.ph) / k;
      sl += s * (1 - v.pan) * 0.5;
      sr += s * (1 + v.pan) * 0.5;
    }
    const cut = 0.04 + bright * 0.12;
    lp += cut * (sl - lp);
    lpR += cut * (sr - lpR);
    const g = (level * env * 0.035) / Math.sqrt(voices.length);
    L[i] += lp * g;
    R[i] += lpR * g;
  }
}

/** Sub drone. */
function drone(t0, t1, note, level) {
  const f = midi(note);
  for (let i = Math.floor(t0 * SR); i < Math.floor(t1 * SR) && i < N; i++) {
    const t = i / SR;
    const env = Math.min(1, (t - t0) / 2) * Math.min(1, (t1 - t) / 2);
    const v = level * env * (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * f * 2 * t));
    L[i] += v * 0.5;
    R[i] += v * 0.5;
  }
}

/** Heartbeat "lub-dub". */
function heartbeat(at, level) {
  for (const [off, g] of [[0, 1], [0.22, 0.7]]) {
    const s = Math.floor((at + off) * SR);
    for (let j = 0; j < 0.35 * SR; j++) {
      const t = j / SR;
      const f = 48 + 30 * Math.exp(-t * 25);
      const v = level * g * Math.exp(-t / 0.09) * Math.sin(TAU * f * t);
      add(s + j, v, 0);
    }
  }
}

/** Soft tick (filtered noise click). */
function tick(at, level, pan) {
  const s = Math.floor(at * SR);
  let hp = 0, prev = 0;
  for (let j = 0; j < 0.05 * SR; j++) {
    const x = rnd();
    hp = 0.9 * (hp + x - prev);
    prev = x;
    add(s + j, level * hp * Math.exp(-j / SR / 0.008), pan);
  }
}

/** Big low drum (taiko-ish). */
function drum(at, level, pitch = 62) {
  const s = Math.floor(at * SR);
  for (let j = 0; j < 1.2 * SR; j++) {
    const t = j / SR;
    const f = pitch * (1 + 1.2 * Math.exp(-t * 18));
    const body = Math.exp(-t / 0.35) * Math.sin(TAU * f * t);
    const skin = j < 0.03 * SR ? rnd() * Math.exp(-t / 0.01) * 0.5 : 0;
    add(s + j, level * (body + skin), 0);
  }
}

/** Cinematic impact: sub boom + noise burst. */
function impact(at, level) {
  const s = Math.floor(at * SR);
  let lp = 0;
  for (let j = 0; j < 4 * SR; j++) {
    const t = j / SR;
    const f = 42 + 60 * Math.exp(-t * 6);
    lp += 0.08 * (rnd() - lp);
    const v = level * (Math.exp(-t / 1.4) * Math.sin(TAU * f * t) * 1.2 + lp * Math.exp(-t / 0.5) * 2.2);
    add(s + j, v, 0);
  }
}

/** Riser: noise swelling with a rising band, plus a rising tone. */
function riser(t0, t1, level) {
  const a = Math.floor(t0 * SR), b = Math.floor(t1 * SR);
  let bp1 = 0, bp2 = 0, ph = 0;
  for (let i = a; i < b; i++) {
    const p = (i - a) / (b - a);
    const fc = 300 + 5000 * p * p;
    const w = Math.min(0.99, (TAU * fc) / SR);
    const x = rnd();
    bp1 += w * (x - bp1 - 0.4 * bp2);
    bp2 += w * bp1;
    ph += (200 + 600 * p * p) / SR;
    const v = level * p * p * (bp1 * 0.8 + 0.25 * Math.sin(TAU * ph));
    add(i, v, Math.sin(p * 9) * 0.3);
  }
}

// ---------- score ----------
// Motif (A minor): A4 C5 E5 D5 | C5 B4 A4
const motif = [[0, 69], [0.75, 72], [1.5, 76], [2.25, 74], [3.0, 72], [3.75, 71], [4.5, 69]];
const playMotif = (at, vel, octave = 0, pan = 0) => motif.forEach(([dt, n]) => piano(at + dt, n + octave, vel, pan));

// intro: solo piano
playMotif(0.4, 1.0, 0, -0.1);
piano(0.4, 45, 0.6); piano(0.4, 52, 0.4);
drone(0, C.statLead, 33, 0.035);

// science: strings + heartbeat
strings(C.science, C.tension, [57, 60, 64], 0.9, 0.35);
for (let t = C.science + 0.3; t < C.tension; t += 1.0) heartbeat(t, 0.32);
playMotif(C.science + 3.2, 0.55, 0, 0.2);

// tension: ticks, rising strings, dissonance
strings(C.tension, C.tension + 5.5, [53, 57, 60, 61], 1.1, 0.5); // F with a b9 rub
strings(C.tension + 5.5, C.everyday - 0.3, [53, 57, 60, 61, 65], 1.6, 0.7, 2.5); // rising
for (let t = C.tension; t < C.everyday - 0.6; t += 0.3) tick(t, 0.12 + 0.12 * ((t - C.tension) / 11), (Math.floor(t / 0.3) % 2 ? 0.4 : -0.4));
for (let t = C.tension + 0.2; t < C.everyday; t += 0.85) heartbeat(t, 0.36);
riser(C.everyday - 3.2, C.everyday, 0.16);

// everyday: pull back, motif returns
strings(C.everyday, C.statLead - 0.8, [52, 57, 60], 0.7, 0.3);
playMotif(C.everyday + 0.3, 0.7, 0, -0.2);
piano(C.everyday + 0.3, 45, 0.5);
playMotif(C.everyday + 4.3, 0.5, 12, 0.3);

// stat: near-silence → riser → impact → climax
riser(C.statLead + 0.2, C.impact, 0.3);
impact(C.impact, 0.3);
drone(C.impact, C.chemistry, 33, 0.06);
strings(C.impact, C.chemistry - 0.4, [45, 52, 57, 60, 64, 69], 1.5, 0.7, 0.25, 1.4);
for (let k = 0, t = C.impact; t < C.chemistry - 0.5; k++, t += 0.6) drum(t, k % 4 === 0 ? 0.26 : 0.15, k % 4 === 0 ? 55 : 70);
[[C.impact + 0.05, 81], [C.impact + 1.2, 79], [C.impact + 2.4, 76], [C.impact + 3.6, 77], [C.impact + 4.8, 76], [C.impact + 6.0, 74], [C.impact + 7.2, 72]].forEach(([t, n]) => piano(t, n, 0.9, 0.15));

// chemistry: a single piano
piano(C.chemistry + 0.1, 69, 0.8); piano(C.chemistry + 0.1, 57, 0.5); piano(C.chemistry + 1.4, 64, 0.6);

// hope: key change to C major, new melody, final swell, resolve
strings(C.hope, C.swell, [48, 55, 60, 64], 1.3, 0.5);
strings(C.swell, C.end - 0.5, [41, 53, 57, 60, 65, 69, 72], 4.2, 0.85, 2.5, 3.0); // F major swell
for (let k = 0, t = C.swell + 1.2; t < C.end - 2; k++, t += 1.2) drum(t, k % 2 ? 0.08 : 0.14, 52);
drone(C.hope, C.end + 1, 36, 0.04);
const hopeMelody = [[0.3, 72], [1.0, 74], [1.7, 76], [2.6, 79], [3.6, 76], [4.4, 81], [5.4, 79], [6.4, 77], [7.2, 76], [8.4, 74], [9.6, 72]];
hopeMelody.forEach(([dt, n]) => piano(C.hope + dt, n, 0.85, 0.1));
piano(C.hope + 0.3, 48, 0.6); piano(C.swell, 53, 0.6); piano(C.end - 1.6, 48, 0.5); piano(C.end - 1.6, 60, 0.4); piano(C.end - 1.6, 64, 0.4);
riser(C.swell - 1.6, C.swell, 0.1);

// ---------- reverb (Freeverb-style) ----------
function freeverb(x, spread) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((n) => ({ buf: new Float32Array(n + spread), i: 0, f: 0 }));
  const aps = [556, 441, 341, 225].map((n) => ({ buf: new Float32Array(n + spread), i: 0 }));
  const out = new Float32Array(x.length);
  const fb = 0.86, damp = 0.25;
  for (let n = 0; n < x.length; n++) {
    const inp = x[n] * 0.015;
    let s = 0;
    for (const c of combs) {
      const y = c.buf[c.i];
      c.f = y * (1 - damp) + c.f * damp;
      c.buf[c.i] = inp + c.f * fb;
      c.i = (c.i + 1) % c.buf.length;
      s += y;
    }
    for (const a of aps) {
      const y = a.buf[a.i];
      a.buf[a.i] = s + y * 0.5;
      a.i = (a.i + 1) % a.buf.length;
      s = y - s;
    }
    out[n] = s;
  }
  return out;
}
const wetL = freeverb(L, 0), wetR = freeverb(R, 23);

// ---------- mix, master ----------
let peak = 0;
const mix = new Float32Array(N * 2);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(1, t / 0.5) * Math.min(1, Math.max(0, (DUR - t) / 2.5));
  const l = (L[i] * 0.75 + wetL[i] * 1.0) * fade;
  const r = (R[i] * 0.75 + wetR[i] * 1.0) * fade;
  mix[2 * i] = Math.tanh(l * 3.2);
  mix[2 * i + 1] = Math.tanh(r * 3.2);
  peak = Math.max(peak, Math.abs(mix[2 * i]), Math.abs(mix[2 * i + 1]));
}
const data = Buffer.alloc(mix.length * 2);
for (let i = 0; i < mix.length; i++) data.writeInt16LE(Math.round((mix[i] / peak) * 0.89 * 32767), i * 2);
const h = Buffer.alloc(44);
h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(data.length, 40);
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "music.wav"), Buffer.concat([h, data]));
console.log("wrote public/explainer/alcohol/music.wav (" + DUR + " s, stereo)");
