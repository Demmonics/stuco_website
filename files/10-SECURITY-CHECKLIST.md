# Security Checklist

Realistic threat model for this site: it's not a bank, but it holds real student PII (names, roll numbers, emails, phone numbers) and has an admin panel that can post public content — the two things that matter are **protecting student data** and **preventing unauthorized admin access**. Work through this list before launch, and again before each fest's registration window opens.

## Auth
- [ ] Passwords never stored in plaintext — if not using Supabase Auth, use `bcrypt`/`argon2` with a proper salt round count (bcrypt cost ≥ 12).
- [ ] Session tokens in httpOnly, Secure, SameSite cookies — never `localStorage`.
- [ ] Rate-limit login attempts (e.g. 5 attempts / 15 min per IP+email) to block brute force.
- [ ] Email verification required before an account can register for events (prevents fake/bot registrations).
- [ ] Admin role assignment is never user-editable from the client — only settable server-side/via direct DB action by a `super_admin`.
- [ ] If using Google OAuth, restrict to the college email domain where possible so `/admin` signup surface can't be reached by randoms.

## Authorization
- [ ] Every admin-only route/endpoint checks role **server-side** (RLS policies if Supabase, middleware if custom Express) — never rely on hiding the `/admin` link in the UI as the actual security boundary.
- [ ] A student can only ever read/write their own `registrations` rows — verify this with an actual test: log in as student A, try to fetch/modify student B's registration via direct API call.

## Input handling
- [ ] All form inputs (registration, profile) validated server-side with `zod` or equivalent, not just client-side react-hook-form validation (client validation is UX, not security).
- [ ] File uploads: MIME + size validated server-side, EXIF stripped, files served from a separate storage domain/bucket (never executed as code) — see `09-ADMIN-CMS-GOOGLE-FORMS.md`.
- [ ] Sanitize any user-supplied text that gets rendered back (event descriptions, captions) to prevent stored XSS — React escapes by default, but double-check anywhere `dangerouslySetInnerHTML` might get used for "rich" admin content.

## Infra
- [ ] HTTPS enforced everywhere (Vercel/Netlify do this by default — just confirm no mixed-content warnings from the iframe embeds or 3D asset CDN links).
- [ ] Environment secrets (Supabase service role key, any API keys) never shipped to the client bundle — only the public anon key goes client-side; service role key stays server-side only.
- [ ] `.env` files gitignored; secrets set via hosting platform's environment variable dashboard, not committed.
- [ ] CORS configured to only allow the actual site domain(s), not `*`, on any custom backend endpoints.

## Privacy / data handling
- [ ] Have a one-line privacy note near the registration form (what data is collected, that it's used only for the event) — even informal, it's good practice when collecting phone numbers/roll numbers from minors-adjacent-age students.
- [ ] Decide a data retention plan: do old registration records get deleted after each fest, or kept for historical stats? Document the decision so it's a choice, not an accident.
- [ ] Registrant CSV exports (admin feature) should be downloaded over HTTPS only and not casually shared beyond the people who need them — this is a process note for the council, not just code.

## Before each registration window opens (ops checklist)
- [ ] Load-test or at minimum sanity-check the registration flow under a burst of concurrent submissions (fest registration windows spike hard in the first hour).
- [ ] Confirm rate limits won't accidentally lock out legitimate students hammering "refresh" on a popular event page.
- [ ] Backup the database before the fest week (Supabase has point-in-time recovery on paid tiers — confirm what tier you're on).
