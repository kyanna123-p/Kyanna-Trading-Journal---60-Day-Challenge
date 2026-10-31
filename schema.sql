-- Run in Supabase SQL Editor. Authentication: email/password.
create table if not exists public.challenge_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  revision bigint not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.challenge_snapshots enable row level security;
create policy "Owners can read snapshots" on public.challenge_snapshots for select to authenticated using ((select auth.uid()) = user_id);
create policy "Owners can create snapshots" on public.challenge_snapshots for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Owners can update snapshots" on public.challenge_snapshots for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- Store compressed screenshots as private objects in per-user folders.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('challenge-charts','challenge-charts',false,2097152,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy "Owners read charts" on storage.objects for select to authenticated using (bucket_id='challenge-charts' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Owners upload charts" on storage.objects for insert to authenticated with check (bucket_id='challenge-charts' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Owners update charts" on storage.objects for update to authenticated using (bucket_id='challenge-charts' and (storage.foldername(name))[1] = (select auth.uid())::text) with check (bucket_id='challenge-charts' and (storage.foldername(name))[1] = (select auth.uid())::text);
