# Design System — Color, Type, Motion Tokens

## Color palette

Primary palette ("Arctic Depths" — from the supplied reference), used for backgrounds, gradients, glows, and the dominant UI chrome:

| Token | Hex | Use |
|---|---|---|
| `--space-950` | `#0A1622` (darker derivative of #193546) | Page background, deepest |
| `--space-900` | `#193546` | Panel backgrounds, cards |
| `--ocean-700` | `#065B98` | Secondary UI, borders, inactive states |
| `--sky-500` | `#1B7FDC` | Primary interactive color — links, active nav, icons |
| `--cyan-400` | `#0DB8D3` | Glow accents, highlight text, hover states |

Accent palette (from "DecorNovaa" — used **sparingly**, for CTAs and status only, never as a base color):

| Token | Hex | Use |
|---|---|---|
| `--signal-yellow` | `#EEE638` | Primary CTA buttons ("Register Now"), warning/deadline badges |
| `--signal-green` | `#16F686` | Success states, "Registration Open," confirmation toasts |
| `--ink-950` | `#151A1F` | Alternate near-black background option for high-contrast sections |
| `--white` | `#FFFFFF` | Primary text on dark backgrounds |

Usage rule: **≥90% of any screen should read as the Arctic Depths blue/teal/navy world.** Yellow and green appear only on interactive elements the user should notice/act on (buttons, badges, live status), never as decorative fills. This keeps CTAs from getting lost in an all-blue scene, which is the main reason to pull in the second palette at all.

## Typography

- **Display/headers:** A geometric or humanist sans with a distinct display cut — reference site uses a serif for its wordmark (elegant, "developer portfolio" register); for Abhiyantriki, prefer a **technical sans** instead (e.g. Space Grotesk, Sora, or Clash Display) — better matches the aerospace/engineering tone than a serif would. Use wide letter-spacing + light/medium weight for section labels (mirrors the reference site's "S E R V I C E" treatment): `letter-spacing: 0.3em; font-weight: 500; text-transform: uppercase;`
- **Body copy:** Inter or IBM Plex Sans — highly legible at small sizes, reads as "technical/institutional" which fits ISRO/defense content.
- **Monospace accents:** JetBrains Mono or Space Mono for small data readouts (dates, countdown timers, coordinates-style flourishes near the 3D scenes) — cheap way to reinforce the sci-fi/mission-control feel without extra 3D work.

## Motion tokens (for GSAP)

- **Scroll damping:** lerp factor `0.08–0.12` (lower = more "floaty"/cinematic, higher = snappier). Start at `0.1`.
- **Section transition duration:** `0.8–1.2s`, ease `power3.inOut` for camera moves; `power2.out` for UI panel fades/slides.
- **Hover micro-interactions:** `0.2–0.3s`, ease `power1.out` — keep these fast; only the big scroll-driven camera moves should feel slow.
- **Reduced motion:** every GSAP timeline must check `window.matchMedia('(prefers-reduced-motion: reduce)')` and fall back to instant/CSS-only transitions.

## UI surface treatment

- Grain/noise overlay (`mix-blend-mode: overlay`, low opacity ~4–6%) across dark backgrounds — cheap, high-impact texture the reference site relies on.
- Glassmorphism cards (`backdrop-blur`, semi-transparent `--space-900` at ~60% opacity, 1px `--ocean-700` border) for any UI panel that sits on top of a 3D scene (login form, event cards, registration modal).
- Single soft radial glow per section, positioned behind the section's focal 3D object (star behind a planet, engine glow behind the ship model, etc.) — don't stack multiple glows in one viewport.
