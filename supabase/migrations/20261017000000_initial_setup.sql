create table if not exists public.app_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

alter table public.app_content enable row level security;
alter table public.admin_users enable row level security;

revoke all on table public.admin_users from anon, authenticated;
grant select on table public.app_content to anon, authenticated;
grant insert, update, delete on table public.app_content to authenticated;

drop policy if exists "Shared content is publicly readable" on public.app_content;
create policy "Shared content is publicly readable"
  on public.app_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert shared content" on public.app_content;
create policy "Admins can insert shared content"
  on public.app_content for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update shared content" on public.app_content;
create policy "Admins can update shared content"
  on public.app_content for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete shared content" on public.app_content;
create policy "Admins can delete shared content"
  on public.app_content for delete
  to authenticated
  using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalog-images',
  'catalog-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Catalog images are publicly readable" on storage.objects;
create policy "Catalog images are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'catalog-images');

drop policy if exists "Admins can upload catalog images" on storage.objects;
create policy "Admins can upload catalog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'catalog-images' and public.is_admin());

drop policy if exists "Admins can update catalog images" on storage.objects;
create policy "Admins can update catalog images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'catalog-images' and public.is_admin())
  with check (bucket_id = 'catalog-images' and public.is_admin());

drop policy if exists "Admins can delete catalog images" on storage.objects;
create policy "Admins can delete catalog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'catalog-images' and public.is_admin());

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'app_content'
  ) then
    alter publication supabase_realtime add table public.app_content;
  end if;
end;
$$;

-- Add the existing Supabase Auth account as administrator. Re-running this is safe.
do $$
declare
  admin_id uuid;
begin
  select id
  into admin_id
  from auth.users
  where lower(email) = lower('info.paradiseonthebeach@gmail.com')
  limit 1;

  if admin_id is null then
    raise exception 'No Supabase Auth user found for the administrator email. Create/confirm that account, then run this script again.';
  end if;

  insert into public.admin_users (user_id)
  values (admin_id)
  on conflict (user_id) do nothing;
end;
$$;

notify pgrst, 'reload schema';
