-- =====================================================================
--  Purja Mandi - Supabase setup
--  Supabase Dashboard > SQL Editor > New query mein poora paste karke
--  "Run" dabayein. Yeh sirf EK baar chalana hai.
-- =====================================================================

-- 1) Parts table ------------------------------------------------------
create table public.parts (
  id          uuid primary key default gen_random_uuid(),
  dealer_id   uuid not null default auth.uid() references auth.users(id) on delete cascade,
  dealer_name text not null check (char_length(dealer_name) <= 60),
  phone       text not null check (char_length(phone) <= 20),
  location    text not null check (char_length(location) <= 80),
  brand       text not null check (char_length(brand) <= 30),
  model       text not null check (char_length(model) <= 40),
  part        text not null check (char_length(part) <= 80),
  price       integer not null check (price > 0 and price <= 10000000),
  photo_url   text,
  sold        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index parts_created_idx on public.parts (created_at desc);
create index parts_dealer_idx  on public.parts (dealer_id);

-- 2) Security (Row Level Security) -----------------------------------
-- Koi bhi parts dekh sakta hai (buyer ko login nahi chahiye).
-- Sirf dealer apne hi parts add / badal / delete kar sakta hai.
alter table public.parts enable row level security;

create policy "Anyone can view parts"
  on public.parts for select
  using (true);

create policy "Dealer can add own parts"
  on public.parts for insert to authenticated
  with check (auth.uid() = dealer_id);

create policy "Dealer can update own parts"
  on public.parts for update to authenticated
  using (auth.uid() = dealer_id)
  with check (auth.uid() = dealer_id);

create policy "Dealer can delete own parts"
  on public.parts for delete to authenticated
  using (auth.uid() = dealer_id);

-- 3) Live updates (Realtime) -----------------------------------------
alter publication supabase_realtime add table public.parts;

-- 4) Photo storage ----------------------------------------------------
-- Public bucket: photo ka link sabko khulta hai.
-- Upload / delete sirf dealer apne folder (uski user id) mein kar sakta hai.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'part-photos', 'part-photos', true, 2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Dealers upload photos to own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'part-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Dealers delete own photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'part-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
