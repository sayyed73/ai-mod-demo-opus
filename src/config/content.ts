/**
 * All on-screen UI text (headlines, labels, buttons).
 * Customer names, chat messages, products and prices live in src/data/demo.ts.
 * ✏️ Edit wording here; keep lines short so they fit at 1080 px wide.
 * Use "\n" in a headline to force a line break.
 */
import { brand } from "./brand";

export const content = {
  conceptLabel: "Concept demo • Sample data",

  problem: {
    headline: "Great products.\nToo many messages.",
    unreadLabel: "unread",
    pingLabel: "New message",
  },

  unifiedInbox: {
    headline: "Every conversation.\nOne workspace.",
    searchPlaceholder: "Search conversations",
    allChannels: "All channels",
    listTitle: "Inbox",
    customerPanelTitle: "Customer",
    pastOrdersLabel: "Past orders",
    channelLabel: "Channel",
    interestedInLabel: "Interested in",
    handledByAi: "AI assisting",
  },

  conversation: {
    shopHeaderStatus: "Instagram chat",
    assistantLabel: `${brand.productName} assistant`,
    deliveryRowLabel: "Delivery details",
    deliveryWaiting: "Waiting…",
    inventoryNoteTitle: "Inventory check",
    inventoryChecking: "Checking stock…",
    inventoryInStock: (n: number) => `${n} in stock`,
    orderNoteTitle: "Order draft",
    orderNoteDraft: "Draft — awaiting approval",
    deliveryReceived: "Delivery details received",
    deliveryAdded: "Added",
    productCardCta: "Size L • In stock",
    inputPlaceholder: "Message…",
  },

  orderApproval: {
    headline: "From conversation\nto order.",
    subhead: "You approve before it moves forward.",
    cardTitle: "Order draft",
    draftedFrom: (channel: string) => `Drafted by AI from ${channel} chat`,
    sizeLabel: "Size",
    qtyLabel: "Qty",
    itemLabel: "Item",
    deliveryLabel: "Delivery",
    totalLabel: "Total",
    deliveryDetails: "Delivery details on file",
    pending: "Pending approval",
    approved: "Approved",
    approveButton: "Approve order",
    approvedButton: "Order approved",
    editButton: "Edit",
    approvedBy: "Approved by your team",
  },

  humanTakeover: {
    headline: "Automation,\nwith you in control.",
    aiHandling: "AI handling",
    humanHandling: "Human handling",
    needsAttention: "Needs your attention",
    needsAttentionReason: "Policy exception request — a person should decide.",
    takeOverButton: "Take over",
    pausedTitle: "Automated replies paused",
    pausedBody: "You're handling this conversation.",
    aiRepliesToggle: "AI replies",
    composerAi: "AI is drafting replies…",
    composerHuman: `Reply as ${brand.merchantName}…`,
  },

  overview: {
    headline: "A clear view of\nevery conversation.",
    tiles: {
      open: "Open conversations",
      ai: "AI handling",
      human: "Human handling",
      ordersApproved: "Orders approved",
    },
    channelsTitle: "Open conversations by channel",
    updatedLabel: "Updated",
  },

  closing: {
    headline: "More time for\nyour business.",
    subhead: "AI-assisted conversations.\nHuman-controlled orders.",
    footer: "Product concept • Prototype demonstration",
  },
} as const;
