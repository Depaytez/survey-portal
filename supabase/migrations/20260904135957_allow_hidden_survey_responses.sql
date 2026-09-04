-- Stage 1 restricted public response submission to PUBLISHED only, but the
-- product spec (docs/AFRICAN-TOURISM-MASTER-PROJECT-CONCEPT.md §7.7) is
-- explicit: a HIDDEN survey stays reachable and open via its direct link —
-- it is only delisted from the public browse page, not closed to
-- respondents. Widen both public-insert policies to match.

drop policy "survey_responses_public_insert" on public.survey_responses;

create policy "survey_responses_public_insert" on public.survey_responses
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.surveys s
      where s.id = survey_responses.survey_id
        and s.status in ('PUBLISHED', 'HIDDEN')
    )
  );

drop policy "response_answers_public_insert" on public.response_answers;

create policy "response_answers_public_insert" on public.response_answers
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.survey_responses r
      join public.surveys s on s.id = r.survey_id
      where r.id = response_answers.response_id
        and s.status in ('PUBLISHED', 'HIDDEN')
    )
  );
