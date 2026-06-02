create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  created_at timestamptz default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null check (status in ('todo', 'in_progress', 'done')),
  project_id uuid not null references public.projects(id) on delete cascade,
  assigned_to uuid references auth.users(id),
  due_date date,
  created_at timestamptz default now()
);

alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

create policy "Users can view own profile"
on public.users for select
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.users for insert
with check (auth.uid() = id);

create policy "Users can view own projects"
on public.projects for select
using (auth.uid() = owner_id);

create policy "Users can create own projects"
on public.projects for insert
with check (auth.uid() = owner_id);

create policy "Users can update own projects"
on public.projects for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Users can delete own projects"
on public.projects for delete
using (auth.uid() = owner_id);

create policy "Users can view tasks of own projects"
on public.tasks for select
using (
  exists (
    select 1 from public.projects
    where projects.id = tasks.project_id
    and projects.owner_id = auth.uid()
  )
);

create policy "Users can create tasks in own projects"
on public.tasks for insert
with check (
  exists (
    select 1 from public.projects
    where projects.id = tasks.project_id
    and projects.owner_id = auth.uid()
  )
);

create policy "Users can update tasks in own projects"
on public.tasks for update
using (
  exists (
    select 1 from public.projects
    where projects.id = tasks.project_id
    and projects.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.projects
    where projects.id = tasks.project_id
    and projects.owner_id = auth.uid()
  )
);

create policy "Users can delete tasks in own projects"
on public.tasks for delete
using (
  exists (
    select 1 from public.projects
    where projects.id = tasks.project_id
    and projects.owner_id = auth.uid()
  )
);