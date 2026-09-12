# Abhiyantriki Website — Spec Pack Index

This folder is a complete build brief for the Abhiyantriki (KJSSE Students' Council tech fest) website. It's written to be handed to an AI coding agent (Antigravity) along with your asset files.

## How to use this with Antigravity

1. Create a new project folder. Drop in:
   - This entire `spec/` folder
   - Your 3D models: `scene.gltf` (Brain Hologram) and `Unity2Skfb.gltf` (Space Warp/Vortex rig)
   - The two brochure files (PDF or DOCX — "Abhiyantriki 2025 Sponsorship Proposal" and "Abhiyantriki 2026 hybrid deck")
   - The council logo (once you have it exported as SVG/PNG)
2. Open `01-MASTER-AGENT-PROMPT.md` — copy its full contents as your first message to Antigravity. It references every other file in this folder by name, so keep the folder structure intact.
3. Let Antigravity read the other files as it works — don't paste all 12 at once, it'll pull them in as needed because the master prompt tells it to open each file before starting the relevant part of the build.

## File map

| File | What it's for |
|---|---|
| `01-MASTER-AGENT-PROMPT.md` | The actual prompt to give Antigravity. Start here. |
| `02-CREATIVE-DIRECTION.md` | The "why" — mood, references, what NOT to do |
| `03-TECH-STACK-ARCHITECTURE.md` | Framework, libraries, project structure, deployment |
| `04-DESIGN-SYSTEM-COLOR-TYPE.md` | Colors, type, spacing, motion tokens |
| `05-SITE-MAP-CONTENT.md` | Every page/section + real content pulled from your brochures |
| `06-3D-ASSETS-SCENE-PLAN.md` | What each 3D model is, where it's used, what's missing |
| `07-SCROLL-LOADER-ANIMATION-SPEC.md` | Pacman loader + GSAP ScrollTrigger choreography, section by section |
| `08-AUTH-BACKEND-DATABASE.md` | Login/register, schema, session handling |
| `09-ADMIN-CMS-GOOGLE-FORMS.md` | Admin panel for event photos + embedding Google Forms |
| `10-SECURITY-CHECKLIST.md` | Pre-launch security pass |
| `11-FOLDER-STRUCTURE-ASSET-MANIFEST.md` | Exact repo layout, where every asset file goes |

## Status update — asset gaps are now closed

All previously-flagged asset gaps are resolved now that the real `C:\STUCO\Website` tree has been provided: the `sports_bike` model covers Auto Expo, the cloned `daleharvey/pacman` repo + real `.glb` Pacman/Ghost meshes + genuine arcade sound effects cover the loader, and `abhiyantriki.png`/`abhi.png` in the Logos folder is the real site logo (no more text-wordmark fallback needed). Full detail in `06-3D-ASSETS-SCENE-PLAN.md` and `11-FOLDER-STRUCTURE-ASSET-MANIFEST.md`, both updated.

## What's still genuinely open

- **Council-site relationship** — there's an existing, separately-built KJSSE Students' Council website (`C:\STUCO\Website\Council`, plain HTML/JS). This spec pack assumes Abhiyantriki ships as a **standalone site**, just cross-linked from the council site — not merged into it. If that's wrong, say so before Antigravity starts; merging into an existing non-React codebase is a materially different (and bigger) job. See the note in `11-FOLDER-STRUCTURE-ASSET-MANIFEST.md`.
- **Google Form URLs** — the event hasn't rolled out yet, so these don't exist yet. The `events.google_form_url` field and embed component (`09-ADMIN-CMS-GOOGLE-FORMS.md`) are built to accept these whenever they're ready — nothing blocks launch on this, it's just an empty field until then.
- **`space_boi` model** — a real tonal decision (mascot-led site vs. cinematic-institutional), not a technical gap. See the decision callout in `06-3D-ASSETS-SCENE-PLAN.md`.
- **Confirmed 2026 fest dates + current General Secretary name** — the two brochures disagree (2025 doc: Harshika Masand; 2026 doc: Kaveen Shetty). Still flagged as `[NEED]` in `05-SITE-MAP-CONTENT.md`.
- **Model licensing/attribution** — every Sketchfab model folder has a `license.txt`; these need to be read and turned into a visible credits page before public launch. See the Licensing section in `06-3D-ASSETS-SCENE-PLAN.md`.
