import { Img, staticFile } from "remotion";
import { brand } from "../config/brand";
import type { Product } from "../data/demo";
import { formatCurrency } from "../lib/formatCurrency";

/** Product card shown inside the chat (scene 3). */
export const ProductCard: React.FC<{
  product: Product;
  detail: string;
  width?: number;
}> = ({ product, detail, width = 330 }) => (
  <div
    style={{
      width,
      borderRadius: brand.radii.md,
      background: brand.colors.card,
      border: `1px solid ${brand.colors.divider}`,
      boxShadow: brand.shadows.soft,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: width * 0.62,
        background: brand.colors.accentTint,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img
        src={staticFile(product.image)}
        style={{ height: "88%", objectFit: "contain" }}
      />
    </div>
    <div style={{ padding: "14px 18px 16px" }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: brand.colors.text }}>
        {product.name}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 6,
        }}
      >
        <span style={{ fontSize: 21, color: brand.colors.accentDark, fontWeight: 600 }}>
          {detail}
        </span>
        <span style={{ fontSize: 24, fontWeight: 800, color: brand.colors.text }}>
          {formatCurrency(product.priceMinor, { trimZeros: true })}
        </span>
      </div>
    </div>
  </div>
);
