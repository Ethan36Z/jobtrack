import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Must be a valid URL")
  .optional()
  .or(z.literal(""))
  .transform((value) => value || null);

const optionalText = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => value || null);

export const companyResearchSchema = z.object({
  companyWebsite: optionalUrl,
  companySize: optionalText,
  industry: optionalText,
  location: optionalText,
  mission: optionalText,
  products: optionalText,
  techStack: optionalText,
  cultureNotes: optionalText,
  interviewTips: optionalText,
  redFlags: optionalText,
  whyInterested: optionalText
});

export const companyResearchUpdateSchema = companyResearchSchema.partial();
