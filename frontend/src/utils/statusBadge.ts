import type { ApplicationStatus } from "../types";

export function getStatusBadgeClass(status: ApplicationStatus) {
  return `status status-${status.toLowerCase()}`;
}
