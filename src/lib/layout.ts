/**
 * Shared on-screen positions (px, 1080×1350 frame) used by more than one
 * scene, so hand-offs between scenes line up exactly.
 */
export const layout = {
  headlineTop: 120,

  /** Scene 1 message cards (scene 2 flies them from here into the inbox). */
  problemCards: [
    { x: 64, y: 430, rotate: -4, width: 520 },
    { x: 496, y: 660, rotate: 3, width: 520 },
    { x: 104, y: 905, rotate: -2, width: 520 },
  ],

  /** Scene 2 dashboard window. */
  inbox: {
    x: 60,
    y: 370,
    width: 960,
    height: 900,
    topBar: 78,
    listHeader: 64,
    rowHeight: 92,
    columns: [380, 330, 250] as [number, number, number],
  },
};
