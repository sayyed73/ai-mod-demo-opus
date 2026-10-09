# Voiceover script (~60 s)

The current `public/audio/voiceover.mp3` is a 60-second take voiced by the
"Ainsley" preset (Seed Audio 1.0, generated in Higgsfield): one clip per line,
silences trimmed, each placed at the time below. The video plays it from 0:00
and ducks the music automatically (`src/config/audio.ts → voiceover.musicDuck`).
To replace it, export a new 60-second file with the same name; delete the file
(or set `audio.voiceover.enabled = false`) to turn narration off.

| Time | Scene | Line (as recorded) |
| --- | --- | --- |
| 0:00 | 1 · Problem | "Great products. But the messages never stop — on every channel." |
| 0:07 | 2 · Unified inbox | "InboxPilot brings every conversation into one workspace, with the customer's context beside it." |
| 0:15 | 3 · Conversation | "An AI assistant answers sizing questions, checks stock, and collects delivery details — while quietly drafting the order." |
| 0:29.6 | 4 · Order approval | "The order comes to you, total included. Nothing moves forward until you approve it." |
| 0:41.6 | 5 · Human takeover | "When a request needs judgement, it's flagged for you. Take over, and automated replies pause." |
| 0:50.4 | 6 · Overview | "And you see every conversation, by status and by channel." |
| 0:55.4 | 7 · Closing | "InboxPilot. More time for your business." |

Notes
- This is a product **concept** — avoid claims about results, savings or customers.
- Keep it English; if you change scene lengths in `src/config/timing.ts`,
  re-time the lines to match `docs/storyboard.md`.
