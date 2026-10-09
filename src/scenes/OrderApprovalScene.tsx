import { useCurrentFrame } from "remotion";
import { brand } from "../config/brand";
import { content } from "../config/content";
import { events } from "../config/timing";
import { AnimatedCursor } from "../components/AnimatedCursor";
import { pressAmount } from "../components/Button";
import { Headline } from "../components/Headline";
import { HighlightRing } from "../components/HighlightRing";
import { OrderCard } from "../components/OrderCard";
import { SceneFrame } from "../components/SceneFrame";
import { layout } from "../lib/layout";
import { progress, sec, smoothAt, springAt } from "../lib/timeline";

const e = events.orderApproval;
const t = content.orderApproval;

// ✏️ Card position; the cursor target below is relative to it.
const CARD = { x: 110, y: 420, width: 860 };
const APPROVE_BUTTON = { x: CARD.x + 690, y: CARD.y + 616 };

/** Scene 4 — the drafted order waits for a human "Approve". */
export const OrderApprovalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cardP = smoothAt(frame, e.cardIn, 0.8);
  const approvedP = Math.min(1, springAt(frame, e.approved, { damping: 16 }));
  const ringP = progress(frame, e.approved, 0.4) * (1 - progress(frame, e.approved + 2.2, 0.8));

  return (
    <SceneFrame scene="orderApproval">
      <div style={{ position: "absolute", top: layout.headlineTop, left: 0, right: 0 }}>
        <Headline text={t.headline} at={e.headline} size={70} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 34,
          fontWeight: 500,
          color: brand.colors.textMuted,
          opacity: progress(frame, e.subhead, 0.6),
          translate: `0 ${(1 - progress(frame, e.subhead, 0.6)) * 16}px`,
        }}
      >
        {t.subhead}
      </div>

      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          opacity: cardP,
          translate: `0 ${(1 - cardP) * 80}px`,
          scale: `${0.97 + 0.03 * cardP}`,
        }}
      >
        <div style={{ position: "relative" }}>
          <HighlightRing p={ringP} radius={brand.radii.xl} inset={-10} />
          <OrderCard
            width={CARD.width}
            reveal={(i) => progress(frame, e.rowsIn + i * 0.22, 0.5)}
            approvedP={approvedP}
            press={pressAmount(frame, sec(e.approveClick))}
          />
        </div>
      </div>

      <AnimatedCursor
        path={[
          { at: e.cursorIn, x: 1000, y: 1330 },
          { at: e.approveClick - 0.3, x: APPROVE_BUTTON.x, y: APPROVE_BUTTON.y },
          { at: e.approveClick + 0.6, x: APPROVE_BUTTON.x, y: APPROVE_BUTTON.y },
          { at: e.approveClick + 1.6, x: APPROVE_BUTTON.x + 120, y: APPROVE_BUTTON.y + 160 },
        ]}
        clicks={[e.approveClick]}
        hideAt={e.approveClick + 1.4}
      />
    </SceneFrame>
  );
};
