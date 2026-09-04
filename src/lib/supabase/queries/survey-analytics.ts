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
        .in("question_type", ["single_choice", "multiple_choice", "rating"])
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

    const distribution = q.question_options
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
