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
  resumeVersionId: number | null;
  resumeVersion?: ResumeVersion | null;
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
  resumeVersionId?: number | null;
  notes?: string;
};

export type ResumeVersion = {
  id: number;
  name: string;
  targetRole: string | null;
  fileUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ResumeVersionInput = {
  name: string;
  targetRole?: string;
  fileUrl?: string;
  notes?: string;
};

export type CompanyResearch = {
  id: number;
  applicationId: number;
  companyWebsite: string | null;
  companySize: string | null;
  industry: string | null;
  location: string | null;
  mission: string | null;
  products: string | null;
  techStack: string | null;
  cultureNotes: string | null;
  interviewTips: string | null;
  redFlags: string | null;
  whyInterested: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CompanyResearchInput = {
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  location?: string;
  mission?: string;
  products?: string;
  techStack?: string;
  cultureNotes?: string;
  interviewTips?: string;
  redFlags?: string;
  whyInterested?: string;
};

export type InterviewNote = {
  id: number;
  applicationId: number;
  roundName: string | null;
  interviewDate: string | null;
  interviewer: string | null;
  format: string | null;
  summary: string | null;
  questions: string | null;
  nextSteps: string | null;
  result: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InterviewNoteInput = {
  roundName?: string;
  interviewDate?: string;
  interviewer?: string;
  format?: string;
  summary?: string;
  questions?: string;
  nextSteps?: string;
  result?: string;
};
