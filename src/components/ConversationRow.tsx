import { brand } from "../config/brand";
import type { Conversation } from "../data/demo";
import { Avatar } from "./Avatar";

/** One row of the inbox list. `selected` 0–1 animates the selection state. */
export const ConversationRow: React.FC<{
  conversation: Conversation;
  selected?: number;
  style?: React.CSSProperties;
}> = ({ conversation: c, selected = 0, style }) => (
  <div
    style={{
      display: "flex",
      gap: 14,
      alignItems: "center",
      padding: "14px 18px",
      height: 92,
      boxSizing: "border-box",
      background: selected > 0 ? brand.colors.accentTint : "transparent",
      boxShadow: selected > 0 ? `inset 5px 0 0 ${brand.colors.accent}` : "none",
      borderBottom: `1px solid ${brand.colors.divider}`,
      opacity: 1,
      ...style,
    }}
  >
    <Avatar initials={c.initials} channel={c.channel} size={48} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: brand.colors.text }}>{c.customer}</span>
        <span style={{ fontSize: 20, color: brand.colors.textSubtle }}>{c.time}</span>
      </div>
      <div
        style={{
          fontSize: 20,
          color: brand.colors.textMuted,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginTop: 2,
        }}
      >
        {c.preview}
      </div>
    </div>
  </div>
);
