import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSurveyBySlug } from "@/lib/supabase/queries/survey-detail";
import { SurveyRunner } from "./survey-runner";
import { SurveyClosed } from "./survey-closed";

export async function generateMetadata({
  params,
}: PageProps<"/survey/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const survey = await getSurveyBySlug(slug);
  return { title: survey ? `${survey.title} — African Tourism Research Platform` : "Survey" };
}

export default async function SurveyPage({ params }: PageProps<"/survey/[slug]">) {
  const { slug } = await params;
  const survey = await getSurveyBySlug(slug);

  if (!survey) {
    notFound();
  }

  if (survey.status === "CLOSED") {
    return <SurveyClosed title={survey.title} />;
  }

  return <SurveyRunner survey={survey} />;
}
