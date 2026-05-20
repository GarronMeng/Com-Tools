-- Supabase/PostgreSQL schema for Health Event Copilot

create extension if not exists pgcrypto;

create table if not exists public.health_events (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  group_name text not null,
  badge text not null,
  icon_key text not null,
  output_title text not null,
  urgency_base integer not null check (urgency_base >= 0 and urgency_base <= 100),
  short_description text not null,
  summary text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.event_playbooks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.health_events(id) on delete cascade,
  next_actions jsonb not null,
  checklist jsonb not null,
  resources jsonb not null,
  follow_up jsonb not null,
  created_at timestamptz not null default now(),
  unique(event_id)
);

create table if not exists public.script_templates (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.health_events(id) on delete cascade,
  tone text not null check (tone in ('warm', 'balanced', 'professional')),
  template text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(event_id, tone)
);

create table if not exists public.client_cases (
  id uuid primary key default gen_random_uuid(),
  advisor_id uuid null,
  client_name text not null,
  event_id uuid not null references public.health_events(id),
  subject text not null,
  age_group text not null,
  material_status text not null,
  emotion text not null,
  region text not null,
  advisor_goal text not null,
  note text,
  generated_script text,
  created_at timestamptz not null default now()
);

create table if not exists public.case_followups (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.client_cases(id) on delete cascade,
  followup_label text not null,
  due_date date,
  status text not null default 'pending' check (status in ('pending', 'done', 'skipped')),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_health_events_active_sort on public.health_events(is_active, sort_order);
create index if not exists idx_script_templates_event_tone_active on public.script_templates(event_id, tone, is_active);
create index if not exists idx_client_cases_event_id on public.client_cases(event_id);
create index if not exists idx_case_followups_case_id_status on public.case_followups(case_id, status);
