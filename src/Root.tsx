import { Composition, Folder, Sequence, Still } from "remotion";
import { approvedOrderFrame, sceneOrder, scenes, totalFrames } from "./config/timing";
import { video } from "./config/video";
import { ProductDemo, SceneOnly } from "./compositions/ProductDemo";
import { loadBrandFonts } from "./lib/fonts";

loadBrandFonts();

/** Scene 4 frozen just after "Approve order" (frame derived from timing.ts). */
const ApprovedOrder: React.FC = () => (
  // A negative `from` shifts the scene's clock forward to the approved moment.
  <Sequence from={-(approvedOrderFrame - scenes.orderApproval.from)}>
    <SceneOnly scene="orderApproval" />
  </Sequence>
);

export const RemotionRoot: React.FC = () => (
  <>
    {/* Main video — render this one. */}
    <Composition
      id={video.id}
      component={ProductDemo}
      durationInFrames={totalFrames}
      fps={video.fps}
      width={video.width}
      height={video.height}
    />

    {/* Still used by `npm run still` (frame derived from timing.ts). */}
    <Still id="ApprovedOrderStill" component={ApprovedOrder} width={video.width} height={video.height} />

    {/* Each scene on its own, handy while editing in Studio. */}
    <Folder name="Scenes">
      {sceneOrder.map((id) => (
        <Composition
          key={id}
          id={`Scene-${id}`}
          component={SceneOnly}
          defaultProps={{ scene: id }}
          durationInFrames={scenes[id].durationInFrames}
          fps={video.fps}
          width={video.width}
          height={video.height}
        />
      ))}
    </Folder>
  </>
);
