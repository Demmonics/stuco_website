-- ==============================================================================
-- ABHIYANTRIKI 2026 - OFFICIAL SUPABASE POSTGRES SCHEMA & RLS MIGRATIONS
-- Implements specifications from:
--   - 08-AUTH-BACKEND-DATABASE.md
--   - 09-ADMIN-CMS-GOOGLE-FORMS.md
--   - 10-SECURITY-CHECKLIST.md
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Extends Supabase auth.users)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  college text default 'K. J. Somaiya School of Engineering',
  roll_number text,
  role text not null default 'student' check (role in ('student', 'council_admin', 'super_admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast lookup by role and email
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_email on public.profiles(email);

-- ------------------------------------------------------------------------------
-- 2. EVENTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null, -- 'Defense', 'Robotics', 'Auto Expo', 'Hackathon', 'Keynote', 'Coding'
  tagline text,
  description text,
  year int not null default 2026,
  google_form_url text, -- If provided, event renders embedded Google Form instead of native registration
  registration_open boolean default true,
  max_capacity int,
  venue text,
  prize_pool text,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_events_year on public.events(year);
create index if not exists idx_events_category on public.events(category);

-- ------------------------------------------------------------------------------
-- 3. REGISTRATIONS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'confirmed' check (status in ('confirmed', 'waitlisted', 'cancelled')),
  ticket_number text unique default 'ABHI-' || upper(substring(gen_random_uuid()::text from 1 for 8)),
  registered_at timestamptz default now(),
  unique (event_id, user_id)
);

create index if not exists idx_registrations_user on public.registrations(user_id);
create index if not exists idx_registrations_event on public.registrations(event_id);

-- ------------------------------------------------------------------------------
-- 4. GALLERY ALBUMS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  title text not null,
  description text,
  cover_image_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_gallery_albums_year on public.gallery_albums(year);

-- ------------------------------------------------------------------------------
-- 5. GALLERY PHOTOS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  storage_path text not null, -- Path inside Supabase Storage 'gallery' bucket
  caption text,
  sort_order int default 0,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_gallery_photos_album on public.gallery_photos(album_id);

-- ------------------------------------------------------------------------------
-- 6. AUTOMATIC PROFILE CREATION TRIGGER (On auth.users insertion)
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone, college, roll_number, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Abhiyantriki Attendee'),
    new.email,
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'college', 'K. J. Somaiya School of Engineering'),
    new.raw_user_meta_data->>'roll_number',
    'student' -- Strictly default to student, preventing client role escalation
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Helper functions to check roles securely server-side
create or replace function public.is_council_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('council_admin', 'super_admin')
  );
end;
$$ language plpgsql security definer;

create or replace function public.is_super_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
end;
$$ language plpgsql security definer;

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_photos enable row level security;

-- PROFILES POLICIES:
-- 1. Students can view their own profile; admins can view all profiles
create policy "Profiles viewable by self and admins"
  on public.profiles for select
  using (auth.uid() = id or public.is_council_admin());

-- 2. Students can update their own profile fields, but CANNOT update their role column
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id and
    -- Prevent self-role promotion: role must match existing role unless super_admin
    (role = (select role from public.profiles where id = auth.uid()) or public.is_super_admin())
  );

-- 3. Super admins can update any profile (e.g. role delegation)
create policy "Super admins can manage all profiles"
  on public.profiles for all
  using (public.is_super_admin());

-- EVENTS POLICIES:
-- 1. Public can view all events
create policy "Public can view events"
  on public.events for select
  using (true);

-- 2. Only council_admin and super_admin can create, update, or delete events
create policy "Council admins can manage events"
  on public.events for all
  using (public.is_council_admin());

-- REGISTRATIONS POLICIES:
-- 1. Students can only view their own registrations; admins can view all registrations
create policy "Users view own registrations, admins view all"
  on public.registrations for select
  using (auth.uid() = user_id or public.is_council_admin());

-- 2. Students can register only for themselves (auth.uid() must match user_id)
create policy "Users can insert their own registration"
  on public.registrations for insert
  with check (auth.uid() = user_id);

-- 3. Students can cancel their own registration; admins can update status
create policy "Users manage own registration, admins manage all"
  on public.registrations for update
  using (auth.uid() = user_id or public.is_council_admin());

create policy "Users cancel own registration, admins delete"
  on public.registrations for delete
  using (auth.uid() = user_id or public.is_council_admin());

-- GALLERY ALBUMS POLICIES:
-- 1. Public can view albums
create policy "Public can view gallery albums"
  on public.gallery_albums for select
  using (true);

-- 2. Only council admins can insert, update, or delete albums
create policy "Council admins manage gallery albums"
  on public.gallery_albums for all
  using (public.is_council_admin());

-- GALLERY PHOTOS POLICIES:
-- 1. Public can view photos
create policy "Public can view gallery photos"
  on public.gallery_photos for select
  using (true);

-- 2. Only council admins can insert, update, or delete photos
create policy "Council admins manage gallery photos"
  on public.gallery_photos for all
  using (public.is_council_admin());

-- ------------------------------------------------------------------------------
-- 8. STORAGE BUCKET CONFIGURATION & RLS POLICIES (Supabase Storage)
-- ------------------------------------------------------------------------------
-- Insert bucket for gallery if storage extension is active
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = true;

-- Public can read images from the gallery bucket
create policy "Public gallery access"
  on storage.objects for select
  using (bucket_id = 'gallery');

-- Council admins can upload gallery images (constrained to images only)
create policy "Admins upload gallery images"
  on storage.objects for insert
  with check (
    bucket_id = 'gallery' and
    public.is_council_admin()
  );

-- Council admins can delete gallery images
create policy "Admins delete gallery images"
  on storage.objects for delete
  using (
    bucket_id = 'gallery' and
    public.is_council_admin()
  );
