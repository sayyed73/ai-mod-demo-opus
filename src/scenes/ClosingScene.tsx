import { useCurrentFrame } from "remotion";
import { brand } from "../config/brand";
import { content } from "../config/content";
import { events } from "../config/timing";
import { chatScript, conversations, featuredConversationId, products } from "../data/demo";
import { formatCurrency } from "../lib/formatCurrency";
import { ChatBubble } from "../components/ChatBubble";
import { DashboardShell } from "../components/DashboardShell";
import { InboxList, ThreadPreview } from "../components/InboxColumns";
import { Wordmark } from "../components/Logo";
import { PhoneMockup } from "../components/PhoneMockup";
import { SceneFrame } from "../components/SceneFrame";
import { StatusBadge } from "../components/StatusBadge";
import { CheckIcon } from "../components/Icons";
import { float, progress, smoothAt } from "../lib/timeline";
import { Headline } from "../components/Headline";

const e = events.closing;
const t = content.closing;

/** Scene 7 — wordmark, product visuals, calm hold. */
export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const featured = conversations.find((c) => c.id === featuredConversationId)!;
  const logoP = smoothAt(frame, e.logoIn, 0.7);
  const visualP = smoothAt(frame, e.visualsIn, 1.1);
  const subP = progress(frame, e.subhead, 0.7);

  return (
    <SceneFrame scene="closing" fadeOut={false}>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: logoP, scale: `${0.94 + 0.06 * logoP}` }}>
        <Wordmark size={64} />
      </div>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0 }}>
        <Headline text={t.headline} at={e.headline} size={76} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 410,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 32,
          lineHeight: 1.35,
          fontWeight: 600,
          color: brand.colors.textMuted,
          whiteSpace: "pre",
          opacity: subP,
          translate: `0 ${(1 - subP) * 14}px`,
        }}
      >
        {t.subhead}
      </div>

      {/* dashboard window + phone in front */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 590,
          width: 680,
          height: 600,
          borderRadius: brand.radii.xl,
          overflow: "hidden",
          boxShadow: brand.shadows.float,
          opacity: visualP,
          translate: `0 ${(1 - visualP) * 60 + float(frame, 4, 5)}px`,
        }}
      >
        <DashboardShell
          width={960}
          height={600}
          columns={[380, 330, 250]}
          style={{ boxShadow: "none" }}
          list={<InboxList headerHeight={64} selectedId={featured.id} selected={1} />}
          thread={<ThreadPreview conversation={featured} p={1} />}
          panel={null}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 690,
          top: 610,
          opacity: visualP,
          translate: `0 ${(1 - visualP) * 90 + float(frame, 5, 5, 1.5)}px`,
        }}
      >
        <PhoneMockup width={310} height={590}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 14px 24px" }}>
            <ChatBubble side="customer" fontSize={20}>
              {chatScript.customerAsk}
            </ChatBubble>
            <ChatBubble side="assistant" fontSize={20}>
              {chatScript.assistantReply(formatCurrency(products.navyHoodie.priceMinor, { trimZeros: true }))}
            </ChatBubble>
            <ChatBubble side="customer" fontSize={20}>
              {chatScript.customerBuy}
            </ChatBubble>
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
              <StatusBadge label={content.orderApproval.approved} tone="accent" size={20} icon={<CheckIcon size={18} />} />
            </div>
          </div>
        </PhoneMockup>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 56,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "0.02em",
          color: brand.colors.textSubtle,
          opacity: progress(frame, e.footer, 0.8),
        }}
      >
        {t.footer}
      </div>
    </SceneFrame>
  );
};
