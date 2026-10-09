import type { ChannelId } from "../config/brand";
import { conversations, order, storyEvents, type Handling } from "../data/demo";

/** Dashboard counts, calculated from the sample data (scene 6). */
export type DashboardCounts = {
  open: number;
  ai: number;
  human: number;
  ordersApproved: number;
};

const handlingAfter = (id: string, handling: Handling): Handling =>
  storyEvents.takenOverConversationIds.includes(id) ? "human" : handling;

const countFor = (after: boolean): DashboardCounts => {
  const list = conversations.map((c) => ({
    ...c,
    handling: after ? handlingAfter(c.id, c.handling) : c.handling,
  }));
  const allOrders = [order];
  return {
    open: list.length,
    ai: list.filter((c) => c.handling === "ai").length,
    human: list.filter((c) => c.handling === "human").length,
    ordersApproved: after
      ? allOrders.filter((o) => storyEvents.approvedOrderIds.includes(o.id))
          .length
      : 0,
  };
};

/** Before scenes 4–5 and after them. */
export const countsBefore = countFor(false);
export const countsAfter = countFor(true);

export const channelBreakdown = (Object.keys({
  instagram: 0,
  whatsapp: 0,
  messenger: 0,
}) as ChannelId[]).map((channel) => ({
  channel,
  count: conversations.filter((c) => c.channel === channel).length,
}));
