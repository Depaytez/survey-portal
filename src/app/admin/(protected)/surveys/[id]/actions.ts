"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  ALLOWED_STATUS_TRANSITIONS,
  buildQuestionConfiguration,
  optionSchema,
  questionSchema,
  sectionSchema,
  surveyDetailsSchema,
  type SurveyStatus,
} from "@/lib/validation/survey-admin";

export type ActionResult = { success: true } | { success: false; error: string };

function fail(error: string): ActionResult {
  return { success: false, error };
}

const ok: ActionResult = { success: true };

function revalidateSurvey(surveyId: string) {
  revalidatePath(`/admin/surveys/${surveyId}`);
  revalidatePath("/admin/surveys");
}

/**
 * Real enforcement behind the builder UI's disabled type-select /
 * read-only option-value field — those are just the honest reflection of
 * this in the UI, not the actual guard. Without this, a request crafted
 * outside the browser (or a future UI regression) could still silently
 * repurpose an already-answered question/option and corrupt analytics.
 */
async function surveyHasResponses(
  supabase: Awaited<ReturnType<typeof createClient>>,
  surveyId: string,
): Promise<boolean> {
  const { count } = await supabase
    .from("survey_responses")
    .select("id", { count: "exact", head: true })
    .eq("survey_id", surveyId)
    .eq("status", "SUBMITTED");
  return (count ?? 0) > 0;
}

// ---------------------------------------------------------------------
// Survey details + status
// ---------------------------------------------------------------------

export async function updateSurveyDetails(
  surveyId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = surveyDetailsSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    shortTitle: formData.get("shortTitle"),
    description: formData.get("description"),
    shortDescription: formData.get("shortDescription"),
    estimatedDuration: formData.get("estimatedDuration"),
    isListedPublicly: formData.get("isListedPublicly") === "on",
    welcomeTitle: formData.get("welcomeTitle"),
    welcomeDescription: formData.get("welcomeDescription"),
    completionTitle: formData.get("completionTitle"),
    completionDescription: formData.get("completionDescription"),
    consentText: formData.get("consentText"),
    contactPrivacyNotice: formData.get("contactPrivacyNotice"),
  });

  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("surveys")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      short_title: parsed.data.shortTitle || null,
      description: parsed.data.description || null,
      short_description: parsed.data.shortDescription || null,
      estimated_duration: parsed.data.estimatedDuration || null,
      is_listed_publicly: parsed.data.isListedPublicly,
      welcome_title: parsed.data.welcomeTitle || null,
      welcome_description: parsed.data.welcomeDescription || null,
      completion_title: parsed.data.completionTitle || null,
      completion_description: parsed.data.completionDescription || null,
      consent_text: parsed.data.consentText || null,
      contact_privacy_notice: parsed.data.contactPrivacyNotice || null,
    })
    .eq("id", surveyId);

  if (error) {
    if (error.code === "23505") return fail("That slug is already in use by another survey.");
    console.error("Failed to update survey details:", error.message);
    return fail("Something went wrong saving the survey.");
  }

  revalidateSurvey(surveyId);
  return ok;
}

export async function updateSurveyStatus(
  surveyId: string,
  currentStatus: SurveyStatus,
  nextStatus: SurveyStatus,
): Promise<ActionResult> {
  await requireAdmin();

  if (!ALLOWED_STATUS_TRANSITIONS[currentStatus].includes(nextStatus)) {
    return fail(`Cannot move a survey from ${currentStatus} to ${nextStatus}.`);
  }

  const supabase = await createClient();

  if (nextStatus === "PUBLISHED") {
    const { count } = await supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("survey_id", surveyId);
    if (!count) {
      return fail("Add at least one question before publishing.");
    }
  }

  const { error } = await supabase
    .from("surveys")
    .update({
      status: nextStatus,
      ...(nextStatus === "PUBLISHED" && currentStatus === "DRAFT"
        ? { published_at: new Date().toISOString() }
        : {}),
      ...(nextStatus === "CLOSED" ? { closed_at: new Date().toISOString() } : {}),
    })
    .eq("id", surveyId);

  if (error) {
    console.error("Failed to update survey status:", error.message);
    return fail("Something went wrong updating the status.");
  }

  revalidateSurvey(surveyId);
  return ok;
}

// ---------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------

type OrderableTable = "survey_sections" | "questions" | "question_options";

async function nextDisplayOrder(table: OrderableTable, parentId: string): Promise<number> {
  const supabase = await createClient();

  const result =
    table === "survey_sections"
      ? await supabase
          .from("survey_sections")
          .select("display_order")
          .eq("survey_id", parentId)
          .order("display_order", { ascending: false })
          .limit(1)
          .maybeSingle()
      : table === "questions"
        ? await supabase
            .from("questions")
            .select("display_order")
            .eq("section_id", parentId)
            .order("display_order", { ascending: false })
            .limit(1)
            .maybeSingle()
        : await supabase
            .from("question_options")
            .select("display_order")
            .eq("question_id", parentId)
            .order("display_order", { ascending: false })
            .limit(1)
            .maybeSingle();

  return (result.data?.display_order ?? -1) + 1;
}

export async function createSection(surveyId: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = sectionSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = await createClient();
  const displayOrder = await nextDisplayOrder("survey_sections", surveyId);
  const sectionKey = `section-${Date.now().toString(36)}`;

  const { error } = await supabase.from("survey_sections").insert({
    survey_id: surveyId,
    section_key: sectionKey,
    title: parsed.data.title,
    description: parsed.data.description || null,
    display_order: displayOrder,
  });

  if (error) {
    console.error("Failed to create section:", error.message);
    return fail("Something went wrong creating the section.");
  }

  revalidateSurvey(surveyId);
  return ok;
}

export async function updateSection(
  surveyId: string,
  sectionId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = sectionSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = await createClient();
  const { error } = await supabase
    .from("survey_sections")
    .update({ title: parsed.data.title, description: parsed.data.description || null })
    .eq("id", sectionId);

  if (error) {
    console.error("Failed to update section:", error.message);
    return fail("Something went wrong saving the section.");
  }

  revalidateSurvey(surveyId);
  return ok;
}

export async function deleteSection(surveyId: string, sectionId: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("survey_sections").delete().eq("id", sectionId);

  if (error) {
    console.error("Failed to delete section:", error.message);
    return fail("Something went wrong deleting the section.");
  }

  revalidateSurvey(surveyId);
  return ok;
}

export async function moveSection(
  surveyId: string,
  sectionId: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  return moveSibling(surveyId, "survey_sections", surveyId, sectionId, direction);
}

// ---------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------

export async function createQuestion(
  surveyId: string,
  sectionId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = parseQuestionForm(formData);
  if (!parsed.success) return fail(parsed.error);

  const supabase = await createClient();
  const displayOrder = await nextDisplayOrder("questions", sectionId);

  const { error } = await supabase.from("questions").insert({
    survey_id: surveyId,
    section_id: sectionId,
    question_key: parsed.data.questionKey,
    question_type: parsed.data.questionType,
    title: parsed.data.title,
    description: parsed.data.description || null,
    placeholder: parsed.data.placeholder || null,
    is_required: parsed.data.isRequired,
    display_order: displayOrder,
    configuration: buildQuestionConfiguration(parsed.data),
  });

  if (error) {
    if (error.code === "23505") return fail("That question key is already used in this survey.");
    console.error("Failed to create question:", error.message);
    return fail("Something went wrong creating the question.");
  }

  revalidateSurvey(surveyId);
  return ok;
}

export async function updateQuestion(
  surveyId: string,
  questionId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = parseQuestionForm(formData);
  if (!parsed.success) return fail(parsed.error);

  const supabase = await createClient();

  const { data: current } = await supabase
    .from("questions")
    .select("question_type")
    .eq("id", questionId)
    .single();

  if (current && current.question_type !== parsed.data.questionType) {
    if (await surveyHasResponses(supabase, surveyId)) {
      return fail(
        "This survey already has responses, so this question's type can't change — add a new question instead.",
      );
    }
  }

  const { error } = await supabase
    .from("questions")
    .update({
      question_key: parsed.data.questionKey,
      question_type: parsed.data.questionType,
      title: parsed.data.title,
      description: parsed.data.description || null,
      placeholder: parsed.data.placeholder || null,
      is_required: parsed.data.isRequired,
      configuration: buildQuestionConfiguration(parsed.data),
    })
    .eq("id", questionId);

  if (error) {
    if (error.code === "23505") return fail("That question key is already used in this survey.");
    console.error("Failed to update question:", error.message);
    return fail("Something went wrong saving the question.");
  }

  revalidateSurvey(surveyId);
  return ok;
}

export async function deleteQuestion(surveyId: string, questionId: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("questions").delete().eq("id", questionId);

  if (error) {
    console.error("Failed to delete question:", error.message);
    return fail("Something went wrong deleting the question.");
  }

  revalidateSurvey(surveyId);
  return ok;
}

export async function moveQuestion(
  surveyId: string,
  sectionId: string,
  questionId: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  return moveSibling(surveyId, "questions", sectionId, questionId, direction);
}

function parseQuestionForm(
  formData: FormData,
): { success: true; data: import("@/lib/validation/survey-admin").QuestionInput } | { success: false; error: string } {
  const raw = {
    questionKey: formData.get("questionKey"),
    questionType: formData.get("questionType"),
    title: formData.get("title"),
    description: formData.get("description"),
    placeholder: formData.get("placeholder"),
    isRequired: formData.get("isRequired") === "on",
    minLength: emptyToUndefined(formData.get("minLength")),
    maxLength: emptyToUndefined(formData.get("maxLength")),
    minSelections: emptyToUndefined(formData.get("minSelections")),
    maxSelections: emptyToUndefined(formData.get("maxSelections")),
    ratingMinimum: emptyToUndefined(formData.get("ratingMinimum")),
    ratingMaximum: emptyToUndefined(formData.get("ratingMaximum")),
    mustBeTrue: formData.get("mustBeTrue") === "on",
  };

  const parsed = questionSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  return { success: true, data: parsed.data };
}

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return value;
}

// ---------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------

export async function createOption(
  surveyId: string,
  questionId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = optionSchema.safeParse({
    value: formData.get("value"),
    label: formData.get("label"),
    description: formData.get("description"),
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = await createClient();
  const displayOrder = await nextDisplayOrder("question_options", questionId);

  const { error } = await supabase.from("question_options").insert({
    question_id: questionId,
    value: parsed.data.value,
    label: parsed.data.label,
    description: parsed.data.description || null,
    display_order: displayOrder,
  });

  if (error) {
    if (error.code === "23505") return fail("That option value is already used on this question.");
    console.error("Failed to create option:", error.message);
    return fail("Something went wrong creating the option.");
  }

  revalidateSurvey(surveyId);
  return ok;
}

export async function updateOption(
  surveyId: string,
  optionId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = optionSchema.safeParse({
    value: formData.get("value"),
    label: formData.get("label"),
    description: formData.get("description"),
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

  const supabase = await createClient();

  const { data: current } = await supabase
    .from("question_options")
    .select("value")
    .eq("id", optionId)
    .single();

  if (current && current.value !== parsed.data.value) {
    if (await surveyHasResponses(supabase, surveyId)) {
      return fail(
        "This survey already has responses, so this option's value can't change — past answers are matched by it.",
      );
    }
  }

  const { error } = await supabase
    .from("question_options")
    .update({
      value: parsed.data.value,
      label: parsed.data.label,
      description: parsed.data.description || null,
    })
    .eq("id", optionId);

  if (error) {
    if (error.code === "23505") return fail("That option value is already used on this question.");
    console.error("Failed to update option:", error.message);
    return fail("Something went wrong saving the option.");
  }

  revalidateSurvey(surveyId);
  return ok;
}

export async function deleteOption(surveyId: string, optionId: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("question_options").delete().eq("id", optionId);

  if (error) {
    console.error("Failed to delete option:", error.message);
    return fail("Something went wrong deleting the option.");
  }

  revalidateSurvey(surveyId);
  return ok;
}

export async function moveOption(
  surveyId: string,
  questionId: string,
  optionId: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  return moveSibling(surveyId, "question_options", questionId, optionId, direction);
}

// ---------------------------------------------------------------------
// Shared reorder helper — swaps display_order with the adjacent sibling
// under the same parent, rather than requiring a full reordered list.
// ---------------------------------------------------------------------

async function moveSibling(
  surveyId: string,
  table: OrderableTable,
  parentId: string,
  itemId: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  const listResult =
    table === "survey_sections"
      ? await supabase
          .from("survey_sections")
          .select("id, display_order")
          .eq("survey_id", parentId)
          .order("display_order", { ascending: true })
      : table === "questions"
        ? await supabase
            .from("questions")
            .select("id, display_order")
            .eq("section_id", parentId)
            .order("display_order", { ascending: true })
        : await supabase
            .from("question_options")
            .select("id, display_order")
            .eq("question_id", parentId)
            .order("display_order", { ascending: true });

  const siblings = listResult.data;

  if (listResult.error || !siblings) {
    console.error("Failed to load items for reorder:", listResult.error?.message);
    return fail("Something went wrong reordering.");
  }

  const index = siblings.findIndex((item) => item.id === itemId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= siblings.length) {
    return ok; // already at the boundary — no-op, not an error
  }

  const current = siblings[index];
  const swapWith = siblings[swapIndex];

  const [{ error: error1 }, { error: error2 }] = await Promise.all([
    supabase.from(table).update({ display_order: swapWith.display_order }).eq("id", current.id),
    supabase.from(table).update({ display_order: current.display_order }).eq("id", swapWith.id),
  ]);

  if (error1 || error2) {
    console.error("Failed to swap display order:", error1?.message, error2?.message);
    return fail("Something went wrong reordering.");
  }

  revalidateSurvey(surveyId);
  return ok;
}
