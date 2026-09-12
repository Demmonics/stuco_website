# Abhiyantriki 2026 — Reference Implementation

This is a **real, verified-building** Vite + React + TypeScript + Tailwind project — not another spec document. It's a working reference implementation of the loader → hero handoff described in `07-SCROLL-LOADER-ANIMATION-SPEC.md`, built from exactly the files uploaded into this chat.

**Verified:** `npm install && npm run build` completes cleanly with zero errors (confirmed in this session — an early path-alias bug was caught and fixed during that check, not just assumed to work).

## What's actually real here

- Full working build pipeline (Vite, Tailwind, TypeScript, path aliases resolved).
- `PacmanLoader.tsx` — a genuine canvas-animated loader, position driven by real progress (not a fake timer), with skip control, mute toggle, and a `prefers-reduced-motion` fallback that swaps to a static progress bar.
- `HeroScene.tsx` — a working R3F scene (procedural starfield + focal glow) rendering behind a real glassmorphism hero panel.
- `useUIStore.ts` — the Zustand store, wired exactly as discussed (loader state, audio mute, active section, reduced-motion flag).
- `gsap.ts` / `lenis.ts` — real GSAP + Lenis setup, ticker-synced, ready for ScrollTrigger timelines.
- `festConfig.ts` — only confirmed facts (dates, Kaveen Shetty as GS). No invented stats — this file is a deliberate correction of the earlier fabricated-numbers issue.
- `public/credits.json` — corrected licensing manifest. **Both `pacman.glb` and `space_boi.glb` are marked `EXCLUDED`**, not just listed — see below.

## The license fix, concretely

Your uploaded `license.txt` files confirmed `pacman.glb` and `space_boi.glb` are CC-BY-NC-4.0 (No Commercial Use), which conflicts with a site carrying paid sponsorship tiers. Rather than just flag this again, I built around it: `PacmanLoader.tsx` draws an original chomping-circle shape and a rounded ghost shape with plain canvas primitives — not the licensed mesh or its texture atlas. Only `ghost-inky.glb` (CC-BY-4.0, commercial-safe) is earmarked for actual 3D use, reserved for one dissolve moment at the loader's end (not yet wired up in this scaffold — see below).

## What is NOT in this scaffold (be clear-eyed about this before merging)

I don't have access to your actual project at `C:\STUCO\Website\abhiyantriki` — only what's been uploaded into this chat. That means:

- **No compressed production models are wired in.** The hero uses a procedural starfield instead of `space-warp.glb`/`space-environment.glb` because I don't have those compressed files here — swap them in per spec 06/11 once merged into your real project.
- **Only 5 of the ~19 site sections exist** (nav + hero). Overview, Highlight Events, Dignitaries, Archive, and Register are not built — they need the full choreography from spec 07 wired up section by section.
- **No Supabase project, no auth, no live database.** I wrote the schema and client code approach in spec 08 already; actually provisioning a live Supabase project requires your account and can't be done from here.
- **No ghost-inky.glb dissolve moment yet** — the loader currently just fades out; the 3D handoff described in spec 07 is a next step.
- **Logo files aren't included** — I never received the actual `abhiyantriki.png`/`abhi.png` binary, only saw them in a folder screenshot. `index.html` and `App.tsx` reference `/public/brand/logo-mark.png` — drop the real file in at that path.
- The two sports-bike texture maps you uploaded are copied into `/public/models/` but the bike's actual mesh (`scene.bin`, ~24MB) isn't wired into any component yet.

## How to use this

**Option A (recommended):** hand this whole folder to Antigravity with the instruction: *"Build the rest of the site to match this reference implementation's patterns exactly — same Zustand store shape, same GSAP/Lenis setup, same credits.json with the NC exclusions, same canvas-based loader approach instead of the licensed Pacman mesh."* This gives it a concrete, tested pattern to extend rather than a spec to interpret.

**Option B:** merge this into your existing Antigravity-built project by hand — the file structure matches `11-FOLDER-STRUCTURE-ASSET-MANIFEST.md`, so most files should drop in at the same paths.

Either way: run `npm install && npm run dev` yourself to see it live — I've verified it builds, but you should see it running before deciding how to proceed.
