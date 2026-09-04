import { createClient } from "@/lib/supabase/server";

export type PublicSurveySummary = {
  slug: string;
  title: string;
  shortTitle: string | null;
  shortDescription: string | null;
  description: string | null;
  estimatedDuration: string | null;
};

/**
 * Surveys eligible for the public listing: published, not withdrawn from
 * the general listing, ordered most-recently-published first. Hidden
 * surveys are intentionally excluded here — they're still reachable via a
 * direct link (see /survey/[slug] in Stage 3), just not advertised.
 */
export async function getListedPublicSurveys(): Promise<PublicSurveySummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("surveys")
    .select("slug, title, short_title, short_description, description, estimated_duration")
    .eq("status", "PUBLISHED")
    .eq("is_listed_publicly", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to load public surveys:", error.message);
    return [];
  }

  return data.map((survey) => ({
    slug: survey.slug,
    title: survey.title,
    shortTitle: survey.short_title,
    shortDescription: survey.short_description,
    description: survey.description,
    estimatedDuration: survey.estimated_duration,
  }));
}
