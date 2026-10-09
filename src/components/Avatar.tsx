import { brand, type ChannelId } from "../config/brand";
import { alpha } from "../lib/color";

/** Initials avatar with a small channel dot. */
export const Avatar: React.FC<{
  initials: string;
  channel?: ChannelId;
  size?: number;
}> = ({ initials, channel, size = 48 }) => (
  <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size,
        background: channel
          ? alpha(brand.channelColors[channel], 0.14)
          : brand.colors.accentTint,
        color: channel ? brand.channelColors[channel] : brand.colors.accentDark,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.4,
      }}
    >
      {initials}
    </div>
    {channel ? (
      <div
        style={{
          position: "absolute",
          right: -2,
          bottom: -2,
          width: size * 0.34,
          height: size * 0.34,
          borderRadius: size,
          background: brand.channelColors[channel],
          border: "3px solid white",
        }}
      />
    ) : null}
  </div>
);
