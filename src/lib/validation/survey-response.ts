import { z } from "zod";
import type { SurveyQuestion } from "@/lib/supabase/queries/survey-detail";

export type AnswerValue = string | string[] | number | boolean;
export type AnswersByQuestionId = Record<string, AnswerValue | undefined>;

/**
 * Builds a Zod schema for one question's answer purely from its type and
 * configuration — never from its key or wording, so the engine works for
 * any future questionnaire without code changes. Used both client-side
 * (per-step "can I advance" checks) and server-side (the authoritative
 * check before a response is ever written).
 */
function buildQuestionSchema(question: SurveyQuestion): z.ZodTypeAny {
  const config = question.configuration;
  let schema: z.ZodTypeAny;

  switch (question.questionType) {
    case "short_text": {
      let s = z.string().trim().min(1, "This field is required");
      if (typeof config.minLength === "number") s = s.min(config.minLength);
      if (typeof config.maxLength === "number") s = s.max(config.maxLength);
      schema = s;
      break;
    }
    case "long_text": {
      let s = z.string().trim();
      if (typeof config.minLength === "number") s = s.min(config.minLength);
      if (typeof config.maxLength === "number") s = s.max(config.maxLength);
      schema = s;
      break;
    }
    case "email":
      schema = z.string().trim().email("Enter a valid email address");
      break;
    case "single_choice": {
      const values = question.options.map((option) => option.value);
      schema =
        values.length > 0
          ? z.enum(values as [string, ...string[]], {
              message: "Choose one option",
            })
          : z.string();
      break;
    }
    case "multiple_choice": {
      const values = question.options.map((option) => option.value);
      let s =
        values.length > 0
          ? z.array(z.enum(values as [string, ...string[]]))
          : z.array(z.string());
      const min =
        typeof config.minSelections === "number" ? config.minSelections : 1;
      s = s.min(min, `Select at least ${min}`);
      if (typeof config.maxSelections === "number") {
        s = s.max(config.maxSelections, `Select at most ${config.maxSelections}`);
      }
      schema = s;
      break;
    }
    case "rating": {
      let s = z.coerce.number();
      if (typeof config.minimum === "number") s = s.min(config.minimum);
      if (typeof config.maximum === "number") s = s.max(config.maximum);
      schema = s;
      break;
    }
    case "boolean":
      schema =
        config.mustBeTrue === true
          ? z.literal(true, { message: "This is required to continue" })
          : z.boolean();
      break;
    default:
      schema = z.unknown();
  }

  return question.isRequired ? schema : schema.optional().nullable();
}

/** Builds a schema covering exactly the given questions (e.g. one section's worth, or all of them). */
export function buildAnswersSchema(questions: SurveyQuestion[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const question of questions) {
    shape[question.id] = buildQuestionSchema(question);
  }
  return z.object(shape);
}
