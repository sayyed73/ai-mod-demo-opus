/**
 * Grows/shrinks its content's height (0 → natural height) using a
 * grid-row fraction, driven by `p` (0–1). Lets chat bubbles push older
 * messages up without hard-coded heights.
 */
export const Expand: React.FC<{
  p: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ p, children, style }) => (
  <div style={{ display: "grid", gridTemplateRows: `${Math.max(0, p)}fr`, ...style }}>
    <div style={{ overflow: "hidden", minHeight: 0 }}>{children}</div>
  </div>
);
