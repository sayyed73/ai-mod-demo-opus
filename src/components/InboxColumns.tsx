import { Img, staticFile } from "remotion";
import { brand } from "../config/brand";
import { content } from "../config/content";
import { conversations, featuredCustomer, products, type Conversation } from "../data/demo";
import { Avatar } from "./Avatar";
import { ChannelBadge } from "./ChannelBadge";
import { ChatBubble } from "./ChatBubble";
import { ConversationRow } from "./ConversationRow";
import { HighlightRing } from "./HighlightRing";
import { SparkIcon } from "./Icons";
import { StatusBadge } from "./StatusBadge";

const t = content.unifiedInbox;

/** Inbox list column. `rowStyle(i)` lets a scene animate each row. */
export const InboxList: React.FC<{
  selectedId?: string;
  selected?: number;
  rowStyle?: (i: number, c: Conversation) => React.CSSProperties;
  headerHeight: number;
}> = ({ selectedId, selected = 0, rowStyle, headerHeight }) => (
  <div>
    <div
      style={{
        height: headerHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        borderBottom: `1px solid ${brand.colors.divider}`,
      }}
    >
      <span style={{ fontSize: 26, fontWeight: 800 }}>{t.listTitle}</span>
      <span
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: brand.colors.accentDark,
          background: brand.colors.accentTint,
          padding: "5px 12px",
          borderRadius: brand.radii.pill,
        }}
      >
        {t.allChannels} · {conversations.length}
      </span>
    </div>
    {conversations.map((c, i) => (
      <ConversationRow
        key={c.id}
        conversation={c}
        selected={c.id === selectedId ? selected : 0}
        style={rowStyle?.(i, c)}
      />
    ))}
  </div>
);

/** Middle column: the selected conversation's latest messages. */
export const ThreadPreview: React.FC<{
  conversation: Conversation;
  p: number; // 0–1 reveal
  typing?: React.ReactNode;
}> = ({ conversation: c, p, typing }) => (
  <div style={{ padding: 20, opacity: p, translate: `0 ${(1 - p) * 16}px` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Avatar initials={c.initials} channel={c.channel} size={44} />
      <div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{c.customer}</div>
        <ChannelBadge channel={c.channel} size={20} />
      </div>
    </div>
    <div style={{ marginTop: 14 }}>
      <StatusBadge label={t.handledByAi} tone="accent" size={20} icon={<SparkIcon size={18} />} />
    </div>
    <div style={{ marginTop: 18 }}>
      <ChatBubble side="customer" fontSize={21} maxWidth="92%">
        {c.preview}
      </ChatBubble>
      {typing}
    </div>
  </div>
);

/** Right column: customer details. */
export const CustomerPanel: React.FC<{
  conversation: Conversation;
  p: number;
  highlight?: number;
}> = ({ conversation: c, p, highlight = 0 }) => {
  const product = products.navyHoodie;
  const label: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 600,
    color: brand.colors.textSubtle,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginTop: 18,
  };
  return (
    <div style={{ position: "relative", padding: 20, opacity: p, translate: `0 ${(1 - p) * 16}px` }}>
      <HighlightRing p={highlight} radius={20} inset={8} />
      <div style={{ ...label, marginTop: 0 }}>{t.customerPanelTitle}</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 14 }}>
        <Avatar initials={c.initials} channel={c.channel} size={76} />
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>{c.customer}</div>
        <div style={{ fontSize: 20, color: brand.colors.textMuted, marginTop: 2 }}>{featuredCustomer.note}</div>
      </div>
      <div style={label}>{t.pastOrdersLabel}</div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 2 }}>{featuredCustomer.pastOrders}</div>
      <div style={label}>{t.interestedInLabel}</div>
      <div
        style={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: 10,
          borderRadius: brand.radii.sm,
          background: brand.colors.surface,
          border: `1px solid ${brand.colors.divider}`,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 10,
            background: brand.colors.accentTint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Img src={staticFile(product.image)} style={{ height: 44 }} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{featuredCustomer.interestedIn}</div>
      </div>
    </div>
  );
};
