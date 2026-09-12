# 3D Asset Inventory & Scene Plan

## Full confirmed inventory (from your actual asset folder, `C:\STUCO\Website\3d Models`)

All models below were Sketchfab downloads (each has its own `license.txt` — see **Licensing** section at the bottom, this matters).

| Folder | Model | What it is | Site use |
|---|---|---|---|
| `24-dizzying-space-travel-inktober2019` | Space warp/vortex rig (ships both a `.glb` and the raw `Unity2Skfb.gltf`/`scene.gltf` source) | "Dizzy Space" — vortex tunnel + small ship ("Nave") + thruster ("Propulsor") + ~30 speed-line meshes ("Velocidad") | **Section-transition warp effect** + candidate for a first-person "camera rides the ship" conceit through the whole scroll — see `07-SCROLL-LOADER-ANIMATION-SPEC.md` |
| `brain_hologram` | Brain Hologram | Glowing particle-cloud brain | **Ideate / hackathon / robotics section** |
| `gears` | Gears | Mechanical gear assembly | Pairs directly with the brain hologram — your Inspo reference (the "brain + gears" dark portfolio screenshot) does exactly this combo. **Use together** as the visual anchor for the Ideate/engineering section: gears turning inside/behind the glowing brain. |
| `manual_transmission_gear_box` | Gearbox | Detailed mechanical gearbox | Good fit for **Auto Expo** (mechanical engineering flex) or a **"How It's Engineered" / behind-the-scenes** moment — don't stack with `gears` in the same section, pick one mechanical model per section so it doesn't read as clutter |
| `need_some_space` | Space/nebula environment asset | Environmental space scene | Candidate for **Hero background** or **Overview section backdrop** — check what's actually in it (nebula? planet? asteroid field?) before committing; use as ambient environment, not a focal object |
| `Pac man/pacman` | Pacman | The Pacman mesh, textured | **Loader** |
| `Pac man/pacman_ghost_inky` | Ghost (Inky) | Ghost mesh, textured | **Loader** |
| `space_boi` | Space Boi | A stylized astronaut/character | Optional — see note below |
| `sports_bike` | Sports Bike | Detailed motorcycle w/ decals + leather textures | **Auto Expo section** — this closes the gap flagged earlier |

Also present: `Pac man/` folder has **two real sound effect MP3s** (`freesound_community-playing-pac-man-6783.mp3`, `freesound_community-the-pacman-variations-17844.mp3`) plus the full classic audio set inside the cloned `pacman/audio/` repo folder (`eating`, `eatghost`, `eatpill`, `die`, `siren`, `extra lives`, `opening_song`, `intermission` — both `.mp3` and `.ogg` for browser compatibility). **Use these real sounds for the loader** — a muted "arcade" loading screen is a missed opportunity given you have the actual sound assets; just make sure it's user-mutable (small speaker icon toggle) and never autoplays with sound on mobile before a user gesture (browsers block this anyway, but design the UI so a silent-autoplay start doesn't look broken).

## `space_boi` — decision needed, not assumed

The creative direction doc recommended galaxy-over-mascot for the *main* site, keeping character/fun contained to the loader. Now that you actually have a `space_boi` model, here's the real choice:
- **Option A (recommended, matches `02-CREATIVE-DIRECTION.md`):** don't use it on the main scroll experience; keep it in reserve for a 404 page, a "you've reached the bottom" footer easter egg, or social share cards.
- **Option B:** if the council wants a recurring guide character (like a mascot narrating the scroll journey — "follow me through Abhiyantriki"), `space_boi` could ride the ship model from the warp-rig, becoming the throughline character for the whole site. This is a bigger tonal decision (mascot-led vs. cinematic-institutional) — flag it to Antigravity as a decision point, don't let it default silently to either.

## Where the Pacman *game repo* fits (`C:\STUCO\Website\pacman`, cloned from `github.com/daleharvey/pacman.git`)

This is a self-contained 2D Canvas/JS Pacman implementation (`pacman.js`, `index.html`, `modernizr-1.5.min.js`, bitmap font `BD_Cartoon_Shout-webfont.ttf`, full audio set). It confirms the right approach from `07-SCROLL-LOADER-ANIMATION-SPEC.md`: **the loader should be 2D canvas-based, not full 3D** — it needs to render before the heavy WebGL/3D assets even start loading, and the classic look is inherently 2D anyway. Don't try to port this whole game into the loader; instead, extract just the sprite rendering + a couple of sound cues to build the short Pacman-chases-ghost loading sequence. The real `.glb` Pacman and Inky meshes (above) are for the **one 3D "dissolve into vortex" moment** at the end of the loader — everything else in the loader stays 2D/canvas for speed.

## Where each Documents/Logo file actually is

- Brochures: `C:\STUCO\Website\Abyantriki Documents\Abhiyantriki General Proposal.pdf` and `...\Blue and Black Modern Tech Startup Pitch Deck Presentation (1).pdf` — these are the two documents already parsed into `05-SITE-MAP-CONTENT.md`.
- Logos: `C:\STUCO\Website\Logos-20260911T093437Z-1-001\Logos\logos\` — confirmed contents include `abhiyantriki.png` and `abhi.png` (the actual fest wordmark/icon — a red/pink triangular mountain-style mark), `KJSSE.png`, `KJSCE.svg`, `Trust.svg`/`somaiya trust.png`, `Parvaah transparent.png` (a separate KJSCE initiative logo — don't use this one for Abhiyantriki, it belongs to a different program), `red line somaiya (1).png`. **Use `abhiyantriki.png`/`abhi.png` as the primary site logo** — the text-wordmark fallback from earlier drafts of this spec is no longer needed.

## Licensing — action item before shipping

Every Sketchfab-sourced model folder includes its own `license.txt`. Sketchfab's free "Standard" download license generally requires visible attribution (creator name + link) wherever the model is used commercially or publicly, unless the specific model is CC0. **Antigravity should read each `license.txt` file during asset processing and surface a consolidated credits list** — build a simple `/credits` page or footer line ("3D models via Sketchfab — see credits") listing each creator. This is a real compliance step, not optional polish, since the site is a public institutional page, not a private project.

## Technical handling (unchanged from before)

- Convert every model to compressed `.glb` (most already ship as `.glb` per the tree above — use those directly, skip re-conversion; only the two raw `.gltf` source folders inside `24-dizzying-space-travel-inktober2019/source` need the Draco pass if you use the source instead of the pre-exported `.glb`).
- Load via `@react-three/drei`'s `useGLTF`, lazy-mounted per section via intersection observer.
- The `sports_bike` model has real PBR textures (decals, leather normal map) — keep an eye on its file size specifically; motorcycles with detailed textures are often the heaviest asset in a scene like this. Check its compressed size and downscale textures (1K instead of 4K) if it's disproportionately large next to the other models.
- Every model needs a 2D static fallback image for the reduced-motion/low-end path (`03-TECH-STACK-ARCHITECTURE.md`).
