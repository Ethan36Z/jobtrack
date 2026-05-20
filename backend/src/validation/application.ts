import { ApplicationStatus } from "@prisma/client";
import { z } from "zod";

const optionalDate = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => {
    if (!value) {
      return null;
    }

    return new Date(value);
  })
  .refine((value) => value === null || !Number.isNaN(value.getTime()), {
    message: "Invalid date"
  });

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

export const applicationSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),
  jobTitle: z.string().trim().min(1, "Job title is required"),
  jobUrl: optionalUrl,
  location: optionalText,
  status: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.SAVED),
  source: optionalText,
  appliedDate: optionalDate,
  nextAction: optionalText,
  followUpDate: optionalDate,
  notes: optionalText
});

export const applicationUpdateSchema = applicationSchema.partial();
