import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type SurveyStatus = Database["public"]["Tables"]["surveys"]["Row"]["status"];
export type QuestionType = Database["public"]["Tables"]["questions"]["Row"]["question_type"];

export type SurveyOption = {
  id: string;
  value: string;
  label: string;
  description: string | null;
  displayOrder: number;
};

export type SurveyQuestion = {
  id: string;
  questionKey: string;
  questionNumber: number | null;
  questionType: QuestionType;
  title: string;
  description: string | null;
  placeholder: string | null;
  isRequired: boolean;
  displayOrder: number;
  configuration: Record<string, unknown>;
  options: SurveyOption[];
};

export type SurveySection = {
  id: string;
  title: string;
  description: string | null;
  displayOrder: number;
  questions: SurveyQuestion[];
};

export type SurveyDetail = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string | null;
  description: string | null;
  status: SurveyStatus;
  estimatedDuration: string | null;
  welcomeTitle: string | null;
  welcomeDescription: string | null;
  completionTitle: string | null;
  completionDescription: string | null;
  consentText: string | null;
  sections: SurveySection[];
};

/**
 * Fetches a survey and its full section/question/option tree by slug.
 * Returns null for anything RLS doesn't expose to the public (DRAFT,
 * ARCHIVED, or a slug that doesn't exist) — the caller should treat null
 * as "not found", not distinguish the reason.
 */
export async function getSurveyBySlug(slug: string): Promise<SurveyDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("surveys")
    .select(
      `
      id, slug, title, short_title, description, status, estimated_duration,
      welcome_title, welcome_description, completion_title, completion_description,
      consent_text,
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
    .eq("slug", slug)
    .order("display_order", { referencedTable: "survey_sections" })
    .order("display_order", { referencedTable: "survey_sections.questions" })
    .order("display_order", {
      referencedTable: "survey_sections.questions.question_options",
    })
    .maybeSingle();

  if (error) {
    console.error(`Failed to load survey "${slug}":`, error.message);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    shortTitle: data.short_title,
    description: data.description,
    status: data.status,
    estimatedDuration: data.estimated_duration,
    welcomeTitle: data.welcome_title,
    welcomeDescription: data.welcome_description,
    completionTitle: data.completion_title,
    completionDescription: data.completion_description,
    consentText: data.consent_text,
    sections: data.survey_sections.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      displayOrder: section.display_order,
      questions: section.questions.map((question) => ({
        id: question.id,
        questionKey: question.question_key,
        questionNumber: question.question_number,
        questionType: question.question_type,
        title: question.title,
        description: question.description,
        placeholder: question.placeholder,
        isRequired: question.is_required,
        displayOrder: question.display_order,
        configuration: (question.configuration as Record<string, unknown>) ?? {},
        options: question.question_options.map((option) => ({
          id: option.id,
          value: option.value,
          label: option.label,
          description: option.description,
          displayOrder: option.display_order,
        })),
      })),
    })),
  };
}
