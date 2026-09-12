# Auth, Backend & Database

## Recommendation: use Supabase rather than hand-rolling auth

For a college fest site, the practical asks are: student accounts, event registration, an admin who can add photos/manage events, and "keep it secure." Rolling custom Express + JWT + password hashing + email verification from scratch is real surface area to get wrong. **Supabase Auth** (built on Postgres + GoTrue) gives you email/password, Google OAuth, email verification, and password reset out of the box, plus Row Level Security (RLS) tied directly to the same Postgres tables storing your event data — one system instead of three. If the council specifically wants full custom control for learning purposes, the schema below still applies 1:1 to a self-rolled Postgres + Prisma + Express setup; just add your own bcrypt + JWT session layer.

## User roles

| Role | Can do |
|---|---|
| `student` (default on signup) | Register for events, view own registrations/tickets, edit own profile |
| `council_admin` | Everything a student can, plus: add/edit/remove events, upload/remove gallery photos, view all registrants + export CSV, add/edit Google Form links |
| `super_admin` | Everything above, plus manage other admins' roles |

## Core schema (Postgres)

```sql
-- users (Supabase auth.users handles core auth; this extends it)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  college text default 'KJSCE',
  roll_number text,
  role text not null default 'student' check (role in ('student','council_admin','super_admin')),
  created_at timestamptz default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,               -- e.g. "RoboWars", "Ideate"
  category text,                     -- e.g. "Robotics", "Defense", "Ideate"
  description text,
  year int not null,                 -- fest edition year
  google_form_url text,              -- external registration form, if used
  registration_open boolean default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  status text default 'confirmed' check (status in ('confirmed','waitlisted','cancelled')),
  registered_at timestamptz default now(),
  unique (event_id, user_id)
);

create table gallery_albums (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  title text not null,               -- e.g. "Abhiyantriki 2024 — Highlights"
  description text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references gallery_albums(id) on delete cascade,
  storage_path text not null,        -- Supabase Storage path, not raw binary
  caption text,
  sort_order int default 0,
  uploaded_by uuid references profiles(id),
  created_at timestamptz default now()
);
```

## Row Level Security policy summary (Supabase)

- `profiles`: a user can read/update only their own row; admins can read all.
- `events`: public can `SELECT` where nothing is restricted (public listing); only `council_admin`/`super_admin` can `INSERT`/`UPDATE`/`DELETE`.
- `registrations`: a user can `INSERT`/`SELECT` only rows matching their own `user_id`; admins can `SELECT` all (for export) but should not be able to silently edit a student's registration without an audit trail — log changes if this is added later.
- `gallery_albums`/`gallery_photos`: public `SELECT`, admin-only write — this is the "add past event photos" feature, gated to council accounts only, never open uploads.

## API surface (if building custom Express instead of using Supabase client directly)

- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `POST /auth/reset-password`
- `GET /events`, `GET /events/:id`, `POST /events` (admin), `PATCH /events/:id` (admin)
- `POST /events/:id/register` (student), `GET /users/me/registrations`
- `GET /gallery/:year`, `POST /gallery/:albumId/photos` (admin, multipart upload)
- `GET /admin/registrants/:eventId/export.csv` (admin only)

## Session handling

- Use httpOnly, Secure, SameSite=Lax cookies for session tokens (Supabase's SSR helper libraries do this correctly out of the box) — **do not** store auth tokens in `localStorage`, which is XSS-exposed.
- Short-lived access token + refresh token rotation (Supabase default: ~1hr access token).
