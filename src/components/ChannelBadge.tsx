import { brand, type ChannelId } from "../config/brand";
import { channels } from "../data/demo";
import { alpha } from "../lib/color";

/** Neutral channel tag (coloured dot + name). No third-party logos. */
export const ChannelBadge: React.FC<{ channel: ChannelId; size?: number }> = ({
  channel,
  size = 20,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.4,
      padding: `${size * 0.25}px ${size * 0.6}px`,
      borderRadius: brand.radii.pill,
      background: alpha(brand.channelColors[channel], 0.1),
      color: brand.channelColors[channel],
      fontSize: size,
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}
  >
    <div
      style={{
        width: size * 0.45,
        height: size * 0.45,
        borderRadius: size,
        background: brand.channelColors[channel],
      }}
    />
    {channels[channel].name}
  </div>
);
