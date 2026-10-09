# CLAUDE.md — conventions for agents working on this repo

Remotion (React + TypeScript) project that renders a 60 s, 1080×1350, 30 fps
concept product demo ("ProductDemo") for the fictional product InboxPilot and
fictional merchant Northline Apparel.

## Golden rules

1. **Config is the single source of truth.** Components read from
   `src/config/*` and `src/data/demo.ts`; never duplicate a name, colour,
   price, string or timing inside a component.
   - `brand.ts` names/colours/fonts/logo/radii/shadows. Accent shades are
     derived from `colors.accent` via `deriveAccentPalette` — don't hard-code teal.
   - `content.ts` all on-screen UI text.
   - `timing.ts` scene lengths (seconds) → derived `scenes[id].from/durationInFrames`
     and `totalFrames`; `events` are seconds *relative to the scene start*.
   - `video.ts` id, size, fps, locale, currency (formatting only).
   - `audio.ts` audio files + volumes.
   - `data/demo.ts` customers, chats, products, stock, order. Money is in
     **minor units**. Totals live in `lib/orders.ts`; dashboard counts in
     `lib/stats.ts` (derived from data + `storyEvents`). Never type a total.
2. **Frame-driven animation only.** Use `useCurrentFrame()` + helpers in
   `src/lib/timeline.ts` (`progress`, `springAt`, `smoothAt`, `float`).
   No CSS transitions/animations, `setTimeout`, `Date.now()` or `Math.random()`.
   Prefer CSS `translate`/`scale`/`rotate` properties over `transform` strings.
3. **Scenes never overlap.** `ProductDemo` plays them in a `<Series>`; the
   total must equal the sum of `sceneSeconds` (currently 60 s). Hand-offs
   between scenes share positions via `src/lib/layout.ts`.
4. **Content rules:** English only, fictional data only, no invented
   testimonials, results, metrics or partnerships. Keep the
   "Concept demo • Sample data" label (`ConceptLabel`) visible at all times.
   Never show payment collected or an order shipped.
5. **Readability:** on-screen text ≥ ~20 px at 1080 wide; keep key content
   ≥ 60–80 px from the edges.
6. **Audio is optional.** `SoundTrack` checks `getStaticFiles()` and skips
   missing files. Voiceover plays only when `public/audio/voiceover.mp3` exists.
   Regenerate music/SFX with `npm run audio` (deterministic).
7. **Don't overwrite user edits** without asking; `out/` and `references/` are
   git-ignored local folders.

## Verify before committing

```bash
npm run typecheck && npm run lint
npm run render:preview          # then inspect frames (e.g. ffmpeg -ss <t> -frames:v 1)
npm run still                   # approved order frame
```
If Chrome can't be downloaded, set `REMOTION_BROWSER_EXECUTABLE` (see
`remotion.config.ts`) or pass `--browser-executable`. Only report a render as
successful if the output file exists.

## Remotion skills

Official Remotion agent skills are installed locally in `.agents/skills`
(symlinked into `.claude/skills`, pinned by `skills-lock.json`). Load
`remotion-best-practices` before non-trivial Remotion work. Keep all
`remotion` / `@remotion/*` packages on the **same exact version**
(`npx remotion versions`; upgrade with `npx remotion upgrade`).
