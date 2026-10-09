/**
 * All fictional sample data: customers, conversations, chat script, products,
 * stock and the order. Nothing here is real.
 *
 * Money is stored in MINOR UNITS (cents/pence): 4900 = 49.00.
 * Totals and dashboard counts are CALCULATED in src/lib/orders.ts and
 * src/lib/stats.ts — don't hard-code them anywhere else.
 */
import type { ChannelId } from "../config/brand";

export const channels: Record<ChannelId, { name: string }> = {
  messenger: { name: "Messenger" },
  whatsapp: { name: "WhatsApp" },
  instagram: { name: "Instagram" },
};

export type Handling = "ai" | "human";

export type Product = {
  id: string;
  name: string;
  priceMinor: number;
  image: string; // file inside public/
  stock: Record<string, number>; // size → units
};

export const products = {
  navyHoodie: {
    id: "navyHoodie",
    name: "Navy Everyday Hoodie",
    priceMinor: 4900,
    image: "images/navy-hoodie.svg",
    stock: { S: 3, M: 5, L: 6, XL: 2 },
  },
} satisfies Record<string, Product>;

/** Flat delivery fee for the sample order. */
export const deliveryFeeMinor = 500;

export type Conversation = {
  id: string;
  customer: string;
  initials: string;
  channel: ChannelId;
  preview: string;
  time: string;
  handling: Handling;
  unread: number;
};

/** Every open conversation in the sample inbox (initial state, before scenes 4–5). */
export const conversations: Conversation[] = [
  { id: "jordan", customer: "Jordan Lee", initials: "JL", channel: "instagram", preview: "Do you have the navy hoodie in large?", time: "now", handling: "ai", unread: 1 },
  { id: "maya", customer: "Maya Torres", initials: "MT", channel: "messenger", preview: "Is this available in medium?", time: "1m", handling: "ai", unread: 1 },
  { id: "sam", customer: "Sam Okafor", initials: "SO", channel: "whatsapp", preview: "How much is delivery?", time: "2m", handling: "ai", unread: 1 },
  { id: "priya", customer: "Priya Nair", initials: "PN", channel: "instagram", preview: "Can I place an order?", time: "3m", handling: "ai", unread: 1 },
  { id: "alex", customer: "Alex Kim", initials: "AK", channel: "messenger", preview: "Question about a return", time: "6m", handling: "ai", unread: 0 },
  { id: "lena", customer: "Lena Fischer", initials: "LF", channel: "whatsapp", preview: "Does the parka run large?", time: "9m", handling: "ai", unread: 0 },
  { id: "omar", customer: "Omar Haddad", initials: "OH", channel: "instagram", preview: "When do beanies restock?", time: "14m", handling: "human", unread: 0 },
  { id: "ruth", customer: "Ruth Mensah", initials: "RM", channel: "whatsapp", preview: "Can I change my address?", time: "21m", handling: "ai", unread: 0 },
];

/** Scene 1 cards → these conversations (in order). */
export const problemCardIds = ["maya", "sam", "priya"] as const;

/** Conversation selected in scene 2 and shown on the phone in scene 3. */
export const featuredConversationId = "jordan";

/** Customer panel details for the featured customer (scene 2). */
export const featuredCustomer = {
  pastOrders: 2,
  interestedIn: products.navyHoodie.name,
  note: "Prefers Instagram",
};

/** Scene 3 chat script. `from`: who sent it. Timing lives in src/config/timing.ts. */
export const chatScript = {
  customerAsk: "Do you have the navy hoodie in large?",
  assistantReply: (price: string) => `Yes—size L is available. It's ${price}.`,
  customerBuy: "I'll take one.",
  assistantAskAddress: "Great. Where should we send it?",
  customerAddress: ["Jordan Lee", "18 Alder Row, Apt 4", "Riverton 40210"],
};

/** The order drafted from the scene-3 chat. Status changes in scene 4. */
export const order = {
  id: "NL-1042",
  conversationId: featuredConversationId,
  lines: [{ productId: "navyHoodie" as const, size: "L", qty: 1 }],
  deliveryFeeMinor,
};

/** Scene 5: the conversation that needs a human. */
export const takeoverConversationId = "alex";
export const takeoverMessage = "Can you make an exception to your return policy?";
/** Earlier messages shown above it for context. */
export const takeoverContext: { side: "customer" | "assistant"; text: string }[] = [
  { side: "customer", text: "Hi! My jacket arrived but the colour isn't right for me." },
  { side: "assistant", text: "Sorry to hear that! Returns are accepted within 30 days." },
];

/**
 * What happens during the video. src/lib/stats.ts applies these to
 * `conversations` to get the "after" dashboard counts for scene 6.
 */
export const storyEvents = {
  approvedOrderIds: [order.id],
  takenOverConversationIds: [takeoverConversationId],
};
