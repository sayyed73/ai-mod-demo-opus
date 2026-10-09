# Editing guide

Everything you'd normally want to change lives in a handful of config files.
After any change: preview with `npm run dev`, then re-render.

> **The exported MP4 does not update from code changes.** `out/inboxpilot-demo.mp4`
> is a file rendered at one moment in time. After editing code, run
> `npm run render` again (and `npm run still` for the PNG).

## Change the accent colour
`src/config/brand.ts` → `BASE.accent` (e.g. `"#3F51B5"`).
Tint, dark shade, outlines and glows are derived from it
(`deriveAccentPalette` in `src/lib/color.ts`), and the built-in logo is
recoloured too. Background and text: `BASE.background`, `BASE.text`.

## Rename the product or merchant
`src/config/brand.ts` → `BASE.productName`, `BASE.merchantName`.
Wording that mentions them (e.g. "Reply as …") is built from these in
`src/config/content.ts`. Check long names still fit (preview scene 2's top bar
and scene 3's phone header).

## Replace the logo
- Quick: put your file in `public/logos/` and set
  `brand.logo.customSrc = "logos/your-logo.svg"` in `src/config/brand.ts`
  (square artwork works best).
- Or edit the SVG paths in `src/components/Logo.tsx` (the built-in mark).
  `public/logos/inboxpilot-mark.svg` is a static copy for use elsewhere.

## Replace the product image
Drop an image in `public/images/` and set `image` on the product in
`src/data/demo.ts` (e.g. `"images/my-hoodie.png"`). Transparent PNG/SVG
looks best on the tinted background.

## Edit the chat
`src/data/demo.ts`:
- `chatScript` — scene-3 phone messages (the assistant reply builds the price
  from the product, so it stays correct).
- `conversations` — inbox rows (scenes 1, 2, 6, 7). Scene 1 shows the ids in
  `problemCardIds`; scene 2 selects `featuredConversationId`.
- `takeoverMessage` / `takeoverContext` — scene 5.
Headlines, labels and buttons are in `src/config/content.ts` (`"\n"` = line break).
Keep bubbles short; long text pushes older messages off the top of the phone.

## Prices and currency
- Prices are in **minor units** in `src/data/demo.ts`: `priceMinor: 4900` = 49.00,
  `deliveryFeeMinor: 500` = 5.00. Item, delivery and total are calculated
  (`src/lib/orders.ts`) — never type a total.
- Currency symbol/format: `src/config/video.ts` → `currency: "USD" | "EUR" | "GBP"`
  and `locale` (e.g. `"en-GB"`). This only changes formatting, not amounts.
- Stock shown in the inventory note: `stock` on the product.

## Change a scene's length
`src/config/timing.ts` → `sceneSeconds`. Start frames and the total duration
update automatically, and so do sound-effect cues. If you shorten a scene,
pull its `events` earlier so nothing happens after the scene ends. Keep the
sum at 60 if you need exactly 60 s. Re-time `docs/voiceover-script.md` if you
use narration.

## Add narration
1. Record using `docs/voiceover-script.md`.
2. Save as `public/audio/voiceover.mp3` (exact name).
3. Preview/render — it plays automatically and the music ducks. Mute it with
   `audio.voiceover.enabled = false` in `src/config/audio.ts`.
Music/SFX volumes are in the same file; `npm run audio` regenerates the
synthesised tracks (edit chords etc. in `scripts/generate-audio.mjs`).

## Re-render
```bash
npm run typecheck
npm run render:preview   # quick half-size check
npm run render           # final → out/inboxpilot-demo.mp4
npm run still            # → out/approved-order.png
```

## Common errors
| Symptom | Fix |
| --- | --- |
| `Received a status code of 403 while downloading … chrome-headless-shell` | Network blocks the Chrome download. Use an installed browser: `REMOTION_BROWSER_EXECUTABLE=/path/to/chrome npm run render` or `npm run render -- --browser-executable=/path/to/chrome`. |
| `Could not find composition with ID ProductDemo` | The ID comes from `src/config/video.ts` → `id`. If you rename it, update the scripts in `package.json`. |
| Version mismatch warnings | All `remotion` / `@remotion/*` packages must have the same exact version. Run `npx remotion versions`; upgrade together with `npx remotion upgrade`. |
| Text cut off / overlapping | Shorten the string in `content.ts`/`demo.ts`, or add `"\n"` to headlines. Check in Studio at the relevant time. |
| Something animates oddly in render but not in Studio | Don't use CSS transitions, timers or random values — drive everything from `useCurrentFrame()`. |
| No sound | Check files exist in `public/audio/` (run `npm run audio`) and `enabled` flags in `src/config/audio.ts`. Missing files are skipped silently by design. |
| Video still shows old content | You're looking at an old MP4 — re-run `npm run render`. |
| TypeScript errors after editing data | `npm run typecheck` names the file and line; usually a missing field or a typo in an id. |
