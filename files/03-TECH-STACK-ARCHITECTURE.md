# Tech Stack & Architecture

## Frontend

- **Framework:** React + Vite (fast dev server, simplest path for a scroll-heavy 3D site; use Next.js only if SSR/SEO for public event pages becomes a priority — see note below).
- **Styling:** Tailwind CSS, with a custom theme extension for the color tokens in `04-DESIGN-SYSTEM-COLOR-TYPE.md`.
- **3D:** `three.js` via `@react-three/fiber` + `@react-three/drei` (loaders, `useGLTF`, camera helpers, `<Html>` for embedding real DOM UI inside 3D scenes).
- **Scroll/animation:** `gsap` + `ScrollTrigger` (+ `ScrollSmoother` if the license fits — it's part of GSAP's paid Club plugin bundle; if avoiding that cost, use `lenis` (open-source smooth-scroll) driving GSAP ScrollTrigger's `scrollerProxy` instead — this combo gets the same "damped cinematic scroll" feel for free).
- **State/data fetching:** React Query (Tanstack Query) for *server* state (events, gallery, registrations, auth session) — plus **Zustand** for *client-only* UI state (active scroll section for sidebar highlighting, loader-complete flag, audio mute toggle, which 3D scene is currently mounted). Keep these two cleanly separated: if it comes from Supabase, it's React Query's job; if it's purely "what is the UI doing right now," it's Zustand's. Zustand is the right choice over Context here specifically because GSAP ScrollTrigger callbacks and R3F `useFrame` loops need to read/write state from outside React's render cycle (`useStore.getState()`) without forcing a re-render on every scroll tick — Context doesn't do this cleanly, plain `useState` even less so.
- **Forms:** `react-hook-form` + `zod` for validation on login/register/registration forms.

### SPA vs SSR note
A pure client-side SPA (Vite) is simplest and fine for the interactive/3D experience. The tradeoff: search engines and link-preview cards (WhatsApp/Instagram shares of "Register for Abhiyantriki") won't see real content unless you add prerendering. If that matters for outreach, either (a) migrate to Next.js later for just the public marketing pages, or (b) use a lightweight prerender step (e.g. `vite-plugin-ssr`/`react-snap`) for the homepage and event pages only, keeping the 3D scroll experience client-rendered. Don't block v1 on this — ship the SPA, revisit if sponsors/press need link previews.

## Backend

- **Runtime:** Node.js + Express (or Fastify) — simple REST API.
- **Database:** PostgreSQL. Recommended path: **Supabase** — gives you Postgres + built-in auth + row-level security + file storage (for gallery photos) in one place, which directly solves "database for users," "add past event photos," and "secure" all at once with far less custom backend code than rolling your own Express+Postgres+S3 stack. If the team wants full control instead, use Postgres + Prisma ORM + a separate object storage bucket (Cloudflare R2 or S3) for images.
- **Auth:** See `08-AUTH-BACKEND-DATABASE.md` in full. Summary: email/password + optional Google OAuth (students already have KJSCE Google accounts — OAuth "Sign in with Google" restricted to `@somaiya.edu`/`@kjsce.somaiya.edu` domains is the single best UX + security win available here).
- **File storage:** Supabase Storage or S3-compatible bucket for event photos and brochure PDFs — never store binary files in Postgres directly.

## Why this stack fits the request specifically

- "3D scroll animation" → R3F + GSAP ScrollTrigger is the standard, best-documented combo for exactly this (pinned 3D scenes driven by scroll progress).
- "Login + register new events + database of users" → Supabase auth + Postgres gives this with minimal custom backend.
- "Host Google Forms" → this needs zero backend work, just an `<iframe>` embed component — see `09-ADMIN-CMS-GOOGLE-FORMS.md`.
- "Secure" → Supabase's row-level security policies + the checklist in `10-SECURITY-CHECKLIST.md` cover the realistic threat surface for a student-fest site (not a bank, but handles real student PII: names, emails, phone numbers).

## Deployment

- **Frontend:** Vercel or Netlify (both have generous free tiers, auto-preview-deploys per PR — useful since multiple council members will likely contribute).
- **Backend/DB:** Supabase's hosted free tier is sufficient for a college fest's traffic volume; upgrade only if the paid-tier limits (500MB DB, 1GB storage) get close during the fest week.
- **Domain:** point the existing KJSSE council domain (or a fest-specific subdomain like `abhiyantriki.kjsce.somaiya.edu` if IT will issue one) at the Vercel deployment.

## Performance budget (important given the 3D content)

- Total 3D model payload (compressed, `.glb` with Draco/Meshopt compression) target: **under 8MB** for the whole site, loaded progressively per section, not all upfront.
- Convert all `.gltf` (JSON + separate bin/textures) to compressed binary `.glb` before shipping — smaller, one file per model, faster parse. Use `gltf-transform` CLI (`gltf-transform optimize input.gltf output.glb --compress draco`).
- Lazy-load each 3D scene only when its section scrolls near viewport (`@react-three/drei`'s `<Preload>` + intersection-based mounting), not all at page load.
- Ship a **static-image fallback path** for low-end devices / reduced-motion users: detect `prefers-reduced-motion` and low-end GPU (or just a "Skip animations" toggle in the nav) and serve a normal scrollable page with static hero images instead of live 3D. This is not optional polish — it's the difference between the registration flow working on a budget Android phone on campus wifi or not.
