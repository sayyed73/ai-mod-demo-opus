import { brand } from "../config/brand";
import { content } from "../config/content";
import { Wordmark } from "./Logo";
import { SearchIcon } from "./Icons";

/**
 * Desktop inbox frame: top bar + three columns (list | thread | customer).
 * Scenes pass the column contents in.
 */
export const DashboardShell: React.FC<{
  width: number;
  height: number;
  columns: [number, number, number]; // column widths
  list: React.ReactNode;
  thread: React.ReactNode;
  panel: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, height, columns, list, thread, panel, style }) => {
  const c = brand.colors;
  const topBar = 78;
  return (
    <div
      style={{
        width,
        height,
        background: c.card,
        borderRadius: brand.radii.xl,
        boxShadow: brand.shadows.float,
        border: `1px solid ${c.divider}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div
        style={{
          height: topBar,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "0 26px",
          borderBottom: `1px solid ${c.divider}`,
        }}
      >
        <Wordmark size={38} />
        <div style={{ width: 1, height: 30, background: c.border }} />
        <div style={{ fontSize: 21, fontWeight: 600, color: c.textMuted }}>{brand.merchantName}</div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 16px",
            borderRadius: brand.radii.pill,
            background: c.surface,
            border: `1px solid ${c.divider}`,
            color: c.textSubtle,
            fontSize: 20,
          }}
        >
          <SearchIcon size={20} /> {content.unifiedInbox.searchPlaceholder}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div style={{ width: columns[0], borderRight: `1px solid ${c.divider}`, position: "relative" }}>{list}</div>
        <div style={{ width: columns[1], background: c.surface, position: "relative" }}>{thread}</div>
        <div style={{ width: columns[2], borderLeft: `1px solid ${c.divider}`, position: "relative" }}>{panel}</div>
      </div>
    </div>
  );
};
