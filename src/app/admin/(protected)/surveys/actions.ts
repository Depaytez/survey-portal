"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { surveyCreateSchema } from "@/lib/validation/survey-admin";

export type CreateSurveyState = {
  error?: string;
};

export async function createSurvey(
  _prevState: CreateSurveyState,
  formData: FormData,
): Promise<CreateSurveyState> {
  const session = await requireAdmin();

  const parsed = surveyCreateSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("surveys")
    .insert({
      title: parsed.data.title,
      slug: parsed.data.slug,
      short_description: parsed.data.shortDescription || null,
      created_by: session.userId,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "That slug is already in use by another survey." };
    }
    console.error("Failed to create survey:", error.message);
    return { error: "Something went wrong creating the survey." };
  }

  redirect(`/admin/surveys/${data.id}`);
}
