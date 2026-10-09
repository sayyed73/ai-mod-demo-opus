# InboxPilot — concept product demo (Remotion)

An editable, 60-second animated product-demo video for **InboxPilot**, a *proposed*
AI customer-support / social-commerce inbox for online merchants, shown with the
fictional merchant **Northline Apparel**.

> Concept demo • Sample data. Every name, message, price and number is fictional.
> No real customers, testimonials, results or partnerships are shown or implied.

- **Format:** 1080 × 1350 (4:5), 30 fps, exactly 60 s (1800 frames)
- **Composition ID:** `ProductDemo`
- **Stack:** React + TypeScript + [Remotion](https://www.remotion.dev) 4 (npm, lockfile committed)

## Quick start

```bash
npm install
npm run dev              # open Remotion Studio (live preview)
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Remotion Studio for live editing/preview |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run render:preview` | Fast half-size check → `out/inboxpilot-demo-preview.mp4` |
| `npm run render` | Final H.264 MP4 → `out/inboxpilot-demo.mp4` |
| `npm run still` | PNG of the approved order → `out/approved-order.png` |
| `npm run audio` | Re-synthesise the original music + sound effects |
| `npm run lint` | ESLint + typecheck |

**Chrome:** Remotion downloads its own headless Chrome on first render. If that
download is blocked, point it at an installed Chrome/Chromium:

```bash
REMOTION_BROWSER_EXECUTABLE=/path/to/chrome npm run render
# or: npm run render -- --browser-executable=/path/to/chrome
```

> The MP4 in `out/` is a snapshot. Changing code does **not** update it — re-run
> `npm run render` after edits.

## Scenes

| # | Time | Scene | File |
| --- | --- | --- | --- |
| 1 | 0–6 s | Great products. Too many messages. | `src/scenes/ProblemScene.tsx` |
| 2 | 6–14 s | Every conversation. One workspace. | `src/scenes/UnifiedInboxScene.tsx` |
| 3 | 14–29 s | Phone chat with the AI assistant | `src/scenes/ConversationScene.tsx` |
| 4 | 29–41 s | From conversation to order (approve) | `src/scenes/OrderApprovalScene.tsx` |
| 5 | 41–50 s | Automation, with you in control (take over) | `src/scenes/HumanTakeoverScene.tsx` |
| 6 | 50–56 s | A clear view of every conversation | `src/scenes/OverviewScene.tsx` |
| 7 | 56–60 s | Closing: more time for your business | `src/scenes/ClosingScene.tsx` |

See [docs/storyboard.md](docs/storyboard.md) for the beat-by-beat storyboard.

## Where to edit (start here)

| I want to change… | Edit |
| --- | --- |
| Product/merchant name, colours, fonts, logo | `src/config/brand.ts` |
| Headlines, labels, button text | `src/config/content.ts` |
| Customers, chat lines, products, prices, order | `src/data/demo.ts` |
| Scene lengths, when things happen | `src/config/timing.ts` |
| Size, fps, locale, currency (USD/EUR/GBP) | `src/config/video.ts` |
| Music / SFX / voiceover volumes | `src/config/audio.ts` |

Full how-tos: [docs/editing-guide.md](docs/editing-guide.md).

## Project layout

```
src/
  index.ts, Root.tsx            entry + composition registration
  compositions/ProductDemo.tsx  the 60 s video (scenes in a <Series>)
  config/                       brand, content, timing, video, audio
  data/demo.ts                  all fictional sample data (money in minor units)
  scenes/                       the seven scenes
  components/                   PhoneMockup, DashboardShell, ChatBubble, OrderCard, …
  lib/                          formatCurrency, timeline helpers, order maths, stats
public/
  fonts/   Inter (SIL OFL, see OFL-Inter.txt)
  images/  original product illustration (SVG)
  logos/   original InboxPilot mark (SVG)
  audio/   synthesised music + SFX (add voiceover.mp3 here)
scripts/generate-audio.mjs     original audio synthesiser
docs/                          storyboard, voiceover script, editing + GitHub guides
references/  out/              local only (git-ignored)
```

## Audio

Music and UI sounds (click, pop, chime) are synthesised from scratch by
`scripts/generate-audio.mjs` — no samples or third-party audio. Sound-effect
timing is derived from `src/config/timing.ts`. Narration is off until you add
`public/audio/voiceover.mp3` (script: [docs/voiceover-script.md](docs/voiceover-script.md)).
Missing audio files are skipped, never fatal.

## Licences

- Inter font: SIL Open Font License 1.1 (`public/fonts/OFL-Inter.txt`).
- Remotion has its own licence: free for individuals and small teams; larger
  companies need a company licence — see https://www.remotion.dev/license.

More: [CLAUDE.md](CLAUDE.md) (conventions) · [docs/github-setup.md](docs/github-setup.md).
