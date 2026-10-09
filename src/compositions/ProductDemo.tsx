import { AbsoluteFill, Series } from "remotion";
import { brand } from "../config/brand";
import { sceneOrder, scenes, type SceneId } from "../config/timing";
import { ConceptLabel } from "../components/ConceptLabel";
import { SoundTrack } from "../components/SoundTrack";
import { ClosingScene } from "../scenes/ClosingScene";
import { ConversationScene } from "../scenes/ConversationScene";
import { HumanTakeoverScene } from "../scenes/HumanTakeoverScene";
import { OrderApprovalScene } from "../scenes/OrderApprovalScene";
import { OverviewScene } from "../scenes/OverviewScene";
import { ProblemScene } from "../scenes/ProblemScene";
import { UnifiedInboxScene } from "../scenes/UnifiedInboxScene";

/** Scene ID → component. Order and length come from src/config/timing.ts. */
export const sceneComponents: Record<SceneId, React.FC> = {
  problem: ProblemScene,
  unifiedInbox: UnifiedInboxScene,
  conversation: ConversationScene,
  orderApproval: OrderApprovalScene,
  humanTakeover: HumanTakeoverScene,
  overview: OverviewScene,
  closing: ClosingScene,
};

/** The full 60-second video: scenes back-to-back (no overlaps) + label + audio. */
export const ProductDemo: React.FC = () => (
  <AbsoluteFill style={{ background: brand.colors.background, fontFamily: brand.fonts.stack }}>
    <Series>
      {sceneOrder.map((id) => {
        const Scene = sceneComponents[id];
        return (
          <Series.Sequence key={id} name={id} durationInFrames={scenes[id].durationInFrames}>
            <Scene />
          </Series.Sequence>
        );
      })}
    </Series>
    <ConceptLabel />
    <SoundTrack />
  </AbsoluteFill>
);

/** A single scene with the concept label, for previewing scenes on their own. */
export const SceneOnly: React.FC<{ scene: SceneId }> = ({ scene }) => {
  const Scene = sceneComponents[scene];
  return (
    <AbsoluteFill style={{ background: brand.colors.background, fontFamily: brand.fonts.stack }}>
      <Scene />
      <ConceptLabel />
    </AbsoluteFill>
  );
};
