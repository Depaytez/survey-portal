import { z } from "zod";

// Keep in sync with the `category` check constraint on customer_care_requests
// (supabase/migrations/20260904131056_initial_schema.sql).
export const customerCareCategories = [
  "general",
  "technical_issue",
  "question",
  "feedback",
] as const;

export const customerCareSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  category: z.enum(customerCareCategories),
  message: z.string().trim().min(10, "Please provide a little more detail").max(4000),
});

export type CustomerCareInput = z.infer<typeof customerCareSchema>;

// Keep in sync with the `interest_type` check constraint on
// stakeholder_requests.
export const stakeholderInterestTypes = [
  "tourism_development_partnership",
  "research_collaboration",
  "data_research_support",
  "investment_programme_discussion",
  "general_inquiry",
] as const;

export const stakeholderRequestSchema = z.object({
  organizationName: z.string().trim().min(1, "Organization name is required").max(200),
  contactName: z.string().trim().min(1, "Contact name is required").max(200),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  interestType: z.enum(stakeholderInterestTypes),
  message: z.string().trim().min(10, "Please provide a little more detail").max(4000),
});

export type StakeholderRequestInput = z.infer<typeof stakeholderRequestSchema>;
