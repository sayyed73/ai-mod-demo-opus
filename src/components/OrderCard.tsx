import { Img, interpolate, staticFile } from "remotion";
import { brand } from "../config/brand";
import { content } from "../config/content";
import { channels, conversations, order } from "../data/demo";
import { formatCurrency } from "../lib/formatCurrency";
import { orderLines, orderSubtotalMinor, orderTotalMinor } from "../lib/orders";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { CheckIcon, DocIcon, SparkIcon } from "./Icons";
import { StatusBadge } from "./StatusBadge";

const t = content.orderApproval;

/**
 * The order drafted from the chat. All amounts are calculated (src/lib/orders.ts).
 * `reveal(i)` → 0–1 entrance per row; `approvedP` 0–1 morphs pending → approved.
 */
export const OrderCard: React.FC<{
  width?: number;
  reveal: (i: number) => number;
  approvedP: number;
  press: number;
}> = ({ width = 840, reveal, approvedP, press }) => {
  const c = brand.colors;
  const customer = conversations.find((x) => x.id === order.conversationId)!;
  const row = (i: number): React.CSSProperties => ({
    opacity: reveal(i),
    translate: `0 ${(1 - reveal(i)) * 24}px`,
  });
  const approved = approvedP >= 0.5;
  const money = (m: number) => formatCurrency(m);

  return (
    <div
      style={{
        width,
        background: c.card,
        borderRadius: brand.radii.xl,
        boxShadow: brand.shadows.float,
        border: `1px solid ${c.divider}`,
        padding: "38px 44px 40px",
      }}
    >
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...row(0) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: c.accentTint,
              color: c.accentDark,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DocIcon size={30} />
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: c.text }}>{t.cardTitle}</div>
            <div style={{ fontSize: 21, color: c.textMuted, fontWeight: 500 }}>#{order.id}</div>
          </div>
        </div>
        {/* status badge cross-fades */}
        <div style={{ position: "relative", height: 48, display: "flex", alignItems: "center" }}>
          <StatusBadge
            label={t.pending}
            tone="warning"
            size={23}
            style={{ opacity: 1 - approvedP, scale: `${1 - approvedP * 0.1}` }}
          />
          <StatusBadge
            label={t.approved}
            tone="accent"
            size={23}
            icon={<CheckIcon size={22} />}
            style={{
              position: "absolute",
              right: 0,
              opacity: approvedP,
              scale: `${interpolate(approvedP, [0, 0.6, 1], [0.7, 1.08, 1])}`,
            }}
          />
        </div>
      </div>

      {/* drafted from */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginTop: 24,
          padding: "14px 18px",
          borderRadius: brand.radii.md,
          background: c.surface,
          border: `1px solid ${c.divider}`,
          ...row(1),
        }}
      >
        <Avatar initials={customer.initials} channel={customer.channel} size={44} />
        <div style={{ fontSize: 24, fontWeight: 700, color: c.text }}>{customer.customer}</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: c.accentDark, fontSize: 21, fontWeight: 600 }}>
          <SparkIcon size={20} />
          {t.draftedFrom(channels[customer.channel].name)}
        </div>
      </div>

      {/* line items */}
      {orderLines.map((line) => (
        <div key={line.productId} style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 26, ...row(2) }}>
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: brand.radii.md,
              background: c.accentTint,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img src={staticFile(line.product.image)} style={{ height: 92 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: c.text }}>{line.product.name}</div>
            <div style={{ fontSize: 24, color: c.textMuted, marginTop: 6, fontWeight: 500 }}>
              {t.sizeLabel} {line.size} · {t.qtyLabel} {line.qty}
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: c.text }}>{money(line.lineTotalMinor)}</div>
        </div>
      ))}

      {/* totals */}
      <div style={{ marginTop: 26, borderTop: `2px solid ${c.divider}`, paddingTop: 18 }}>
        {[
          { label: t.itemLabel, value: money(orderSubtotalMinor), i: 3 },
          { label: t.deliveryLabel, value: money(order.deliveryFeeMinor), i: 4 },
        ].map((r) => (
          <div
            key={r.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 25,
              color: c.textMuted,
              fontWeight: 500,
              padding: "6px 0",
              ...row(r.i),
            }}
          >
            <span>{r.label}</span>
            <span style={{ color: c.text }}>{r.value}</span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginTop: 10,
            paddingTop: 14,
            borderTop: `2px dashed ${c.border}`,
            ...row(5),
          }}
        >
          <span style={{ fontSize: 30, fontWeight: 800, color: c.text }}>{t.totalLabel}</span>
          <span style={{ fontSize: 44, fontWeight: 800, color: c.text, letterSpacing: "-0.02em" }}>
            {money(orderTotalMinor)}
          </span>
        </div>
      </div>

      {/* actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 30, ...row(6) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 21, color: c.textMuted, fontWeight: 500, flex: 1 }}>
          <span style={{ color: c.accent, display: "flex" }}>
            <CheckIcon size={22} />
          </span>
          {approved ? t.approvedBy : t.deliveryDetails}
        </div>
        <Button variant="ghost" style={{ opacity: 1 - approvedP * 0.6 }}>
          {t.editButton}
        </Button>
        <Button variant={approved ? "done" : "primary"} press={press} style={{ minWidth: 260 }}>
          {approved ? (
            <>
              <CheckIcon size={24} /> {t.approvedButton}
            </>
          ) : (
            t.approveButton
          )}
        </Button>
      </div>
    </div>
  );
};
