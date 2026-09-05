-- CLOSED surveys already resolve publicly with a friendly "this survey is
-- now closed" message rather than a bare 404. ARCHIVED was left out of the
-- original public-select policy, so a previously-shared link to a survey
-- that's since been archived looked broken instead of intentionally
-- concluded. Widening this list doesn't expose anything new — archived
-- surveys are still read-only for anon/authenticated (no insert policy
-- covers them), and the app layer decides what to actually render.

drop policy "surveys_public_select" on public.surveys;

create policy "surveys_public_select" on public.surveys
  for select
  to anon, authenticated
  using (status in ('PUBLISHED', 'HIDDEN', 'CLOSED', 'ARCHIVED'));
