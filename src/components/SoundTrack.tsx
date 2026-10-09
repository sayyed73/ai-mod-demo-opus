import { Audio } from "@remotion/media";
import { getStaticFiles, interpolate, Sequence, staticFile } from "remotion";
import { audio } from "../config/audio";
import { totalFrames } from "../config/timing";
import { video } from "../config/video";
import { sfxCues } from "../lib/audioCues";

/** True if a file exists in public/ (missing audio is skipped, never an error). */
const hasFile = (path: string) => getStaticFiles().some((f) => f.name === path);

/** Music bed + timed UI sounds + optional voiceover. */
export const SoundTrack: React.FC = () => {
  // Use the video's own length (not the host composition's, e.g. the 1-frame still).
  const { fps } = video;
  const durationInFrames = totalFrames;
  const hasMusic = audio.music.enabled && hasFile(audio.music.file);
  const hasVoiceover = audio.voiceover.enabled && hasFile(audio.voiceover.file);
  const musicLevel = audio.music.volume * (hasVoiceover ? audio.voiceover.musicDuck : 1);

  return (
    <>
      {hasMusic ? (
        <Audio
          src={staticFile(audio.music.file)}
          loop
          volume={(f) =>
            interpolate(
              f,
              [0, audio.music.fadeInSec * fps, durationInFrames - audio.music.fadeOutSec * fps, durationInFrames - 1],
              [0, musicLevel, musicLevel, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}

      {audio.sfx.enabled
        ? sfxCues
            .filter((cue) => hasFile(audio.sfx.files[cue.kind]))
            .map((cue, i) => (
              <Sequence key={i} from={cue.frame} durationInFrames={2 * fps} layout="none" name={`sfx-${cue.kind}`}>
                <Audio src={staticFile(audio.sfx.files[cue.kind])} volume={audio.sfx.volume[cue.kind]} />
              </Sequence>
            ))
        : null}

      {hasVoiceover ? (
        <Audio src={staticFile(audio.voiceover.file)} volume={audio.voiceover.volume} />
      ) : null}
    </>
  );
};
