# Creative Direction — Abhiyantriki Website

## The one-line concept

**A tech fest site that feels like flying through deep space, with a Pacman-chases-ghost loading sequence as the "ignition" before launch.** Reference for scroll feel and layout rhythm: gustavobatista.dev.

## What "Abhiyantriki" is (so the design serves the content, not the other way round)

Abhiyantriki is KJSSE's flagship two-day annual technical fest (14–15 Oct). It is genuinely unusual for a college fest: it hosts all three Indian armed forces branches, ISRO, BARC, IMD, BDDS, NSG, RAF on campus, alongside an Auto Expo (superbikes/supercars), robotics (humanoids, RoboWars), hackathons, an Ideate problem-statement competition with real industry partners, and a Distinguished Lecture Series that has hosted Dr. APJ Abdul Kalam, the Dalai Lama, Dr. Raghuram Rajan, Zakir Hussain, and others. **This is the design brief's real asset** — the site should feel prestigious and high-stakes, not like a generic college club site. Space/sci-fi is the right register: it echoes ISRO, aerospace, defense tech, and "engineering the future" without being childish.

## Reference site breakdown (gustavobatista.dev) — what to take, what to leave

Take:
- Full-bleed, pinned sections where a 3D scene stays fixed while text/UI panels change around it as you scroll (scroll-driven storytelling, not just parallax decoration).
- Grain/noise texture over dark backgrounds — gives the "deep space" feel cheaply and hides banding in gradients.
- A persistent minimal sidebar/rail: page dots or short nav labels, always visible, low-opacity until hovered.
- Section labels typeset large, thin-weight, letter-spaced (e.g. "S E R V I C E") — use for section headers like "EVENTS", "IDEATE", "DIGNITARIES", "AUTO EXPO".
- Soft glow / bloom on a single focal light source per section (the "star" in their hero) — reuse this trick for planets, engine glow, hologram glow.
- Smooth, slightly slow-damped scroll (lerp/easing on scroll, not raw native scroll) so 3D camera moves feel cinematic, not jumpy.

Leave out / adapt:
- Their site is a personal portfolio — ours needs functional UI on top (login, registration, forms, photo galleries). Every 3D section must have a clear "landing pad" for real UI, not just text.
- Don't copy their exact layout wholesale — this is a fest with 10+ distinct content types (sponsors, dignitaries, past years, tiers, registration), so the structure needs to be richer than a single-page portfolio scroll. Treat gustavobatista.dev as the *feel* reference, not the sitemap.

## Visual world: "galaxy, not space-boy"

Given the content (ISRO, defense, engineering), go with **deep space / nebula / launch** rather than a cartoon "space boy" character — keep the personality in the Pacman loader instead, and let the main site be a more serious sci-fi environment. Think: mission-control, observatory, star-field with a few large soft nebula blooms (not a busy starfield everywhere — 1–2 focal points per section max or it gets visually noisy on scroll).

Where character/fun is allowed: the loading screen (Pacman) and micro-interactions (hover states, button ripples, cursor trail) — keep the main scroll experience cinematic and let the loader carry the personality/humor.

## Color direction

Two palettes were supplied. Recommendation: **use "Arctic Depths" as the primary site palette** (cyan/teal/blue, works as a night-sky/nebula gradient, reads as "tech/space" immediately) and pull **DecorNovaa's yellow (#EEE638) and green (#16F686) in as sparing accent colors** for CTAs, badges, and status indicators (e.g. "Registration Open"), since an all-blue site needs a warm accent to keep buttons from disappearing. Full token values are in `04-DESIGN-SYSTEM-COLOR-TYPE.md`.

## Tone of voice for copy on the site

Confident, factual, a little cinematic in section headers ("TWO DAYS. THREE ARMED FORCES. ONE CAMPUS.") but never breathless marketing fluff — the actual facts (ISRO scientists, the Dalai Lama, live BDDS demos) are impressive enough on their own; let them do the work.

## Things to explicitly avoid

- Don't let the 3D scene or scroll-jank get in the way of the practical stuff: registration flow, photo galleries, and forms must load fast and work perfectly on a slow mobile connection on campus wifi — that's most of the actual traffic on fest days. See `03-TECH-STACK-ARCHITECTURE.md` for the perf/fallback strategy.
- Don't overuse the Pacman ghosts as literal recurring 3D characters throughout the whole site — they belong to the loader. Bleeding a food-collecting arcade game into a page about NSG bomb disposal demos will feel tonally off. Keep Pacman contained to loading/transition moments.
