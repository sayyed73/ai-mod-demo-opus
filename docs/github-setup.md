# Putting this project on GitHub (private)

Setting up the remote and pushing is left to you — the build process did not
create a remote or push anything. When you're ready:

1. On GitHub, create a new **private** repository (no README/licence/.gitignore,
   so it's empty), e.g. `inboxpilot-demo`.
2. Connect and push (replace the placeholder URL with yours):
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/inboxpilot-demo.git
   git branch -M main
   git push -u origin main
   ```
   If `git remote -v` already lists an `origin` (e.g. the folder was cloned from
   GitHub), use `git remote set-url origin <url>` instead of `git remote add`.
3. Check that the repository's visibility shows **Private**.

What is and isn't committed
- Committed: source, config, docs, `package-lock.json`, fonts, SVGs, synthesised
  audio (~5 MB WAV), Remotion agent skills (`.agents/`, `.claude/skills`, `skills-lock.json`).
- Not committed (`.gitignore`): `node_modules/`, `out/` (rendered videos/stills),
  `references/` (your local reference material).

Tips
- Share the rendered MP4 separately (e.g. a release asset or cloud drive) —
  `out/` is intentionally ignored.
- If you add a voiceover, decide whether `public/audio/voiceover.mp3` should
  be committed (it's not ignored by default).
