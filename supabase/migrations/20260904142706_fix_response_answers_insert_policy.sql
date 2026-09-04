-- response_answers_public_insert's WITH CHECK subqueried survey_responses
-- directly, but anon/authenticated have no SELECT policy on that table —
-- so the subquery silently returned zero rows even for a response the same
-- request had just legitimately inserted, and every answer insert was
-- rejected. Fix: use a SECURITY DEFINER helper (same pattern as
-- private.is_admin()) that checks the linkage without requiring the caller
-- to be able to SELECT survey_responses directly.

create or replace function private.response_is_for_open_survey(p_response_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.survey_responses r
    join public.surveys s on s.id = r.survey_id
    where r.id = p_response_id
      and s.status in ('PUBLISHED', 'HIDDEN')
  );
$$;

revoke all on function private.response_is_for_open_survey(uuid) from public;
grant execute on function private.response_is_for_open_survey(uuid) to anon, authenticated;

drop policy "response_answers_public_insert" on public.response_answers;

create policy "response_answers_public_insert" on public.response_answers
  for insert
  to anon, authenticated
  with check (private.response_is_for_open_survey(response_id));
