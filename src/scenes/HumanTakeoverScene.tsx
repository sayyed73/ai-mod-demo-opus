import { useCurrentFrame } from "remotion";
import { brand } from "../config/brand";
import { content } from "../config/content";
import { events } from "../config/timing";
import { conversations, takeoverContext, takeoverConversationId, takeoverMessage } from "../data/demo";
import { AnimatedCursor } from "../components/AnimatedCursor";
import { Avatar } from "../components/Avatar";
import { Button, pressAmount } from "../components/Button";
import { ChannelBadge } from "../components/ChannelBadge";
import { ChatBubble } from "../components/ChatBubble";
import { Expand } from "../components/Expand";
import { Headline } from "../components/Headline";
import { AlertIcon, PauseIcon, PersonIcon, SparkIcon } from "../components/Icons";
import { SceneFrame } from "../components/SceneFrame";
import { StatusBadge } from "../components/StatusBadge";
import { video } from "../config/video";
import { alpha } from "../lib/color";
import { layout } from "../lib/layout";
import { after, lerp, progress, sec, smoothAt, springAt } from "../lib/timeline";

const e = events.humanTakeover;
const t = content.humanTakeover;

// ✏️ Panel position; the cursor target is relative to it.
const PANEL = { x: 70, y: 400, width: 940, height: 800 };
const TAKE_OVER_BUTTON = { x: PANEL.x + 790, y: PANEL.y + 618 };

/** Scene 5 — a sensitive request is handed to a person. */
export const HumanTakeoverScene: React.FC = () => {
  const frame = useCurrentFrame();
  const c = brand.colors;
  const convo = conversations.find((x) => x.id === takeoverConversationId)!;
  const panelP = smoothAt(frame, e.panelIn, 0.8);
  const alertP = smoothAt(frame, e.needsAttention, 0.5);
  const switched = after(frame, e.switched);
  const switchP = Math.min(1, springAt(frame, e.switched, { damping: 16 }));
  const toggleP = progress(frame, e.switched, 0.35);
  const caretOn = Math.floor((frame / video.fps) * 2) % 2 === 0;

  return (
    <SceneFrame scene="humanTakeover">
      <div style={{ position: "absolute", top: layout.headlineTop, left: 0, right: 0 }}>
        <Headline text={t.headline} at={e.headline} size={74} />
      </div>

      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.width,
          height: PANEL.height,
          background: c.card,
          borderRadius: brand.radii.xl,
          boxShadow: brand.shadows.float,
          border: `1px solid ${c.divider}`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          opacity: panelP,
          translate: `0 ${(1 - panelP) * 80}px`,
        }}
      >
        {/* header with handling badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 30px", borderBottom: `1px solid ${c.divider}` }}>
          <Avatar initials={convo.initials} channel={convo.channel} size={58} />
          <div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{convo.customer}</div>
            <ChannelBadge channel={convo.channel} size={20} />
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "flex-end", minWidth: 260 }}>
            <StatusBadge
              label={t.aiHandling}
              tone="accent"
              size={23}
              icon={<SparkIcon size={22} />}
              style={{ opacity: 1 - switchP, scale: `${1 - 0.1 * switchP}` }}
            />
            <StatusBadge
              label={t.humanHandling}
              tone="human"
              size={23}
              icon={<PersonIcon size={22} />}
              style={{ position: "absolute", right: 0, opacity: switchP, scale: `${0.8 + 0.2 * switchP}` }}
            />
          </div>
        </div>

        {/* thread */}
        <div style={{ flex: 1, background: c.surface, padding: "16px 30px", display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: 0, overflow: "hidden" }}>
          {takeoverContext.map((m, i) => (
            <ChatBubble key={i} side={m.side} fontSize={25} maxWidth="74%">
              {m.text}
            </ChatBubble>
          ))}
          <Expand p={smoothAt(frame, e.customerMsg, 0.45)}>
            <ChatBubble side="customer" fontSize={25} maxWidth="74%" pop={Math.min(1, springAt(frame, e.customerMsg))}>
              {takeoverMessage}
            </ChatBubble>
          </Expand>

          {/* attention banner → paused banner */}
          <Expand p={alertP}>
            <div style={{ paddingTop: 16 }}>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "20px 24px",
                  borderRadius: brand.radii.lg,
                  background: switched ? c.humanTint : c.warningTint,
                  border: `2px solid ${switched ? alpha(c.human, 0.3) : alpha(c.warning, 0.35)}`,
                  opacity: alertP,
                }}
              >
                <div style={{ color: switched ? c.human : c.warning, display: "flex" }}>
                  {switched ? (
                    <div style={{ width: 40, height: 40, borderRadius: 40, background: c.human, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PauseIcon size={22} color="white" />
                    </div>
                  ) : (
                    <AlertIcon size={40} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: switched ? c.human : c.warning }}>
                    {switched ? t.pausedTitle : t.needsAttention}
                  </div>
                  <div style={{ fontSize: 22, color: c.textMuted, marginTop: 4, fontWeight: 500 }}>
                    {switched ? t.pausedBody : t.needsAttentionReason}
                  </div>
                </div>
                {switched ? null : (
                  <Button variant="dark" fontSize={24} press={pressAmount(frame, sec(e.takeOverClick))}>
                    {t.takeOverButton}
                  </Button>
                )}
              </div>
            </div>
          </Expand>
        </div>

        {/* composer + AI toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 30px 24px", borderTop: `1px solid ${c.divider}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 600, color: c.textMuted }}>
            {t.aiRepliesToggle}
            <div
              style={{
                width: 64,
                height: 36,
                borderRadius: 36,
                background: switched ? c.border : c.accent,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  left: lerp(32, 4, toggleP),
                  width: 28,
                  height: 28,
                  borderRadius: 28,
                  background: "white",
                  boxShadow: brand.shadows.soft,
                }}
              />
            </div>
          </div>
          <div
            style={{
              flex: 1,
              padding: "16px 22px",
              borderRadius: brand.radii.pill,
              border: `2px solid ${switched ? c.human : c.border}`,
              background: c.card,
              fontSize: 22,
              color: switched ? c.text : c.textSubtle,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {switched ? (
              <>
                <span style={{ width: 3, height: 26, background: caretOn ? c.text : "transparent", marginRight: 6 }} />
                <span style={{ color: c.textSubtle }}>{t.composerHuman}</span>
              </>
            ) : (
              t.composerAi
            )}
          </div>
        </div>
      </div>

      <AnimatedCursor
        path={[
          { at: e.cursorIn, x: 1000, y: 1330 },
          { at: e.takeOverClick - 0.35, x: TAKE_OVER_BUTTON.x, y: TAKE_OVER_BUTTON.y },
          { at: e.takeOverClick + 0.6, x: TAKE_OVER_BUTTON.x, y: TAKE_OVER_BUTTON.y },
          { at: e.takeOverClick + 1.6, x: TAKE_OVER_BUTTON.x + 60, y: TAKE_OVER_BUTTON.y + 260 },
        ]}
        clicks={[e.takeOverClick]}
        hideAt={e.takeOverClick + 1.4}
      />
    </SceneFrame>
  );
};
