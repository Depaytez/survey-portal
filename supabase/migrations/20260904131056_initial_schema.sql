-- African Tourism Research Platform — Version 1 Foundation Schema
--
-- Domain model:
--   surveys -> survey_sections -> questions -> question_options
--   surveys -> survey_responses -> response_answers
--   customer_care_requests, stakeholder_requests (standalone public intake)
--   profiles (internal administrators, linked 1:1 to auth.users)
--
-- The questionnaire itself is data (seeded in the next migration), never
-- hardcoded into columns, so future research instruments reuse this engine.

create extension if not exists pgcrypto;

-- A non-exposed schema for privileged helper functions used inside RLS
-- policies. Keeping these out of `public` means they are never reachable
-- directly through the PostgREST Data API.
create schema if not exists private;

-- ---------------------------------------------------------------------
-- Shared trigger: keep updated_at current on every row update.
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- profiles — internal administrators only. Rows are created out-of-band
-- (via a service-role script) after an admin's auth.users account exists;
-- there is no public sign-up path in Version 1.
-- ---------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- SECURITY DEFINER so it can read profiles regardless of the caller's RLS
-- visibility (avoids recursive-policy issues), while still being scoped to
-- the current session's uid. Lives in `private`, not `public`, so it is not
-- directly callable through the Data API.
create or replace function private.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

-- ---------------------------------------------------------------------
-- surveys
-- ---------------------------------------------------------------------
create table public.surveys (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_title text,
  description text,
  short_description text,
  status text not null default 'DRAFT'
    check (status in ('DRAFT', 'PUBLISHED', 'HIDDEN', 'CLOSED', 'ARCHIVED')),
  is_listed_publicly boolean not null default true,
  estimated_duration text,
  welcome_title text,
  welcome_description text,
  completion_title text,
  completion_description text,
  consent_text text,
  contact_privacy_notice text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  published_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index surveys_status_idx on public.surveys (status);

create trigger set_surveys_updated_at
  before update on public.surveys
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- survey_sections
-- ---------------------------------------------------------------------
create table public.survey_sections (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys (id) on delete cascade,
  section_key text not null,
  title text not null,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (survey_id, section_key)
);

create index survey_sections_survey_id_idx on public.survey_sections (survey_id);

create trigger set_survey_sections_updated_at
  before update on public.survey_sections
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- questions
-- ---------------------------------------------------------------------
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys (id) on delete cascade,
  section_id uuid not null references public.survey_sections (id) on delete cascade,
  question_key text not null,
  question_number integer,
  question_type text not null
    check (question_type in (
      'short_text', 'long_text', 'email',
      'single_choice', 'multiple_choice', 'rating', 'boolean'
    )),
  title text not null,
  description text,
  placeholder text,
  is_required boolean not null default false,
  display_order integer not null default 0,
  -- Type-specific validation/behaviour, e.g. {"minSelections":3,"maxSelections":3},
  -- {"minimum":1,"maximum":5}, {"mustBeTrue":true}, {"minLength":3,"maxLength":100}.
  configuration jsonb not null default '{}'::jsonb,
  -- Analytics-rendering hints only; never used for access control.
  -- e.g. {"enabled":true,"category":"demographics","visualizationPriority":"high",
  --       "recommendedVisualization":"bar_chart","sensitive":false,
  --       "personallyIdentifiable":false}
  analytics_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (survey_id, question_key)
);

create index questions_survey_id_idx on public.questions (survey_id);
create index questions_section_id_idx on public.questions (section_id);

create trigger set_questions_updated_at
  before update on public.questions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- question_options
-- ---------------------------------------------------------------------
create table public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  value text not null,
  label text not null,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (question_id, value)
);

create index question_options_question_id_idx on public.question_options (question_id);

create trigger set_question_options_updated_at
  before update on public.question_options
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- survey_responses
-- Version 1 submits a survey response and its answers together in a single
-- server-validated write, so no public UPDATE path is needed or granted.
-- ---------------------------------------------------------------------
create table public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys (id) on delete cascade,
  status text not null default 'SUBMITTED'
    check (status in ('IN_PROGRESS', 'SUBMITTED', 'ABANDONED')),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index survey_responses_survey_id_idx on public.survey_responses (survey_id);
create index survey_responses_submitted_at_idx on public.survey_responses (submitted_at);

create trigger set_survey_responses_updated_at
  before update on public.survey_responses
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- response_answers
-- `value` is jsonb so a single column supports every question type without
-- lossy comma-separated encoding: a string, a number, a boolean, or an
-- array of selected option values for multiple_choice.
-- ---------------------------------------------------------------------
create table public.response_answers (
  id uuid primary key default gen_random_uuid(),
  response_id uuid not null references public.survey_responses (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (response_id, question_id)
);

create index response_answers_response_id_idx on public.response_answers (response_id);
create index response_answers_question_id_idx on public.response_answers (question_id);

create trigger set_response_answers_updated_at
  before update on public.response_answers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- customer_care_requests
-- ---------------------------------------------------------------------
create table public.customer_care_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  category text not null default 'general'
    check (category in ('general', 'technical_issue', 'question', 'feedback')),
  message text not null,
  status text not null default 'NEW'
    check (status in ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customer_care_requests_status_idx on public.customer_care_requests (status);
create index customer_care_requests_created_at_idx on public.customer_care_requests (created_at);

create trigger set_customer_care_requests_updated_at
  before update on public.customer_care_requests
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- stakeholder_requests
-- ---------------------------------------------------------------------
create table public.stakeholder_requests (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  interest_type text not null default 'general_inquiry'
    check (interest_type in (
      'tourism_development_partnership', 'research_collaboration',
      'data_research_support', 'investment_programme_discussion',
      'general_inquiry'
    )),
  message text not null,
  status text not null default 'NEW'
    check (status in ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index stakeholder_requests_status_idx on public.stakeholder_requests (status);
create index stakeholder_requests_created_at_idx on public.stakeholder_requests (created_at);

create trigger set_stakeholder_requests_updated_at
  before update on public.stakeholder_requests
  for each row execute function public.set_updated_at();

-- =======================================================================
-- Row Level Security
-- =======================================================================

alter table public.profiles enable row level security;
alter table public.surveys enable row level security;
alter table public.survey_sections enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.survey_responses enable row level security;
alter table public.response_answers enable row level security;
alter table public.customer_care_requests enable row level security;
alter table public.stakeholder_requests enable row level security;

-- profiles: an admin can read their own row and, once confirmed admin,
-- every profile (needed to show "created by" in the admin UI). No public
-- insert/update/delete policy exists — provisioning is a service-role-only
-- operation performed by scripts/create-admin.ts.
create policy "profiles_self_select" on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

create policy "profiles_admin_select_all" on public.profiles
  for select
  to authenticated
  using (private.is_admin());

-- surveys: publicly reachable statuses are readable by anyone (respondent
-- flow needs PUBLISHED; a direct link to a HIDDEN or CLOSED survey must
-- still resolve to show the correct message); admins can read every status
-- and are the only ones who can write.
create policy "surveys_public_select" on public.surveys
  for select
  to anon, authenticated
  using (status in ('PUBLISHED', 'HIDDEN', 'CLOSED'));

create policy "surveys_admin_select_all" on public.surveys
  for select
  to authenticated
  using (private.is_admin());

create policy "surveys_admin_insert" on public.surveys
  for insert
  to authenticated
  with check (private.is_admin());

create policy "surveys_admin_update" on public.surveys
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

-- survey_sections / questions / question_options: readable when the parent
-- survey is publicly reachable, or by an admin regardless of survey status.
create policy "survey_sections_public_select" on public.survey_sections
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.surveys s
      where s.id = survey_sections.survey_id
        and s.status in ('PUBLISHED', 'HIDDEN', 'CLOSED')
    )
  );

create policy "survey_sections_admin_all" on public.survey_sections
  for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "questions_public_select" on public.questions
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.surveys s
      where s.id = questions.survey_id
        and s.status in ('PUBLISHED', 'HIDDEN', 'CLOSED')
    )
  );

create policy "questions_admin_all" on public.questions
  for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "question_options_public_select" on public.question_options
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.questions q
      join public.surveys s on s.id = q.survey_id
      where q.id = question_options.question_id
        and s.status in ('PUBLISHED', 'HIDDEN', 'CLOSED')
    )
  );

create policy "question_options_admin_all" on public.question_options
  for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

-- survey_responses: the public may only INSERT, and only against a survey
-- that is currently PUBLISHED (defense in depth — the app layer also
-- checks this before writing). No public select/update: respondents never
-- read back response data. Admins have full access.
create policy "survey_responses_public_insert" on public.survey_responses
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.surveys s
      where s.id = survey_responses.survey_id
        and s.status = 'PUBLISHED'
    )
  );

create policy "survey_responses_admin_all" on public.survey_responses
  for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

-- response_answers: same shape — public insert only, tied to a response
-- whose survey is still published.
create policy "response_answers_public_insert" on public.response_answers
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.survey_responses r
      join public.surveys s on s.id = r.survey_id
      where r.id = response_answers.response_id
        and s.status = 'PUBLISHED'
    )
  );

create policy "response_answers_admin_all" on public.response_answers
  for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

-- customer_care_requests / stakeholder_requests: public insert only,
-- admin-only read/update. No one may delete via the API.
create policy "customer_care_requests_public_insert" on public.customer_care_requests
  for insert
  to anon, authenticated
  with check (true);

create policy "customer_care_requests_admin_select" on public.customer_care_requests
  for select
  to authenticated
  using (private.is_admin());

create policy "customer_care_requests_admin_update" on public.customer_care_requests
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "stakeholder_requests_public_insert" on public.stakeholder_requests
  for insert
  to anon, authenticated
  with check (true);

create policy "stakeholder_requests_admin_select" on public.stakeholder_requests
  for select
  to authenticated
  using (private.is_admin());

create policy "stakeholder_requests_admin_update" on public.stakeholder_requests
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

-- =======================================================================
-- Table-level grants
-- RLS above decides which *rows* are visible; these grants decide which
-- *operations* are even attempted through the Data API in the first place.
-- No DELETE is granted anywhere — deletion is a deliberate service-role-only
-- action, not an API-level capability, for this stage of the product.
-- =======================================================================

grant usage on schema public to anon, authenticated;

grant select on
  public.surveys,
  public.survey_sections,
  public.questions,
  public.question_options
to anon;

grant insert on
  public.survey_responses,
  public.response_answers,
  public.customer_care_requests,
  public.stakeholder_requests
to anon;

grant select on public.profiles to authenticated;

grant select, insert, update on
  public.surveys,
  public.survey_sections,
  public.questions,
  public.question_options,
  public.survey_responses,
  public.response_answers,
  public.customer_care_requests,
  public.stakeholder_requests
to authenticated;
