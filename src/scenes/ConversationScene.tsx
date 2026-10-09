import { useCurrentFrame } from "remotion";
import { brand } from "../config/brand";
import { content } from "../config/content";
import { events } from "../config/timing";
import { chatScript, order, products } from "../data/demo";
import { Avatar } from "../components/Avatar";
import { ChatBubble } from "../components/ChatBubble";
import { Expand } from "../components/Expand";
import { FloatingNote } from "../components/FloatingNote";
import { BoxIcon, CheckIcon, DocIcon, SparkIcon } from "../components/Icons";
import { PhoneMockup } from "../components/PhoneMockup";
import { ProductCard } from "../components/ProductCard";
import { SceneFrame } from "../components/SceneFrame";
import { StatusBadge } from "../components/StatusBadge";
import { TypingIndicator } from "../components/TypingIndicator";
import { formatCurrency } from "../lib/formatCurrency";
import { orderLines } from "../lib/orders";
import { stockFor } from "../lib/orders";
import { after, float, progress, smoothAt, springAt } from "../lib/timeline";

const e = events.conversation;
const t = content.conversation;
const FONT = 26; // chat text size inside the phone

/** Scene 3 — the AI assistant answers on the customer's phone. */
export const ConversationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const product = products.navyHoodie;
  const line = orderLines[0];
  const price = formatCurrency(product.priceMinor, { trimZeros: true });

  const grow = (at: number) => smoothAt(frame, at, 0.45);
  const pop = (at: number) => Math.min(1, springAt(frame, at));
  const typing = (from: number, to: number) => grow(from) * (1 - progress(frame, to - 0.05, 0.25));

  const phoneP = smoothAt(frame, e.phoneIn, 0.9);
  const collapse = progress(frame, e.addressCollapse, 0.5);
  const chipP = progress(frame, e.addressCollapse + 0.15, 0.5);

  const invP = springAt(frame, e.inventoryNote);
  const invDone = after(frame, e.assistantReply);
  const invGlow = progress(frame, e.assistantReply, 0.3) * (1 - progress(frame, e.assistantReply + 1, 0.6));
  const orderP = springAt(frame, e.orderNote);
  const orderUpdated = after(frame, e.orderNoteUpdate);
  const orderGlow = progress(frame, e.orderNoteUpdate, 0.3) * (1 - progress(frame, e.orderNoteUpdate + 1.2, 0.6));

  const assistantHeader = (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 20, fontWeight: 600, color: brand.colors.accentDark, marginBottom: 4 }}>
      <SparkIcon size={18} /> {t.assistantLabel}
    </div>
  );

  return (
    <SceneFrame scene="conversation">
      {/* phone */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 150,
          translate: `0 ${(1 - phoneP) * 120}px`,
          opacity: phoneP,
        }}
      >
        <PhoneMockup width={500} height={1130}>
          {/* chat header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 22px 16px",
              borderBottom: `1px solid ${brand.colors.divider}`,
              background: brand.colors.card,
            }}
          >
            <Avatar initials="NA" size={52} />
            <div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{brand.merchantName}</div>
              <div style={{ fontSize: 20, color: brand.colors.textMuted }}>{t.shopHeaderStatus}</div>
            </div>
          </div>

          {/* messages (newest at the bottom, older ones scroll off the top) */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "0 20px 10px",
            }}
          >
            <Expand p={grow(e.customerAsk)}>
              <ChatBubble side="customer" fontSize={FONT} pop={pop(e.customerAsk)}>
                {chatScript.customerAsk}
              </ChatBubble>
            </Expand>
            <Expand p={typing(e.typing1, e.assistantReply)}>
              <ChatBubble side="assistant" fontSize={FONT}>
                <TypingIndicator />
              </ChatBubble>
            </Expand>
            <Expand p={grow(e.assistantReply)}>
              <ChatBubble side="assistant" fontSize={FONT} pop={pop(e.assistantReply)}>
                {assistantHeader}
                {chatScript.assistantReply(price)}
              </ChatBubble>
            </Expand>
            <Expand p={grow(e.productCard)}>
              <div style={{ padding: "6px 0", opacity: pop(e.productCard), scale: `${0.9 + 0.1 * pop(e.productCard)}`, transformOrigin: "0 100%" }}>
                <ProductCard product={product} detail={t.productCardCta} width={320} />
              </div>
            </Expand>
            <Expand p={grow(e.customerBuy)}>
              <ChatBubble side="customer" fontSize={FONT} pop={pop(e.customerBuy)}>
                {chatScript.customerBuy}
              </ChatBubble>
            </Expand>
            <Expand p={typing(e.typing2, e.assistantAskAddress)}>
              <ChatBubble side="assistant" fontSize={FONT}>
                <TypingIndicator />
              </ChatBubble>
            </Expand>
            <Expand p={grow(e.assistantAskAddress)}>
              <ChatBubble side="assistant" fontSize={FONT} pop={pop(e.assistantAskAddress)}>
                {assistantHeader}
                {chatScript.assistantAskAddress}
              </ChatBubble>
            </Expand>
            {/* address bubble collapses into a privacy-friendly chip */}
            <Expand p={grow(e.customerAddress) * (1 - collapse)}>
              <ChatBubble side="customer" fontSize={FONT} pop={pop(e.customerAddress) * (1 - collapse)}>
                {chatScript.customerAddress.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </ChatBubble>
            </Expand>
            <Expand p={chipP}>
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
                <StatusBadge label={t.deliveryReceived} tone="accent" size={22} icon={<CheckIcon size={22} />} style={{ opacity: chipP }} />
              </div>
            </Expand>
          </div>

          {/* input bar */}
          <div style={{ padding: "12px 20px 26px", background: brand.colors.card, borderTop: `1px solid ${brand.colors.divider}` }}>
            <div
              style={{
                padding: "14px 20px",
                borderRadius: brand.radii.pill,
                background: brand.colors.surface,
                border: `1px solid ${brand.colors.border}`,
                fontSize: 22,
                color: brand.colors.textSubtle,
              }}
            >
              {t.inputPlaceholder}
            </div>
          </div>
        </PhoneMockup>
      </div>

      {/* floating note: inventory check */}
      <div
        style={{
          position: "absolute",
          left: 610,
          top: 300,
          width: 410,
          opacity: Math.min(1, invP),
          translate: `${(1 - invP) * 60}px ${float(frame, 5, 4.4)}px`,
        }}
      >
        <FloatingNote icon={<BoxIcon size={24} />} title={t.inventoryNoteTitle} highlight={invGlow}>
          {invDone ? (
            <>
              <div style={{ fontSize: 25, fontWeight: 700 }}>{product.name}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                <span style={{ fontSize: 23, color: brand.colors.textMuted, fontWeight: 500 }}>
                  {content.orderApproval.sizeLabel} {line.size}
                </span>
                <StatusBadge
                  label={t.inventoryInStock(stockFor(line.productId, line.size))}
                  tone="accent"
                  size={21}
                  icon={<CheckIcon size={20} />}
                />
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 23, color: brand.colors.textMuted }}>
              <TypingIndicator size={9} /> {t.inventoryChecking}
            </div>
          )}
        </FloatingNote>
      </div>

      {/* floating note: order draft */}
      <div
        style={{
          position: "absolute",
          left: 610,
          top: 640,
          width: 410,
          opacity: Math.min(1, orderP),
          translate: `${(1 - orderP) * 60}px ${float(frame, 5, 4.4, 2)}px`,
        }}
      >
        <FloatingNote icon={<DocIcon size={24} />} title={t.orderNoteTitle} highlight={orderGlow}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.25 }}>
              {line.qty} × {product.name}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{formatCurrency(line.lineTotalMinor)}</div>
          </div>
          <div style={{ fontSize: 22, color: brand.colors.textMuted, marginTop: 4 }}>
            {content.orderApproval.sizeLabel} {line.size} · #{order.id}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
              paddingTop: 14,
              borderTop: `1px solid ${brand.colors.divider}`,
              fontSize: 22,
            }}
          >
            <span style={{ color: brand.colors.textMuted }}>{t.deliveryRowLabel}</span>
            {orderUpdated ? (
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: brand.colors.accentDark, fontWeight: 700 }}>
                <CheckIcon size={20} /> {t.deliveryAdded}
              </span>
            ) : (
              <span style={{ color: brand.colors.textSubtle }}>{t.deliveryWaiting}</span>
            )}
          </div>
          <div style={{ marginTop: 16 }}>
            <StatusBadge label={t.orderNoteDraft} tone="warning" size={20} />
          </div>
        </FloatingNote>
      </div>
    </SceneFrame>
  );
};
