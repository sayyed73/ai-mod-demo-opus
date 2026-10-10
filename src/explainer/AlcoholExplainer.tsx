import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  getStaticFiles,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Captions } from "./Captions";
import { explainer, shots, sourceNote, stat } from "./config";
import { words } from "./words";

const CLIP_SEC = 5.0; // usable length of each generated clip

const hasFile = (p: string) => getStaticFiles().some((f) => f.name === p);

/**
 * Per-frame music gain: dips while Helena speaks, swells back in the pauses
 * (smoothed so it breathes rather than pumps).
 */
const musicGain: number[] = (() => {
  const fps = explainer.fps;
  const n = Math.round(explainer.durationSec * fps);
  const target = Array.from({ length: n }, (_, f) => {
    const t = f / fps;
    const speaking = words.some(([, s, e]) => t >= s - 0.15 && t <= e + 0.2);
    return speaking ? explainer.musicDuck : 1;
  });
  const out: number[] = [];
  let g = 1;
  for (let f = 0; f < n; f++) {
    const k = target[f] < g ? 0.25 : 0.06; // fast dip, slow swell
    g += (target[f] - g) * k;
    out.push(g);
  }
  return out;
})();

/** One shot: cropped into the picture window, slow push-in, crossfades in. */
const Shot: React.FC<{ i: number; slotSec: number }> = ({ i, slotSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = shots[i];
  const fade = explainer.crossfadeSec * fps;
  const total = (slotSec + explainer.crossfadeSec) * fps;
  // Stretch clips slightly when the narration needs a longer shot.
  const rate = Math.min(1, CLIP_SEC / (slotSec + explainer.crossfadeSec));
  const pic = explainer.picture;
  const videoWidth = Math.round((pic.height * 16) / 9); // clips are 16:9
  return (
    <AbsoluteFill
      style={{
        opacity: i === 0 ? 1 : interpolate(frame, [0, fade], [0, 1], { extrapolateRight: "clamp" }),
        overflow: "hidden",
      }}
    >
      <Video
        src={staticFile(s.clip)}
        muted
        playbackRate={rate}
        style={{
          // "cover" crop done by hand: fill the window height, shift by focusX.
          position: "absolute",
          top: 0,
          height: pic.height,
          width: videoWidth,
          left: -(videoWidth - pic.width) * ((s.focusX ?? 50) / 100),
          scale: `${(s.zoom ?? 1) * interpolate(frame, [0, total], [1, 1.04])}`,
        }}
      />
    </AbsoluteFill>
  );
};

export const AlcoholExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pic = explainer.picture;
  const picTop = (explainer.height - pic.height) / 2;
  const end = explainer.durationSec;
  const t = frame / fps;

  const statP = interpolate(t, [stat.at, stat.at + 0.5, stat.until - 0.4, stat.until], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outro = interpolate(frame, [durationInFrames - 0.9 * fps, durationInFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* picture window */}
      <div
        style={{
          position: "absolute",
          top: picTop,
          left: 0,
          width: pic.width,
          height: pic.height,
          overflow: "hidden",
          opacity: outro,
        }}
      >
        {shots.map((s, i) => {
          const next = shots[i + 1]?.start ?? end;
          const slot = next - s.start;
          const from = Math.round((i === 0 ? 0 : s.start - explainer.crossfadeSec) * fps);
          const dur = Math.round((next - s.start + (i === 0 ? 0 : explainer.crossfadeSec)) * fps) + 2;
          return (
            <Sequence key={i} from={from} durationInFrames={dur} name={`shot-${i + 1}`}>
              <Shot i={i} slotSec={slot} />
            </Sequence>
          );
        })}
        {/* vignette + soft edges into black */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%), linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 12%, transparent 80%, rgba(0,0,0,0.65) 100%)",
          }}
        />
        {/* stat */}
        <div
          style={{
            position: "absolute",
            top: 170,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: statP,
            translate: `0 ${(1 - statP) * 14}px`,
            fontFamily: explainer.captionFont,
            color: explainer.colors.gold,
            textShadow: "0 2px 18px rgba(0,0,0,0.9)",
          }}
        >
          <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: "-0.01em" }}>{stat.value}</div>
          <div style={{ fontSize: 34, color: explainer.colors.text, marginTop: 6 }}>{stat.label}</div>
        </div>
      </div>

      <Captions top={picTop + pic.height - 330} />

      {/* source note */}
      <div
        style={{
          position: "absolute",
          top: picTop + pic.height + 40,
          left: 90,
          right: 90,
          textAlign: "center",
          fontFamily: explainer.captionFont,
          fontSize: 24,
          color: "rgba(244,239,230,0.6)",
          opacity: interpolate(t, [sourceNote.at, sourceNote.at + 0.8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) * outro,
        }}
      >
        {sourceNote.text}
      </div>

      {hasFile(explainer.narration) ? <Audio src={staticFile(explainer.narration)} volume={0.88} /> : null}
      {hasFile(explainer.music) ? (
        <Audio
          src={staticFile(explainer.music)}
          volume={(f) =>
            explainer.musicVolume *
            (musicGain[f] ?? 1) *
            interpolate(f, [0, 0.3 * fps, durationInFrames - 1.5 * fps, durationInFrames - 1], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
