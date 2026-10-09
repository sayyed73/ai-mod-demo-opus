import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "../config/brand";
import { content } from "../config/content";
import { events, scenes } from "../config/timing";
import { conversations, featuredConversationId, problemCardIds } from "../data/demo";
import { AnimatedCursor } from "../components/AnimatedCursor";
import { ChatBubble } from "../components/ChatBubble";
import { DashboardShell } from "../components/DashboardShell";
import { Headline } from "../components/Headline";
import { CustomerPanel, InboxList, ThreadPreview } from "../components/InboxColumns";
import { MessageCard } from "../components/MessageCard";
import { SceneFrame } from "../components/SceneFrame";
import { TypingIndicator } from "../components/TypingIndicator";
import { layout } from "../lib/layout";
import { easeInOut, float, lerp, progress, sec, smoothAt } from "../lib/timeline";

const e = events.unifiedInbox;
const L = layout.inbox;
const ZOOM = 1.85; // ✏️ how far the camera pushes in on the customer panel

/** Scene 2 — cards fly into one workspace, then zoom to the customer. */
export const UnifiedInboxScene: React.FC = () => {
  const frame = useCurrentFrame();
  const featured = conversations.find((c) => c.id === featuredConversationId)!;
  const featuredIndex = conversations.indexOf(featured);
  const rowY = (i: number) => L.y + L.topBar + L.listHeader + i * L.rowHeight;

  const shellP = smoothAt(frame, e.dashboardIn, 0.7);
  const selectP = progress(frame, e.selectClick, 0.25);
  const threadP = progress(frame, e.selectClick + 0.1, 0.6);
  const panelP = progress(frame, e.selectClick + 0.3, 0.6);
  const zoomP = progress(frame, e.zoom, 1.3, easeInOut);
  const ringP = progress(frame, e.zoom + 1.2, 0.5);

  // Camera: push in so the customer panel centre lands in the window centre.
  const focus = { x: L.columns[0] + L.columns[1] + L.columns[2] / 2, y: 330 };
  const scale = lerp(1, ZOOM, zoomP);
  const tx = lerp(0, L.width / 2 - ZOOM * focus.x, zoomP);
  const ty = lerp(0, L.height / 2 - ZOOM * focus.y, zoomP);

  const flyIndex = (id: string) => problemCardIds.indexOf(id as (typeof problemCardIds)[number]);
  const flyP = (i: number) => smoothAt(frame, e.cardsFly + i * 0.14, 0.9);

  const rowCenterY = rowY(featuredIndex) + L.rowHeight / 2;

  return (
    <SceneFrame scene="unifiedInbox" fadeIn={false}>
      <div style={{ position: "absolute", top: layout.headlineTop, left: 0, right: 0 }}>
        <Headline text={content.unifiedInbox.headline} at={e.headline} size={78} />
      </div>

      {/* dashboard window (clips the zoom) */}
      <div
        style={{
          position: "absolute",
          left: L.x,
          top: L.y,
          width: L.width,
          height: L.height,
          borderRadius: brand.radii.xl,
          overflow: "hidden",
          opacity: shellP,
          scale: `${0.95 + 0.05 * shellP}`,
          boxShadow: brand.shadows.float,
        }}
      >
        <div
          style={{
            transformOrigin: "0 0",
            translate: `${tx}px ${ty}px`,
            scale: `${scale}`,
          }}
        >
          <DashboardShell
            width={L.width}
            height={L.height}
            columns={L.columns}
            style={{ boxShadow: "none" }}
            list={
              <InboxList
                headerHeight={L.listHeader}
                selectedId={featured.id}
                selected={selectP}
                rowStyle={(i, c) => {
                  const fi = flyIndex(c.id);
                  const p =
                    fi >= 0
                      ? interpolate(flyP(fi), [0.75, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
                      : progress(frame, e.rowsIn + i * 0.07, 0.5);
                  return { opacity: p, translate: fi >= 0 ? undefined : `${(1 - p) * -24}px 0` };
                }}
              />
            }
            thread={
              selectP > 0 ? (
                <ThreadPreview
                  conversation={featured}
                  p={threadP}
                  typing={
                    frame >= sec(e.selectClick + 0.9) ? (
                      <ChatBubble side="assistant" fontSize={21} pop={progress(frame, e.selectClick + 0.9, 0.3)}>
                        <TypingIndicator size={10} />
                      </ChatBubble>
                    ) : null
                  }
                />
              ) : null
            }
            panel={selectP > 0 ? <CustomerPanel conversation={featured} p={panelP} highlight={ringP} /> : null}
          />
        </div>
      </div>

      {/* scene-1 cards fly into their rows */}
      {problemCardIds.map((id, i) => {
        const c = conversations.find((x) => x.id === id)!;
        const from = layout.problemCards[i];
        const p = flyP(i);
        const CARD_H = 212; // approx. MessageCard height; scaling is about the card centre
        const toX = L.x + L.columns[0] / 2 - from.width / 2;
        const toY = rowY(conversations.indexOf(c)) + L.rowHeight / 2 - CARD_H / 2;
        const toScale = L.columns[0] / from.width;
        if (p >= 1) return null;
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              translate: `${lerp(from.x, toX, p)}px ${lerp(from.y + float(frame + scenes.problem.durationInFrames, 5, 4.2, i * 1.7), toY, p)}px`,
              rotate: `${lerp(from.rotate, 0, p)}deg`,
              scale: `${lerp(1, toScale, p)}`,
              opacity: interpolate(p, [0.7, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              zIndex: 20,
            }}
          >
            <MessageCard conversation={c} width={from.width} />
          </div>
        );
      })}

      <AnimatedCursor
        path={[
          { at: e.cursorIn, x: 940, y: 1300 },
          { at: e.selectClick - 0.25, x: L.x + 230, y: rowCenterY },
          { at: e.selectClick + 0.2, x: L.x + 230, y: rowCenterY },
          { at: e.zoom - 0.1, x: L.x + 560, y: rowCenterY + 160 },
        ]}
        clicks={[e.selectClick]}
        hideAt={e.zoom - 0.2}
      />
    </SceneFrame>
  );
};
