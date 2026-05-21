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

const optionalText = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => value || null);

export const interviewNoteSchema = z.object({
  roundName: optionalText,
  interviewDate: optionalDate,
  interviewer: optionalText,
  format: optionalText,
  summary: optionalText,
  questions: optionalText,
  nextSteps: optionalText,
  result: optionalText
});

export const interviewNoteUpdateSchema = interviewNoteSchema.partial();
