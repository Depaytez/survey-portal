import { createClient } from "@/lib/supabase/server";

export type ResponseListItem = {
  id: string;
  status: string;
  startedAt: string;
  submittedAt: string | null;
};

export type ResponseListResult = {
  responses: ResponseListItem[];
  totalCount: number;
};

export type ResponseSortColumn = "submitted_at" | "started_at" | "status";

/**
 * Paginated, sorted response list — never fetches every response row at
 * once, per the spec's explicit "don't dump everything to the browser"
 * guidance.
 */
export async function getSurveyResponsesPaginated(
  surveyId: string,
  options: {
    page: number;
    pageSize: number;
    sortBy?: ResponseSortColumn;
    sortDir?: "asc" | "desc";
    status?: string;
  },
): Promise<ResponseListResult> {
  const supabase = await createClient();
  const { page, pageSize, sortBy = "submitted_at", sortDir = "desc", status } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("survey_responses")
    .select("id, status, started_at, submitted_at", { count: "exact" })
    .eq("survey_id", surveyId);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortDir === "asc", nullsFirst: false })
    .range(from, to);

  if (error) {
    console.error(`Failed to list responses for survey ${surveyId}:`, error.message);
    return { responses: [], totalCount: 0 };
  }

  return {
    responses: data.map((r) => ({
      id: r.id,
      status: r.status,
      startedAt: r.started_at,
      submittedAt: r.submitted_at,
    })),
    totalCount: count ?? 0,
  };
}

export type ResponseDetailAnswer = {
  questionId: string;
  questionTitle: string;
  questionType: string;
  sectionTitle: string;
  value: unknown;
};

export type ResponseDetail = {
  id: string;
  status: string;
  startedAt: string;
  submittedAt: string | null;
  surveyId: string;
  surveyTitle: string;
  answers: ResponseDetailAnswer[];
};

/** One response with every answer, labeled with its question's text/type for display. */
export async function getResponseDetail(responseId: string): Promise<ResponseDetail | null> {
  const supabase = await createClient();

  const { data: response, error: responseError } = await supabase
    .from("survey_responses")
    .select("id, status, started_at, submitted_at, survey_id, surveys(title)")
    .eq("id", responseId)
    .maybeSingle();

  if (responseError || !response) {
    if (responseError) console.error("Failed to load response:", responseError.message);
    return null;
  }

  const { data: answers, error: answersError } = await supabase
    .from("response_answers")
    .select("question_id, value, questions(title, question_type, survey_sections(title))")
    .eq("response_id", responseId);

  if (answersError) {
    console.error("Failed to load response answers:", answersError.message);
    return null;
  }

  return {
    id: response.id,
    status: response.status,
    startedAt: response.started_at,
    submittedAt: response.submitted_at,
    surveyId: response.survey_id,
    surveyTitle: response.surveys?.title ?? "Unknown survey",
    answers: answers.map((a) => ({
      questionId: a.question_id,
      questionTitle: a.questions?.title ?? "Unknown question",
      questionType: a.questions?.question_type ?? "short_text",
      sectionTitle: a.questions?.survey_sections?.title ?? "",
      value: a.value,
    })),
  };
}

export type TrendPoint = { day: string; count: number };

export async function getSurveyResponseTrend(surveyId: string, days = 30): Promise<TrendPoint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_survey_response_trend", {
    p_survey_id: surveyId,
    p_days: days,
  });

  if (error) {
    console.error(`Failed to load response trend for survey ${surveyId}:`, error.message);
    return [];
  }

  return data.map((row) => ({ day: row.day, count: Number(row.response_count) }));
}

export type QuestionDistribution = {
  questionId: string;
  questionTitle: string;
  questionType: string;
  recommendedVisualization: string | null;
  distribution: { value: string; label: string; count: number }[];
};

/**
 * Per-question answer distributions, joined with the question/option
 * metadata so the UI gets human-readable labels (not raw option values)
 * and each question's own recommended chart type from analytics_config.
 */
// boolean questions have no question_options rows — their two buckets are
// fixed, so they're synthesized here rather than stored.
const BOOLEAN_OPTIONS = [
  { value: "true", label: "Yes", display_order: 0 },
  { value: "false", label: "No", display_order: 1 },
];

export async function getSurveyQuestionDistributions(
  surveyId: string,
): Promise<QuestionDistribution[]> {
  const supabase = await createClient();

  const [{ data: counts, error: countsError }, { data: questions, error: questionsError }] =
    await Promise.all([
      supabase.rpc("get_survey_question_distributions", { p_survey_id: surveyId }),
      supabase
        .from("questions")
        .select(
          "id, title, question_type, display_order, analytics_config, question_options(value, label, display_order)",
        )
        .eq("survey_id", surveyId)
        .in("question_type", ["single_choice", "multiple_choice", "rating", "boolean"])
        .order("display_order"),
    ]);

  if (countsError || questionsError) {
    console.error(
      "Failed to load question distributions:",
      countsError?.message ?? questionsError?.message,
    );
    return [];
  }

  const countsByQuestion = new Map<string, Map<string, number>>();
  for (const row of counts) {
    if (!countsByQuestion.has(row.question_id)) countsByQuestion.set(row.question_id, new Map());
    countsByQuestion.get(row.question_id)!.set(row.value ?? "", Number(row.answer_count));
  }

  return questions.map((q) => {
    const questionCounts = countsByQuestion.get(q.id) ?? new Map();
    const analyticsConfig = (q.analytics_config as Record<string, unknown>) ?? {};

    const options = q.question_type === "boolean" ? BOOLEAN_OPTIONS : q.question_options;

    const distribution = options
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map((option) => ({
        value: option.value,
        label: option.label,
        count: questionCounts.get(option.value) ?? 0,
      }));

    return {
      questionId: q.id,
      questionTitle: q.title,
      questionType: q.question_type,
      recommendedVisualization:
        typeof analyticsConfig.recommendedVisualization === "string"
          ? analyticsConfig.recommendedVisualization
          : null,
      distribution,
    };
  });
}

export type SurveyKpis = {
  totalResponses: number;
  today: number;
  thisWeek: number;
  lastResponseAt: string | null;
};

/**
 * Cheap headline counts for the analytics overview strip. Deliberately
 * skips "completion rate" / "average time to complete" — this survey's
 * submission flow is a single atomic write (no partial/in-progress saves
 * are ever persisted), so started_at and submitted_at are always
 * effectively identical and would make those metrics meaningless, not
 * just unavailable.
 */
export async function getSurveyKpis(surveyId: string): Promise<SurveyKpis> {
  const supabase = await createClient();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: totalResponses }, { count: today }, { count: thisWeek }, { data: last }] =
    await Promise.all([
      supabase
        .from("survey_responses")
        .select("id", { count: "exact", head: true })
        .eq("survey_id", surveyId)
        .eq("status", "SUBMITTED"),
      supabase
        .from("survey_responses")
        .select("id", { count: "exact", head: true })
        .eq("survey_id", surveyId)
        .eq("status", "SUBMITTED")
        .gte("submitted_at", startOfToday),
      supabase
        .from("survey_responses")
        .select("id", { count: "exact", head: true })
        .eq("survey_id", surveyId)
        .eq("status", "SUBMITTED")
        .gte("submitted_at", startOfWeek),
      supabase
        .from("survey_responses")
        .select("submitted_at")
        .eq("survey_id", surveyId)
        .eq("status", "SUBMITTED")
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  return {
    totalResponses: totalResponses ?? 0,
    today: today ?? 0,
    thisWeek: thisWeek ?? 0,
    lastResponseAt: last?.submitted_at ?? null,
  };
}

export type TextAnswer = { responseId: string; submittedAt: string | null; value: string };
export type TextAnswersResult = { answers: TextAnswer[]; totalCount: number };

/** Paginated free-text answers for one question — never all at once, same pagination discipline as getSurveyResponsesPaginated. */
export async function getQuestionTextAnswers(
  questionId: string,
  page: number,
  pageSize: number,
): Promise<TextAnswersResult> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("response_answers")
    .select("value, survey_responses!inner(id, submitted_at, status)", { count: "exact" })
    .eq("question_id", questionId)
    .eq("survey_responses.status", "SUBMITTED")
    .order("submitted_at", { referencedTable: "survey_responses", ascending: false })
    .range(from, to);

  if (error) {
    console.error(`Failed to load text answers for question ${questionId}:`, error.message);
    return { answers: [], totalCount: 0 };
  }

  return {
    answers: data.map((row) => ({
      responseId: row.survey_responses.id,
      submittedAt: row.survey_responses.submitted_at,
      value: typeof row.value === "string" ? row.value : JSON.stringify(row.value),
    })),
    totalCount: count ?? 0,
  };
}
