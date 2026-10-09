import { interpolate, useCurrentFrame } from "remotion";
import { brand, type ChannelId } from "../config/brand";
import { content } from "../config/content";
import { events } from "../config/timing";
import { conversations, problemCardIds } from "../data/demo";
import { Headline } from "../components/Headline";
import { MessageCard } from "../components/MessageCard";
import { SceneFrame } from "../components/SceneFrame";
import { layout } from "../lib/layout";
import { float, progress, sec, springAt } from "../lib/timeline";

const e = events.problem;

/** Small "new message" pings that pile up (positions are decorative). */
const pings: { x: number; y: number; channel: ChannelId }[] = [
  { x: 690, y: 460, channel: "whatsapp" },
  { x: 700, y: 1150, channel: "instagram" },
  { x: 70, y: 1170, channel: "messenger" },
  { x: 640, y: 905, channel: "messenger" },
  { x: 380, y: 1225, channel: "whatsapp" },
  { x: 80, y: 690, channel: "instagram" },
  { x: 760, y: 560, channel: "instagram" },
  { x: 720, y: 1240, channel: "whatsapp" },
];
const PING_GAP = 0.32; // seconds between pings

/** Scene 1 — "Great products. Too many messages." */
export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cards = problemCardIds.map((id) => conversations.find((c) => c.id === id)!);
  const pingsShown = pings.filter((_, i) => frame >= sec(e.notifications + i * PING_GAP)).length;
  const cardsShown = e.cards.filter((s) => frame >= sec(s)).length;
  const unread = cardsShown + pingsShown;
  const exitP = progress(frame, e.exit, 0.45); // clears the stage for scene 2
  const counterP = progress(frame, e.cards[0], 0.5) * (1 - exitP);

  return (
    <SceneFrame scene="problem" fadeIn={false} fadeOut={false}>
      <div style={{ position: "absolute", top: layout.headlineTop, left: 0, right: 0 }}>
        <Headline text={content.problem.headline} at={e.headline} size={78} outAt={e.exit} />
      </div>

      {/* unread counter reacts to every new message */}
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: counterP,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 22px",
            borderRadius: brand.radii.pill,
            background: brand.colors.card,
            boxShadow: brand.shadows.soft,
            fontSize: 24,
            fontWeight: 600,
            color: brand.colors.textMuted,
          }}
        >
          <div
            style={{
              minWidth: 40,
              height: 40,
              padding: "0 10px",
              borderRadius: 40,
              background: brand.colors.warning,
              color: "white",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontVariantNumeric: "tabular-nums",
              scale: `${1 + 0.18 * Math.max(0, 1 - (frame - lastEventFrame(frame)) / 6)}`,
            }}
          >
            {unread}
          </div>
          {content.problem.unreadLabel}
        </div>
      </div>

      {/* pings */}
      {pings.map((p, i) => {
        const s = springAt(frame, e.notifications + i * PING_GAP);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: brand.radii.pill,
              background: brand.colors.card,
              boxShadow: brand.shadows.soft,
              fontSize: 21,
              fontWeight: 600,
              color: brand.colors.textMuted,
              opacity: Math.min(1, s) * 0.9 * (1 - exitP),
              scale: `${0.6 + 0.4 * s}`,
              translate: `0 ${float(frame, 4, 3.4, i)}px`,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 12, background: brand.channelColors[p.channel] }} />
            {content.problem.pingLabel}
          </div>
        );
      })}

      {/* the three customer messages */}
      {cards.map((c, i) => {
        const pos = layout.problemCards[i];
        const s = springAt(frame, e.cards[i]);
        return (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              rotate: `${pos.rotate}deg`,
              opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
              scale: `${0.7 + 0.3 * s}`,
              translate: `0 ${(1 - s) * 60 + float(frame, 5, 4.2, i * 1.7)}px`,
              zIndex: 10 + i,
            }}
          >
            <MessageCard conversation={c} width={pos.width} />
          </div>
        );
      })}
    </SceneFrame>
  );
};

/** Frame of the latest card/ping arrival (drives the counter "bump"). */
const lastEventFrame = (frame: number) => {
  const all = [...e.cards.map(sec), ...pings.map((_, i) => sec(e.notifications + i * PING_GAP))];
  return Math.max(-100, ...all.filter((f) => f <= frame));
};
