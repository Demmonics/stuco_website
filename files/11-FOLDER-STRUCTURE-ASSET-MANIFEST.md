# Folder Structure & Asset Manifest

## Your actual source tree (as provided) — Antigravity should read assets from here

```
C:\STUCO\Website\
├── 3d Models\
│   ├── 24-dizzying-space-travel-inktober2019\   -> space warp/vortex (has ready .glb files)
│   ├── brain_hologram\                           -> brain_hologram.glb
│   ├── gears\                                     -> gears.glb
│   ├── manual_transmission_gear_box\             -> manual_transmission_gear_box.glb
│   ├── need_some_space\                          -> need_some_space.glb
│   ├── Pac man\                                   -> pacman.glb, pacman_ghost_inky.glb + 2 sfx mp3s
│   ├── space_boi\                                -> space_boi.glb
│   └── sports_bike\                              -> sports_bike.glb (Auto Expo model)
├── Abyantriki Documents\
│   ├── Abhiyantriki General Proposal.pdf
│   └── Blue and Black Modern Tech Startup Pitch Deck Presentation (1).pdf
├── Council\                                       -> EXISTING council website (plain HTML/JS) — see note below
│   ├── index.html / about.html / events.html / team.html
│   └── main.js
├── Inspo\                                         -> reference screenshots (gustavobatista.dev + palette refs)
├── Logos-20260911T093437Z-1-001\Logos\logos\      -> abhiyantriki.png, abhi.png, KJSSE.png, KJSCE.svg, etc.
└── pacman\                                        -> cloned github.com/daleharvey/pacman.git (2D canvas game + full audio set)
```

**Important open question — do not let Antigravity guess this:** `C:\STUCO\Website\Council` is an existing, separately-built council website (plain HTML/CSS/JS, not React). Before building starts, decide one of:
1. Abhiyantriki is a **standalone site** on its own domain/subdomain, just linked from the council site's nav (simplest, matches this whole spec pack as written).
2. Abhiyantriki is a **new section inside** the existing council site, meaning the council site itself may need a framework migration (its current stack is plain HTML/JS, not React/Vite) to support the 3D/scroll build.

This spec pack assumes **option 1** throughout (standalone site) since nothing in the original request asked to rebuild the council site. Flag this explicitly to Antigravity so it doesn't try to merge the two codebases on its own initiative.

## Target repo structure (what Antigravity builds)

```
/public
  /models
    space-warp.glb              <- from 24-dizzying-space-travel-inktober2019/*.glb
    brain-hologram.glb          <- from brain_hologram/brain_hologram.glb
    gears.glb                   <- from gears/gears.glb
    gearbox.glb                 <- from manual_transmission_gear_box/manual_transmission_gear_box.glb
    space-environment.glb       <- from need_some_space/need_some_space.glb
    pacman.glb                  <- from Pac man/pacman.glb
    ghost-inky.glb              <- from Pac man/pacman_ghost_inky.glb
    space-boi.glb               <- from space_boi/space_boi.glb (only if Option B from 06 is chosen)
    sports-bike.glb             <- from sports_bike/sports_bike.glb
  /audio
    pacman-eating.mp3/.ogg, pacman-eatghost.mp3/.ogg, pacman-siren.mp3/.ogg, pacman-death.mp3/.ogg,
    pacman-extralife.mp3/.ogg, pacman-intro.mp3/.ogg   <- from pacman/audio/ (cloned repo) + the two
                                                            freesound mp3s in 3d Models/Pac man/
  /brochures
    abhiyantriki-general-proposal.pdf
    abhiyantriki-pitch-deck.pdf
  /brand
    logo.png                    <- Logos/logos/abhiyantriki.png (primary)
    logo-mark.png                <- Logos/logos/abhi.png (icon-only variant, e.g. favicon/loading screen)
    kjsse.png, kjsce.svg, somaiya-trust.svg   <- institutional co-branding, footer only
  /credits.json                  <- generated from each model's license.txt — see 06-3D-ASSETS-SCENE-PLAN.md

/src
  /components
    /three            (SpaceWarp, BrainHologramGears, SportsBike, etc.)
    /ui
    /admin
    /loader           (2D canvas Pacman sequence, using pacman.glb only for the final dissolve moment)
  /pages
  /hooks
  /lib
    supabaseClient.ts
    gsapSetup.ts
  /content
    events.ts
    dignitaries.ts
    sponsors.ts
    archive-years.ts

/server   (only if custom Express backend is chosen over calling Supabase directly from frontend)
```

## Asset prep checklist

1. Most models already ship as ready `.glb` (per the tree) — use those directly; **don't re-export from the raw `.gltf` sources** unless you need to re-compress for size (see per-model notes in `06-3D-ASSETS-SCENE-PLAN.md`, especially `sports_bike`'s textures).
2. Run each `.glb` through `gltf-transform inspect <file>` to check triangle count/texture size before committing to a section — pick the heaviest offender (likely `sports_bike` or the ~30-mesh warp rig) and optimize first.
3. Build the `/credits.json` (or a simple `/credits` page) by reading every `license.txt` in `3d Models/*/` — required before public launch per the licensing note in `06-3D-ASSETS-SCENE-PLAN.md`.
4. Copy only the audio files actually used by the loader sequence into `/public/audio` — no need to bring over the entire cloned Pacman repo's assets, just the specific cues chosen for the loader script.

## Content-as-data principle (unchanged)

Everything in `05-SITE-MAP-CONTENT.md` (dignitary names, sponsor lists, event descriptions, sponsorship tiers) should live in `/src/content/*.ts` as structured data, not hardcoded inside JSX — so council members can update facts without touching animation code, and so the still-open `[NEED]` items (final dates, current General Secretary, Google Form URLs once the event rolls out and forms exist) can be filled in later without a rebuild.
