import { brand } from "../config/brand";
import { alpha } from "../lib/color";

export type BubbleSide = "customer" | "assistant";

/**
 * One chat message. Customer bubbles sit on the right in the accent colour;
 * assistant (merchant) bubbles sit on the left in white.
 */
export const ChatBubble: React.FC<{
  side: BubbleSide;
  children: React.ReactNode;
  fontSize?: number;
  maxWidth?: number | string;
  pop?: number; // 0–1 entrance (scale/opacity)
}> = ({ side, children, fontSize = 26, maxWidth = "82%", pop = 1 }) => {
  const isCustomer = side === "customer";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isCustomer ? "flex-end" : "flex-start",
        padding: "6px 0",
      }}
    >
      <div
        style={{
          maxWidth,
          padding: `${fontSize * 0.55}px ${fontSize * 0.75}px`,
          borderRadius: fontSize * 0.9,
          borderBottomRightRadius: isCustomer ? fontSize * 0.25 : fontSize * 0.9,
          borderBottomLeftRadius: isCustomer ? fontSize * 0.9 : fontSize * 0.25,
          background: isCustomer ? brand.colors.accent : brand.colors.card,
          color: isCustomer ? brand.colors.onAccent : brand.colors.text,
          boxShadow: isCustomer ? "none" : `0 2px 8px ${alpha(brand.colors.text, 0.08)}`,
          border: isCustomer ? "none" : `1px solid ${brand.colors.divider}`,
          fontSize,
          lineHeight: 1.3,
          fontWeight: 500,
          scale: `${0.85 + 0.15 * pop}`,
          opacity: pop,
          transformOrigin: isCustomer ? "100% 100%" : "0% 100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
