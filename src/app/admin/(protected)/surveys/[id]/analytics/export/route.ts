import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSurveyForAdmin } from "@/lib/supabase/queries/survey-admin";

function csvCell(raw: string): string {
  if (/[",\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(String).join("; ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

/**
 * Raw CSV dump of every submitted response, one row per response, one
 * column per question in builder order. This is the one place in
 * analytics that's allowed to pull every row at once — it's an explicit,
 * admin-triggered export, not something the analytics page loads by
 * default (that stays server-aggregated per the spec's "never dump
 * everything to the browser" rule).
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const survey = await getSurveyForAdmin(id);
  if (!survey) {
    return new Response("Not found", { status: 404 });
  }

  const questions = survey.sections.flatMap((section) => section.questions);

  const supabase = await createClient();
  const { data: responses, error } = await supabase
    .from("survey_responses")
    .select("id, submitted_at, response_answers(question_id, value)")
    .eq("survey_id", id)
    .eq("status", "SUBMITTED")
    .order("submitted_at", { ascending: true });

  if (error) {
    console.error(`Failed to export responses for survey ${id}:`, error.message);
    return new Response("Failed to generate export", { status: 500 });
  }

  const header = ["Submitted At", ...questions.map((q) => q.title)];
  const rows = responses.map((response) => {
    const answersByQuestion = new Map(
      response.response_answers.map((a) => [a.question_id, a.value]),
    );
    return [
      response.submitted_at ? new Date(response.submitted_at).toISOString() : "",
      ...questions.map((q) => formatValue(answersByQuestion.get(q.id))),
    ];
  });

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => csvCell(cell)).join(","))
    .join("\r\n");

  const filename = `${survey.slug}-responses-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
