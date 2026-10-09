/** Sound-effect cue list, derived from scene timing (absolute frames). */
import type { SfxKind } from "../config/audio";
import { events, scenes, sec, type SceneId } from "../config/timing";

export type SfxCue = { kind: SfxKind; frame: number };

const at = (scene: SceneId, s: number, kind: SfxKind): SfxCue => ({
  kind,
  frame: scenes[scene].from + sec(s),
});

const e = events;

export const sfxCues: SfxCue[] = [
  ...e.problem.cards.map((s) => at("problem", s, "pop")),
  at("unifiedInbox", e.unifiedInbox.selectClick, "click"),
  at("conversation", e.conversation.customerAsk, "pop"),
  at("conversation", e.conversation.assistantReply, "pop"),
  at("conversation", e.conversation.productCard, "pop"),
  at("conversation", e.conversation.customerBuy, "pop"),
  at("conversation", e.conversation.assistantAskAddress, "pop"),
  at("conversation", e.conversation.customerAddress, "pop"),
  at("conversation", e.conversation.addressCollapse, "chime"),
  at("orderApproval", e.orderApproval.approveClick, "click"),
  at("orderApproval", e.orderApproval.approved, "chime"),
  at("humanTakeover", e.humanTakeover.customerMsg, "pop"),
  at("humanTakeover", e.humanTakeover.takeOverClick, "click"),
  at("overview", e.overview.countChange, "chime"),
];
