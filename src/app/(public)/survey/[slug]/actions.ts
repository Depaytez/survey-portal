"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { getSurveyBySlug } from "@/lib/supabase/queries/survey-detail";
import { buildAnswersSchema, type AnswersByQuestionId } from "@/lib/validation/survey-response";

export type SubmitSurveyResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

export async function submitSurveyResponse(
  slug: string,
  answers: AnswersByQuestionId,
): Promise<SubmitSurveyResult> {
  // Re-fetch server-side rather than trusting any survey/question shape the
  // client might send — the client only ever supplies question id -> value.
  const survey = await getSurveyBySlug(slug);

  if (!survey) {
    return { success: false, error: "This survey could not be found." };
  }

  if (survey.status === "CLOSED") {
    return {
      success: false,
      error: "This survey is now closed and is no longer accepting responses.",
    };
  }

  if (survey.status !== "PUBLISHED" && survey.status !== "HIDDEN") {
    return { success: false, error: "This survey is not currently accepting responses." };
  }

  const allQuestions = survey.sections.flatMap((section) => section.questions);
  const schema = buildAnswersSchema(allQuestions);
  const parsed = schema.safeParse(answers);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const questionId = String(issue.path[0]);
      if (!fieldErrors[questionId]) fieldErrors[questionId] = issue.message;
    }
    return {
      success: false,
      error: "Please check the highlighted questions and try again.",
      fieldErrors,
    };
  }

  const supabase = await createClient();

  // Generated here rather than read back via `.select()` after insert:
  // anonymous respondents intentionally have no SELECT policy on
  // survey_responses, and Postgres RLS requires one to satisfy a
  // RETURNING/select clause — even for a row the same request just
  // inserted. Assigning the id ourselves avoids needing that round trip.
  const responseId = randomUUID();

  const { error: responseError } = await supabase.from("survey_responses").insert({
    id: responseId,
    survey_id: survey.id,
    status: "SUBMITTED",
    submitted_at: new Date().toISOString(),
  });

  if (responseError) {
    console.error("Failed to create survey response:", responseError.message);
    return { success: false, error: "Something went wrong submitting your response. Please try again." };
  }

  const answerRows = allQuestions
    .filter((question) => parsed.data[question.id] !== undefined && parsed.data[question.id] !== null)
    .map((question) => ({
      response_id: responseId,
      question_id: question.id,
      value: parsed.data[question.id] as never,
    }));

  if (answerRows.length > 0) {
    const { error: answersError } = await supabase.from("response_answers").insert(answerRows);

    if (answersError) {
      console.error("Failed to persist response answers:", answersError.message);
      // The response row already exists but its answers are incomplete —
      // surface this as a failure so the respondent knows to retry rather
      // than seeing a false success.
      return { success: false, error: "Something went wrong submitting your response. Please try again." };
    }
  }

  return { success: true };
}
