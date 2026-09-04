-- Server/database-side analytics aggregation (per the product spec:
-- "Database -> Server/Database Aggregation -> Analytics Query -> Chart-
-- Friendly Result -> Frontend Visualization" — never dump every response
-- row to the browser to compute this client-side).
--
-- Both functions are SECURITY INVOKER (not DEFINER): they run with the
-- caller's own privileges, so the existing RLS policies on
-- survey_responses/response_answers/questions still apply underneath —
-- an admin sees real data, anyone else gets nothing. EXECUTE is revoked
-- from PUBLIC and granted only to `authenticated` as defense in depth,
-- so anonymous callers can't invoke it at all (not just get empty rows).

-- ---------------------------------------------------------------------
-- Responses-per-day over a trailing window, including zero-count days
-- (generate_series fills the gaps) so a trend chart never has to guess
-- at missing dates.
-- ---------------------------------------------------------------------
create or replace function public.get_survey_response_trend(p_survey_id uuid, p_days integer)
returns table (day date, response_count bigint)
language sql
security invoker
stable
set search_path = ''
as $$
  select
    d.day,
    count(r.id) as response_count
  from generate_series(
    (current_date - (p_days - 1)),
    current_date,
    interval '1 day'
  ) as d(day)
  left join public.survey_responses r
    on r.survey_id = p_survey_id
    and r.status = 'SUBMITTED'
    and r.submitted_at::date = d.day
  group by d.day
  order by d.day;
$$;

revoke all on function public.get_survey_response_trend(uuid, integer) from public;
grant execute on function public.get_survey_response_trend(uuid, integer) to authenticated;

-- ---------------------------------------------------------------------
-- Per-question answer distribution for choice/rating questions. Handles
-- multiple_choice's jsonb *array* values by unnesting each selected
-- option, so a respondent who picked 3 options contributes 3 counts
-- (one per option), not one combined "array" bucket.
-- ---------------------------------------------------------------------
create or replace function public.get_survey_question_distributions(p_survey_id uuid)
returns table (question_id uuid, value text, answer_count bigint)
language sql
security invoker
stable
set search_path = ''
as $$
  select
    ra.question_id,
    x.value,
    count(*) as answer_count
  from public.response_answers ra
  join public.questions q on q.id = ra.question_id
  join public.survey_responses r on r.id = ra.response_id
  cross join lateral (
    select case
      when jsonb_typeof(ra.value) = 'array' then elem
      else ra.value #>> '{}'
    end as value
    from jsonb_array_elements_text(
      case when jsonb_typeof(ra.value) = 'array' then ra.value else '[null]'::jsonb end
    ) as elem
  ) x
  where q.survey_id = p_survey_id
    and q.question_type in ('single_choice', 'multiple_choice', 'rating')
    and r.status = 'SUBMITTED'
  group by ra.question_id, x.value;
$$;

revoke all on function public.get_survey_question_distributions(uuid) from public;
grant execute on function public.get_survey_question_distributions(uuid) to authenticated;
