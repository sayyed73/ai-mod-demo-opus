import { useCurrentFrame } from "remotion";
import { brand } from "../config/brand";
import { content } from "../config/content";
import { events } from "../config/timing";
import { channels } from "../data/demo";
import { Card } from "../components/Card";
import { Headline } from "../components/Headline";
import { CheckIcon, DocIcon, PersonIcon, SparkIcon } from "../components/Icons";
import { SceneFrame } from "../components/SceneFrame";
import { StatTile } from "../components/StatTile";
import { layout } from "../lib/layout";
import { channelBreakdown, countsAfter, countsBefore, type DashboardCounts } from "../lib/stats";
import { easeInOut, lerp, progress, smoothAt, springAt } from "../lib/timeline";

const e = events.overview;
const t = content.overview;

const tiles: { key: keyof DashboardCounts; icon: React.ReactNode }[] = [
  { key: "open", icon: <DocIcon size={24} /> },
  { key: "ai", icon: <SparkIcon size={24} /> },
  { key: "human", icon: <PersonIcon size={24} /> },
  { key: "ordersApproved", icon: <CheckIcon size={24} /> },
];

/** Scene 6 — counts derived from the data, updated by scenes 4–5. */
export const OverviewScene: React.FC = () => {
  const frame = useCurrentFrame();
  const changeP = progress(frame, e.countChange, 0.6, easeInOut);
  const highlightP = progress(frame, e.countChange + 0.1, 0.5);
  const maxCount = Math.max(...channelBreakdown.map((c) => c.count));

  return (
    <SceneFrame scene="overview">
      <div style={{ position: "absolute", top: layout.headlineTop, left: 0, right: 0 }}>
        <Headline text={t.headline} at={e.headline} size={74} />
      </div>

      {/* 2×2 count tiles */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 380,
          width: 920,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
        }}
      >
        {tiles.map((tile, i) => {
          const p = springAt(frame, e.tilesIn + i * 0.1);
          const before = countsBefore[tile.key];
          const afterV = countsAfter[tile.key];
          const delta = afterV - before;
          return (
            <div key={tile.key} style={{ opacity: Math.min(1, p), translate: `0 ${(1 - p) * 40}px` }}>
              <StatTile
                label={t.tiles[tile.key]}
                value={lerp(before, afterV, changeP)}
                delta={delta}
                highlight={delta !== 0 ? highlightP : 0}
                icon={<span style={{ color: brand.colors.accent, display: "flex" }}>{tile.icon}</span>}
              />
            </div>
          );
        })}
      </div>

      {/* channel breakdown */}
      <div style={{ position: "absolute", left: 80, top: 880, width: 920, opacity: smoothAt(frame, e.channelsIn, 0.6) }}>
        <Card style={{ padding: "30px 34px" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: brand.colors.textMuted, marginBottom: 18 }}>{t.channelsTitle}</div>
          {channelBreakdown.map((row, i) => {
            const p = progress(frame, e.channelsIn + 0.2 + i * 0.15, 0.8);
            return (
              <div key={row.channel} style={{ display: "flex", alignItems: "center", gap: 20, padding: "10px 0" }}>
                <div style={{ width: 170, fontSize: 24, fontWeight: 600 }}>{channels[row.channel].name}</div>
                <div style={{ flex: 1, height: 26, borderRadius: 26, background: brand.colors.divider, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${(row.count / maxCount) * 100 * p}%`,
                      height: "100%",
                      borderRadius: 26,
                      background: brand.channelColors[row.channel],
                    }}
                  />
                </div>
                <div style={{ width: 40, textAlign: "right", fontSize: 28, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                  {row.count}
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </SceneFrame>
  );
};
