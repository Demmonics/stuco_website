# Loading Sequence & Scroll Choreography

## Part A — The Pacman Loading Animation

**Concept:** Pacman chasing a ghost (reverse of the usual arcade chase — this is the "attract mode" / power-pellet moment) across a dark screen while assets load in the background. This is the site's one moment of pure personality; keep it short and skippable.

### Behavior spec
1. On first load, show a full-screen dark canvas (matches `--space-950`) with a percentage counter (monospace font, bottom corner).
2. Pacman sprite/mesh enters from the left, animating open/close mouth, chasing a ghost sprite/mesh that flees ahead of it, looping left-to-right across the screen (or in a circular track if using an actual loop shape) while real asset loading happens behind the scenes (GLTF/texture preloads).
3. Progress is **tied to actual load progress**, not a fake timer — use `useProgress` from `@react-three/drei` (tracks real R3F loading manager progress) to drive both the percentage counter and how far Pacman has traveled along the path.
4. On load complete: Pacman "catches" the ghost → both dissolve into particles that get sucked into a point (echoing the vortex model) → hard cut/transition into the hero scene's warp-in.
5. **Skip control:** small "Skip →" text, bottom-right, always visible, for repeat visitors — don't force this every visit. Store a flag (session storage) so the full animation only plays once per session; subsequent page loads within the session get a fast 400ms version.
6. **Reduced motion / slow connection:** if `prefers-reduced-motion` is set, or if load takes >4s (slow connection detection), skip straight to a simple progress bar with a static Pacman icon — don't force a slow device to sit through a janky version of the full animation.
7. Reuse actual assets from the Pacman repo you cloned — point Antigravity at that repo's sprite/model folder so this isn't rebuilt from scratch; likely a simple 2D sprite-sheet approach (CSS/Canvas) is actually *better* here than full 3D — it'll load instantly (it needs to appear before the heavy 3D assets have even started loading) and the classic Pacman look is inherently 2D/pixel-based anyway. Reserve the "particle dissolve into vortex" moment as the one place this loader touches the 3D world.

## Part B — Main Site Scroll Choreography

General rule: each major section = one **pinned** viewport (GSAP ScrollTrigger `pin: true`) where the 3D scene and camera stay fixed in place while scroll progress drives a timeline (camera move, object rotation, UI panel enter/exit) — exactly the reference site's pattern. Sections un-pin and hand off to the next with either a hard cut (vortex warp) or a smooth camera fly-through, per the table below.

| # | Section | 3D behavior on scroll | UI behavior | Transition out |
|---|---|---|---|---|
| 1 | Hero | Camera starts inside/behind the "Nave" ship model as if just exited the Pacman vortex; starfield drifts; fest name + tagline fade in, letter-spaced, reference-site style | CTA: "Enter" / scroll-down indicator (reuse reference site's small pulsing circle) | Warp burst using the Velocidad speed-lines as scroll hits section end |
| 2 | Overview | Camera settles, slow orbit around a simple glowing globe/Earth placeholder (India highlighted) | Partner/sponsor logo strip fades in below mission statement, small badges | Soft crossfade |
| 3 | Highlight Events | Camera flies past a sequence of focal points, one per sub-group (Defense, Robotics, Expos, Ideate) — pin sub-sections individually inside the parent pin (nested ScrollTrigger with `scrub: true`) so each group gets its own scroll "beat" | Cards slide in per sub-group; Brain Hologram model appears specifically during the Ideate beat | Vortex warp again into Dignitaries |
| 4 | Dignitaries | Camera pulls back to reveal a grid/wall of names as if constellations/stars, each label lighting up as it scrolls into center | Names + roles appear as glowing labels, no photos needed if likenesses aren't cleared — text-forward, treat like a "hall of fame" star map | Smooth crossfade |
| 5 | Archive (past years) | Simplify — this section should NOT be another heavy 3D beat; use it as a "breather": a horizontal timeline scrub (2017→2025) with photo galleries, standard DOM-based (see below) | Year selector timeline, photo grid, video embeds | Standard scroll (unpinned) |
| 6 | Register / CTA | Lighter 3D — maybe just the ambient starfield background, no heavy model, since this page needs to be fast and frictionless (forms, login) | Full functional UI: login/register, embedded Google Form, or link to dashboard | End of page / footer |

### Why the Archive section breaks the "every section is a 3D set-piece" rule on purpose
A photo gallery that needs to be scannable, fast, and frequently updated by non-technical council members should **not** be gated behind a heavy 3D experience — this section will be edited most often (new photos added every fest) and viewed most casually (people just want to see photos). Keep it a clean, fast, standard responsive grid with a lightweight timeline scrubber; save the 3D budget for the sections that only need to impress once.

## GSAP setup notes for Antigravity

- Use one master `ScrollTrigger.matchMedia()` block to define two full behavior sets: desktop (full pinned 3D choreography above) and mobile (`<768px`: reduce to simpler scroll-triggered fades/slides, no pinning, static hero image instead of live 3D camera moves — mobile GPUs and battery life make full pinned WebGL scroll risky, and most registration traffic will be mobile).
- Drive smooth scroll via `lenis` synced to `ScrollTrigger.update` on `requestAnimationFrame` (avoids paying for GSAP's commercial `ScrollSmoother` plugin unless the team already has a Club GreenSock license).
- Every pinned section's exit must have a defined `onLeave`/`onEnterBack` cleanup that disposes/pauses off-screen R3F scenes (`frameloop="demand"` or manual pause) — without this, having 6 live 3D scenes mounted at once will tank frame rate on anything but a high-end laptop.
