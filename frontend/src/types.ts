export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEWING"
  | "OFFER"
  | "REJECTED"
  | "ARCHIVED";

export type Application = {
  id: number;
  companyName: string;
  jobTitle: string;
  jobUrl: string | null;
  location: string | null;
  status: ApplicationStatus;
  source: string | null;
  appliedDate: string | null;
  nextAction: string | null;
  followUpDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationInput = {
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  location?: string;
  status: ApplicationStatus;
  source?: string;
  appliedDate?: string;
  nextAction?: string;
  followUpDate?: string;
  notes?: string;
};
