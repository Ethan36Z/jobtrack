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

export const resumeVersionSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  targetRole: optionalText,
  fileUrl: optionalUrl,
  notes: optionalText
});

export const resumeVersionUpdateSchema = resumeVersionSchema.partial();
