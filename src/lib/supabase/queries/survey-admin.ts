import { createClient } from "@/lib/supabase/server";
import type { SurveyStatus } from "@/lib/validation/survey-admin";
import type {
  SurveyDetail,
  SurveyOption,
  SurveyQuestion,
  SurveySection,
} from "@/lib/supabase/queries/survey-detail";

export type AdminSurveyListItem = {
  id: string;
  title: string;
  slug: string;
  status: SurveyStatus;
  isListedPublicly: boolean;
  updatedAt: string;
  responseCount: number;
};

/** All surveys regardless of status, for the admin list — RLS (private.is_admin()) is what actually authorizes this. */
export async function listSurveysForAdmin(): Promise<AdminSurveyListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("surveys")
    .select("id, title, slug, status, is_listed_publicly, updated_at, survey_responses(count)")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to list surveys for admin:", error.message);
    return [];
  }

  return data.map((survey) => ({
    id: survey.id,
    title: survey.title,
    slug: survey.slug,
    status: survey.status as SurveyStatus,
    isListedPublicly: survey.is_listed_publicly,
    updatedAt: survey.updated_at,
    responseCount: survey.survey_responses[0]?.count ?? 0,
  }));
}

export type AdminSurveyDetail = SurveyDetail & {
  status: SurveyStatus;
  shortDescription: string | null;
  contactPrivacyNotice: string | null;
  isListedPublicly: boolean;
  publishedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  responseCount: number;
};

/** Full survey tree for the admin builder, any status. */
export async function getSurveyForAdmin(id: string): Promise<AdminSurveyDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("surveys")
    .select(
      `
      id, slug, title, short_title, description, short_description, status,
      estimated_duration, welcome_title, welcome_description, completion_title,
      completion_description, consent_text, contact_privacy_notice,
      is_listed_publicly, published_at, closed_at, created_at,
      survey_responses(count),
      survey_sections (
        id, title, description, display_order,
        questions (
          id, question_key, question_number, question_type, title, description,
          placeholder, is_required, display_order, configuration,
          question_options ( id, value, label, description, display_order )
        )
      )
    `,
    )
    .eq("id", id)
    .order("display_order", { referencedTable: "survey_sections" })
    .order("display_order", { referencedTable: "survey_sections.questions" })
    .order("display_order", {
      referencedTable: "survey_sections.questions.question_options",
    })
    .maybeSingle();

  if (error) {
    console.error(`Failed to load survey ${id} for admin:`, error.message);
    return null;
  }

  if (!data) return null;

  const sections: SurveySection[] = data.survey_sections.map((section) => ({
    id: section.id,
    title: section.title,
    description: section.description,
    displayOrder: section.display_order,
    questions: section.questions.map(
      (question): SurveyQuestion => ({
        id: question.id,
        questionKey: question.question_key,
        questionNumber: question.question_number,
        questionType: question.question_type as SurveyQuestion["questionType"],
        title: question.title,
        description: question.description,
        placeholder: question.placeholder,
        isRequired: question.is_required,
        displayOrder: question.display_order,
        configuration: (question.configuration as Record<string, unknown>) ?? {},
        options: question.question_options.map(
          (option): SurveyOption => ({
            id: option.id,
            value: option.value,
            label: option.label,
            description: option.description,
            displayOrder: option.display_order,
          }),
        ),
      }),
    ),
  }));

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    shortTitle: data.short_title,
    description: data.description,
    shortDescription: data.short_description,
    status: data.status as SurveyStatus,
    estimatedDuration: data.estimated_duration,
    welcomeTitle: data.welcome_title,
    welcomeDescription: data.welcome_description,
    completionTitle: data.completion_title,
    completionDescription: data.completion_description,
    consentText: data.consent_text,
    contactPrivacyNotice: data.contact_privacy_notice,
    isListedPublicly: data.is_listed_publicly,
    publishedAt: data.published_at,
    closedAt: data.closed_at,
    createdAt: data.created_at,
    responseCount: data.survey_responses[0]?.count ?? 0,
    sections,
  };
}

export type DashboardStats = {
  totalResponses: number;
  activeSurveys: number;
  closedSurveys: number;
  recentResponses: { id: string; surveyTitle: string; submittedAt: string | null }[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [{ count: totalResponses }, { count: activeSurveys }, { count: closedSurveys }, recent] =
    await Promise.all([
      supabase.from("survey_responses").select("id", { count: "exact", head: true }),
      supabase
        .from("surveys")
        .select("id", { count: "exact", head: true })
        .in("status", ["PUBLISHED", "HIDDEN"]),
      supabase
        .from("surveys")
        .select("id", { count: "exact", head: true })
        .eq("status", "CLOSED"),
      supabase
        .from("survey_responses")
        .select("id, submitted_at, surveys(title)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return {
    totalResponses: totalResponses ?? 0,
    activeSurveys: activeSurveys ?? 0,
    closedSurveys: closedSurveys ?? 0,
    recentResponses: (recent.data ?? []).map((row) => ({
      id: row.id,
      surveyTitle: row.surveys?.title ?? "Unknown survey",
      submittedAt: row.submitted_at,
    })),
  };
}
