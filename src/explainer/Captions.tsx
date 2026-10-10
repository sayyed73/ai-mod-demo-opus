import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { explainer } from "./config";
import { words } from "./words";

type Group = { words: typeof words; start: number; end: number };

/** Split the narration into short caption groups (max 6 words, break on punctuation or pauses). */
const groups: Group[] = (() => {
  const out: Group[] = [];
  let cur: typeof words = [];
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const punct = /[.?!,—"]$/.test(w[0]);
    const pause = next ? next[1] - w[2] > 0.45 : true;
    if (cur.length >= 6 || punct || pause || !next) {
      out.push({ words: cur, start: cur[0][1], end: cur[cur.length - 1][2] });
      cur = [];
    }
  });
  return out;
})();

/** Word-by-word serif captions, centred over the lower part of the picture. */
export const Captions: React.FC<{ top: number }> = ({ top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const gi = groups.findIndex((g, i) => {
    const nextStart = groups[i + 1]?.start ?? Infinity;
    return t >= g.start - 0.05 && t < Math.min(g.end + 0.6, nextStart - 0.02);
  });
  if (gi < 0) return null;
  const g = groups[gi];
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 90,
        right: 90,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 16,
        rowGap: 4,
        fontFamily: explainer.captionFont,
        fontSize: 60,
        lineHeight: 1.25,
        color: explainer.colors.text,
        textShadow: "0 2px 12px rgba(0,0,0,0.85), 0 0 28px rgba(0,0,0,0.6)",
        textAlign: "center",
      }}
    >
      {g.words.map(([w, s], i) => {
        const p = interpolate(t, [s - 0.04, s + 0.14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{ opacity: p, translate: `0 ${(1 - p) * 10}px`, display: "inline-block" }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
