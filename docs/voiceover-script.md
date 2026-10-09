# Voiceover script (~60 s)

Narration is **off** until you add `public/audio/voiceover.mp3`. Record one
continuous 60-second take (or edit to length) that follows the timings below;
the video plays it from 0:00 and ducks the music automatically
(`src/config/audio.ts → voiceover.musicDuck`).

Pace: calm, ~140 words per minute. About 130 words total.

| Time | Scene | Line |
| --- | --- | --- |
| 0:00–0:06 | 1 · Problem | "You make great products. But the questions never stop — on Messenger, WhatsApp and Instagram." |
| 0:06–0:14 | 2 · Unified inbox | "InboxPilot is a concept for bringing every conversation into one workspace, with the customer's context right beside it." |
| 0:14–0:29 | 3 · Conversation | "Here, an AI assistant answers a sizing question, checks stock, shares the product, and collects delivery details — while it quietly drafts the order." |
| 0:29–0:41 | 4 · Order approval | "The draft comes to you. Item, delivery and total are all there. Nothing moves forward until you approve it." |
| 0:41–0:50 | 5 · Human takeover | "When a request needs judgement — like an exception to your return policy — it's flagged for you. Take over, and automated replies pause." |
| 0:50–0:56 | 6 · Overview | "And you get a clear view of every conversation, by status and by channel." |
| 0:56–1:00 | 7 · Closing | "InboxPilot. More time for your business." |

Notes
- This is a product **concept** — avoid claims about results, savings or customers.
- Keep it English; if you change scene lengths in `src/config/timing.ts`,
  re-time the lines to match `docs/storyboard.md`.
