import { parseApiDateAsLocalDay } from "./followUp";

export function formatDisplayDate(date: string | null) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(parseApiDateAsLocalDay(date));
}
