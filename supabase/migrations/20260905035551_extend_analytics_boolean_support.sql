-- Extends get_survey_question_distributions to also cover 'boolean'
-- questions. Boolean values are jsonb `true`/`false`, not arrays, so the
-- existing unnest-or-scalar logic already yields the right per-question
-- counts once 'boolean' is included in the type filter — no other change
-- needed here. (question_options has no rows for boolean questions; the
-- application layer synthesizes the Yes/No labels.)

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
    and q.question_type in ('single_choice', 'multiple_choice', 'rating', 'boolean')
    and r.status = 'SUBMITTED'
  group by ra.question_id, x.value;
$$;

revoke all on function public.get_survey_question_distributions(uuid) from public;
grant execute on function public.get_survey_question_distributions(uuid) to authenticated;
