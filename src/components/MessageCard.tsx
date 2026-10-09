import { brand } from "../config/brand";
import type { Conversation } from "../data/demo";
import { Avatar } from "./Avatar";
import { ChannelBadge } from "./ChannelBadge";

/** Incoming-message card used in scene 1 (scattered notifications). */
export const MessageCard: React.FC<{
  conversation: Conversation;
  width?: number;
  style?: React.CSSProperties;
}> = ({ conversation: c, width = 520, style }) => (
  <div
    style={{
      width,
      background: brand.colors.card,
      borderRadius: brand.radii.lg,
      boxShadow: brand.shadows.float,
      border: `1px solid ${brand.colors.divider}`,
      padding: "24px 28px",
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar initials={c.initials} channel={c.channel} size={54} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: brand.colors.text }}>
          {c.customer}
        </div>
        <div style={{ marginTop: 4 }}>
          <ChannelBadge channel={c.channel} size={20} />
        </div>
      </div>
      <div style={{ fontSize: 20, color: brand.colors.textSubtle, alignSelf: "flex-start" }}>
        {c.time}
      </div>
    </div>
    <div
      style={{
        marginTop: 18,
        fontSize: 30,
        fontWeight: 600,
        lineHeight: 1.25,
        color: brand.colors.text,
      }}
    >
      “{c.preview}”
    </div>
  </div>
);
