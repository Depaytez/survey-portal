-- Previously the app inserted survey_responses and response_answers as two
-- separate statements. If the second insert failed (e.g. a transient
-- error), the first had already committed, leaving a permanent orphaned
-- "response" with zero answers that silently inflated every response
-- count (dashboard, survey list, analytics KPIs) forever.
--
-- Wrapping both inserts in one function makes them atomic: a Postgres
-- function body runs as part of the calling statement's transaction, so an
-- exception anywhere inside it rolls back everything the function did,
-- including the first insert. SECURITY INVOKER (not DEFINER) means this
-- adds no privilege the caller didn't already have — the existing
-- survey_responses_public_insert / response_answers_public_insert RLS
-- policies still apply exactly as before, per row, unchanged.

create or replace function public.submit_survey_response(
  p_response_id uuid,
  p_survey_id uuid,
  p_answers jsonb -- array of {"question_id": uuid, "value": jsonb}
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.survey_responses (id, survey_id, status, submitted_at)
  values (p_response_id, p_survey_id, 'SUBMITTED', now());

  insert into public.response_answers (response_id, question_id, value)
  select
    p_response_id,
    (elem->>'question_id')::uuid,
    elem->'value'
  from jsonb_array_elements(p_answers) as elem;
end;
$$;

revoke all on function public.submit_survey_response(uuid, uuid, jsonb) from public;
grant execute on function public.submit_survey_response(uuid, uuid, jsonb) to anon, authenticated;
