# Master Prompt — paste this to Antigravity as your opening message

---

I'm building the official website for **Abhiyantriki**, the annual technical fest of K. J. Somaiya School of Engineering (KJSSE), run by the Students' Council. This is a real, high-profile college fest — it hosts all three Indian armed forces branches, ISRO, BARC, IMD, an Auto Expo, robotics/humanoid exhibits, hackathons, and a distinguished lecture series that's hosted names like Dr. APJ Abdul Kalam and the Dalai Lama. The site needs to feel cinematic and high-production, not like a generic college club page.

I've prepared a full spec pack in the `spec/` folder of this project. **Before writing any code, read every file in `spec/` in this order** — they contain the actual design direction, tech decisions, real content (pulled from our sponsorship brochures), asset inventory, animation choreography, and backend/security requirements. Don't invent content or architecture decisions that contradict what's in these files:

1. `spec/00-INDEX.md` — overview and known gaps
2. `spec/02-CREATIVE-DIRECTION.md` — the visual/tonal direction and why
3. `spec/03-TECH-STACK-ARCHITECTURE.md` — exact stack to use
4. `spec/04-DESIGN-SYSTEM-COLOR-TYPE.md` — color/type/motion tokens
5. `spec/05-SITE-MAP-CONTENT.md` — every section and its real copy/content
6. `spec/06-3D-ASSETS-SCENE-PLAN.md` — what the 3D models actually are and where they go
7. `spec/07-SCROLL-LOADER-ANIMATION-SPEC.md` — the Pacman loader + full scroll choreography, section by section
8. `spec/08-AUTH-BACKEND-DATABASE.md` — auth, roles, and DB schema
9. `spec/09-ADMIN-CMS-GOOGLE-FORMS.md` — admin panel + Google Forms embedding
10. `spec/10-SECURITY-CHECKLIST.md` — security requirements, non-negotiable before launch
11. `spec/11-FOLDER-STRUCTURE-ASSET-MANIFEST.md` — exact repo layout and asset prep steps

## Assets provided alongside this spec

All assets live under `C:\STUCO\Website\` — full real tree and target destinations mapped in `11-FOLDER-STRUCTURE-ASSET-MANIFEST.md`. Summary:

- `3d Models\` — 8 ready `.glb` models: space warp/vortex rig, brain hologram, gears, manual transmission gearbox, a space/nebula environment asset (`need_some_space`), Pacman, Ghost (Inky), an astronaut character (`space_boi`), and a detailed sports bike for Auto Expo. Full usage mapping in `06-3D-ASSETS-SCENE-PLAN.md`.
- `Pac man\` (inside `3d Models`) + the separately cloned `pacman\` repo (`github.com/daleharvey/pacman.git`) — real arcade sound effects and a reference 2D canvas Pacman implementation for the loader.
- `Abyantriki Documents\` — the two brochure PDFs, already parsed into `05-SITE-MAP-CONTENT.md`.
- `Logos-20260911T093437Z-1-001\Logos\logos\` — real logo files; use `abhiyantriki.png`/`abhi.png` as the site logo, `KJSSE.png`/`KJSCE.svg`/Somaiya Trust marks for institutional footer co-branding only.
- `Inspo\` — reference screenshots (gustavobatista.dev + the two color palette boards), already distilled into `02-CREATIVE-DIRECTION.md` and `04-DESIGN-SYSTEM-COLOR-TYPE.md`.
- `Council\` — an existing, separate council website. **Do not touch or merge this** unless explicitly told to; Abhiyantriki builds as its own standalone project. See the open question in `00-INDEX.md`.
- Reference site for scroll/motion feel: **gustavobatista.dev** — study its pinned-section, scroll-driven 3D storytelling pattern, but do not copy its layout; our sitemap is richer (see `05-SITE-MAP-CONTENT.md`).
- Still missing, genuinely (not a placeholder problem, just not ready yet): Google Form URLs (event hasn't launched registration yet) and confirmed final dates/General Secretary name. Build the fields to accept these later; don't block on them.

## What to build, in order

**Phase 1 — Foundation**
- Scaffold the Vite + React + Tailwind + TypeScript project per `03-TECH-STACK-ARCHITECTURE.md` and `11-FOLDER-STRUCTURE-ASSET-MANIFEST.md`.
- Set up the Tailwind theme with the tokens from `04-DESIGN-SYSTEM-COLOR-TYPE.md`.
- Run the asset pre-processing steps in `11-FOLDER-STRUCTURE-ASSET-MANIFEST.md` (convert/compress the two `.gltf` files to `.glb`).

**Phase 2 — Loader + Hero**
- Build the Pacman loading sequence exactly per `07-SCROLL-LOADER-ANIMATION-SPEC.md` Part A, including the real-progress tie-in, skip control, and reduced-motion fallback.
- Build the Hero section (Part B, row 1 of the table).

**Phase 3 — Main scroll experience**
- Build each remaining pinned section from the choreography table in `07-SCROLL-LOADER-ANIMATION-SPEC.md`, using the real content from `05-SITE-MAP-CONTENT.md`.
- Implement the mobile/`matchMedia` fallback behavior described there — this is required, not optional polish.
- Implement the reduced-motion and low-end-device static fallback path from `03-TECH-STACK-ARCHITECTURE.md`.

**Phase 4 — Functional layer**
- Set up Supabase project, apply the schema from `08-AUTH-BACKEND-DATABASE.md`, implement RLS policies.
- Build login/register, the student dashboard, and the native event registration flow.
- Build the Google Form embed component and wire `events.google_form_url` as described in `09-ADMIN-CMS-GOOGLE-FORMS.md`.
- Build the `/admin` panel (events manager, gallery manager, registrants view, admin users) per the same file.

**Phase 5 — Hardening**
- Work through every item in `10-SECURITY-CHECKLIST.md` and report back on each one — don't mark anything done without actually verifying it (e.g. actually test that student A can't read student B's registration via a direct API call).

## Ground rules

- Where a spec file marks something `[NEED]` (unconfirmed dates, General Secretary name, Google Form URLs, the `space_boi` mascot decision, the Council-site relationship), **do not guess** — build with a clearly-labeled placeholder and tell me explicitly what you need from me.
- Prioritize the site working well and fast on a mid-range Android phone on campus wifi over maximal visual fidelity — the registration flow is the actual job-to-be-done during fest week; the 3D scroll experience is what gets people excited beforehand.
- Ask me before making any architecture decision not already covered in these files (e.g. if you think Next.js is actually better than Vite for a reason not addressed in `03-TECH-STACK-ARCHITECTURE.md`, raise it — don't silently switch).

Start with Phase 1 and show me the scaffolded structure before moving to Phase 2.
