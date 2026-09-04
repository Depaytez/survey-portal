import { z } from "zod";
import type { Json } from "@/types/database.types";

export const surveyStatuses = ["DRAFT", "PUBLISHED", "HIDDEN", "CLOSED", "ARCHIVED"] as const;
export type SurveyStatus = (typeof surveyStatuses)[number];

/**
 * Legal status transitions. Matches the lifecycle diagram in the product
 * spec: DRAFT -> PUBLISHED -> (branch to HIDDEN) -> CLOSED -> ARCHIVED.
 * HIDDEN <-> PUBLISHED is a two-way toggle (visibility only, not a
 * one-way step) since delisting-then-relisting is a normal admin action.
 * ARCHIVED is terminal by design — reopening a closed/archived study is
 * not a Version 1 workflow.
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<SurveyStatus, SurveyStatus[]> = {
  DRAFT: ["PUBLISHED"],
  PUBLISHED: ["HIDDEN", "CLOSED"],
  HIDDEN: ["PUBLISHED", "CLOSED"],
  CLOSED: ["ARCHIVED"],
  ARCHIVED: [],
};

export const questionTypes = [
  "short_text",
  "long_text",
  "email",
  "single_choice",
  "multiple_choice",
  "rating",
  "boolean",
] as const;
export type QuestionType = (typeof questionTypes)[number];

const slugSchema = z
  .string()
  .trim()
  .min(3, "Slug must be at least 3 characters")
  .max(200)
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens only (e.g. my-survey-title)",
  );

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export const surveyCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  slug: slugSchema,
  shortDescription: z.string().trim().max(500).optional().or(z.literal("")),
});
export type SurveyCreateInput = z.infer<typeof surveyCreateSchema>;

export const surveyDetailsSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  slug: slugSchema,
  shortTitle: z.string().trim().max(300).optional().or(z.literal("")),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  shortDescription: z.string().trim().max(500).optional().or(z.literal("")),
  estimatedDuration: z.string().trim().max(100).optional().or(z.literal("")),
  isListedPublicly: z.boolean(),
  welcomeTitle: z.string().trim().max(300).optional().or(z.literal("")),
  welcomeDescription: z.string().trim().max(2000).optional().or(z.literal("")),
  completionTitle: z.string().trim().max(300).optional().or(z.literal("")),
  completionDescription: z.string().trim().max(2000).optional().or(z.literal("")),
  consentText: z.string().trim().max(2000).optional().or(z.literal("")),
  contactPrivacyNotice: z.string().trim().max(2000).optional().or(z.literal("")),
});
export type SurveyDetailsInput = z.infer<typeof surveyDetailsSchema>;

export const sectionSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
});
export type SectionInput = z.infer<typeof sectionSchema>;

export const optionSchema = z.object({
  value: z
    .string()
    .trim()
    .min(1, "Value is required")
    .max(200)
    .regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers, and underscores only"),
  label: z.string().trim().min(1, "Label is required").max(300),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});
export type OptionInput = z.infer<typeof optionSchema>;

export const questionSchema = z
  .object({
    questionKey: z
      .string()
      .trim()
      .min(1, "Key is required")
      .max(200)
      .regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers, and underscores only"),
    questionType: z.enum(questionTypes),
    title: z.string().trim().min(1, "Title is required").max(500),
    description: z.string().trim().max(2000).optional().or(z.literal("")),
    placeholder: z.string().trim().max(300).optional().or(z.literal("")),
    isRequired: z.boolean(),
    // Type-specific configuration — validated per-type below.
    minLength: z.coerce.number().int().min(0).optional(),
    maxLength: z.coerce.number().int().min(1).optional(),
    minSelections: z.coerce.number().int().min(1).optional(),
    maxSelections: z.coerce.number().int().min(1).optional(),
    ratingMinimum: z.coerce.number().int().optional(),
    ratingMaximum: z.coerce.number().int().optional(),
    mustBeTrue: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.questionType !== "multiple_choice" ||
      !data.minSelections ||
      !data.maxSelections ||
      data.minSelections <= data.maxSelections,
    { message: "Minimum selections can't exceed maximum", path: ["minSelections"] },
  )
  .refine(
    (data) =>
      data.questionType !== "rating" ||
      data.ratingMinimum === undefined ||
      data.ratingMaximum === undefined ||
      data.ratingMinimum < data.ratingMaximum,
    { message: "Rating minimum must be less than maximum", path: ["ratingMinimum"] },
  );
export type QuestionInput = z.infer<typeof questionSchema>;

/** Builds the `configuration` JSON stored on the question row from the flat form input. */
export function buildQuestionConfiguration(input: QuestionInput): Record<string, Json> {
  switch (input.questionType) {
    case "short_text":
    case "long_text": {
      const config: Record<string, Json> = {};
      if (input.minLength !== undefined) config.minLength = input.minLength;
      if (input.maxLength !== undefined) config.maxLength = input.maxLength;
      return config;
    }
    case "multiple_choice": {
      const config: Record<string, Json> = {};
      if (input.minSelections !== undefined) config.minSelections = input.minSelections;
      if (input.maxSelections !== undefined) config.maxSelections = input.maxSelections;
      return config;
    }
    case "rating": {
      const config: Record<string, Json> = {};
      if (input.ratingMinimum !== undefined) config.minimum = input.ratingMinimum;
      if (input.ratingMaximum !== undefined) config.maximum = input.ratingMaximum;
      return config;
    }
    case "boolean":
      return input.mustBeTrue ? { mustBeTrue: true } : {};
    default:
      return {};
  }
}

/** True for question types that need an options list (single_choice, multiple_choice, rating). */
export function questionTypeNeedsOptions(type: QuestionType): boolean {
  return type === "single_choice" || type === "multiple_choice" || type === "rating";
}
