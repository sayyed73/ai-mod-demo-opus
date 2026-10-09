/**
 * Scene lengths (seconds) → start frames and total duration are derived.
 * In-scene events are in seconds RELATIVE TO THE SCENE START.
 *
 * ✏️ To lengthen a scene, change its number in `sceneSeconds` (and nudge its
 * events if needed). The composition length updates automatically.
 */
import { video } from "./video";

export const sceneSeconds = {
  problem: 6,
  unifiedInbox: 8,
  conversation: 15,
  orderApproval: 12,
  humanTakeover: 9,
  overview: 6,
  closing: 4,
} as const;

export type SceneId = keyof typeof sceneSeconds;

/** Playback order. */
export const sceneOrder: SceneId[] = [
  "problem",
  "unifiedInbox",
  "conversation",
  "orderApproval",
  "humanTakeover",
  "overview",
  "closing",
];

/** Seconds → frames (rounded to whole frames). */
export const sec = (s: number) => Math.round(s * video.fps);

type SceneTiming = { from: number; durationInFrames: number };

export const scenes = sceneOrder.reduce(
  (acc, id, i) => {
    const prev = i === 0 ? null : acc[sceneOrder[i - 1]];
    const from = prev ? prev.from + prev.durationInFrames : 0;
    acc[id] = { from, durationInFrames: sec(sceneSeconds[id]) };
    return acc;
  },
  {} as Record<SceneId, SceneTiming>,
);

export const totalFrames = sceneOrder.reduce(
  (sum, id) => sum + scenes[id].durationInFrames,
  0,
);

/** In-scene events, seconds from the start of each scene. */
export const events = {
  problem: {
    headline: 0.2,
    cards: [0.9, 1.5, 2.1], // the three customer messages pop in
    notifications: 2.8, // extra unread pings start stacking up
    exit: 5.45, // headline + pings clear; the cards stay for scene 2
  },
  unifiedInbox: {
    headline: 0.1,
    dashboardIn: 0.2,
    cardsFly: 0.5, // scene-1 cards fly into the conversation list
    rowsIn: 1.4,
    cursorIn: 2.2,
    selectClick: 3.2, // cursor clicks the selected conversation
    zoom: 4.8, // zoom to the customer panel
  },
  conversation: {
    phoneIn: 0,
    customerAsk: 0.8,
    typing1: 1.7,
    inventoryNote: 2.0,
    assistantReply: 3.0,
    productCard: 4.1,
    customerBuy: 5.9,
    orderNote: 6.6,
    typing2: 6.8,
    assistantAskAddress: 7.8,
    customerAddress: 9.0,
    addressCollapse: 10.6,
    orderNoteUpdate: 11.0,
  },
  orderApproval: {
    headline: 0.1,
    subhead: 0.6,
    cardIn: 0.9,
    rowsIn: 1.5,
    cursorIn: 4.2,
    approveClick: 6.4,
    approved: 6.6,
  },
  humanTakeover: {
    headline: 0.1,
    panelIn: 0.4,
    customerMsg: 1.2,
    needsAttention: 2.3,
    cursorIn: 3.0,
    takeOverClick: 4.8,
    switched: 5.0,
  },
  overview: {
    headline: 0.1,
    tilesIn: 0.5,
    countChange: 1.8, // tiles roll from "before" to "after" values
    channelsIn: 2.4,
  },
  closing: {
    logoIn: 0.1,
    headline: 0.4,
    subhead: 0.9,
    visualsIn: 0.6,
    footer: 1.4,
  },
} as const;

/** Frame of the approved order (absolute) — used by the `still` script. */
export const approvedOrderFrame =
  scenes.orderApproval.from + sec(events.orderApproval.approved + 2.4);
