import type { Application, ApplicationInput, InterviewNote, InterviewNoteInput, ResumeVersion, ResumeVersionInput } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getApplications() {
  return request<Application[]>("/api/applications");
}

export function getApplication(id: string) {
  return request<Application>(`/api/applications/${id}`);
}

export function createApplication(input: ApplicationInput) {
  return request<Application>("/api/applications", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateApplication(id: string, input: Partial<ApplicationInput>) {
  return request<Application>(`/api/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(input)
  });
}

export function deleteApplication(id: string) {
  return request<void>(`/api/applications/${id}`, {
    method: "DELETE"
  });
}

export function getInterviewNotes(applicationId: string) {
  return request<InterviewNote[]>(`/api/applications/${applicationId}/interview-notes`);
}

export function createInterviewNote(applicationId: string, input: InterviewNoteInput) {
  return request<InterviewNote>(`/api/applications/${applicationId}/interview-notes`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateInterviewNote(id: string, input: Partial<InterviewNoteInput>) {
  return request<InterviewNote>(`/api/interview-notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(input)
  });
}

export function deleteInterviewNote(id: string) {
  return request<void>(`/api/interview-notes/${id}`, {
    method: "DELETE"
  });
}

export function getResumeVersions() {
  return request<ResumeVersion[]>("/api/resume-versions");
}

export function getResumeVersion(id: string) {
  return request<ResumeVersion>(`/api/resume-versions/${id}`);
}

export function createResumeVersion(input: ResumeVersionInput) {
  return request<ResumeVersion>("/api/resume-versions", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function updateResumeVersion(id: string, input: Partial<ResumeVersionInput>) {
  return request<ResumeVersion>(`/api/resume-versions/${id}`, {
    method: "PUT",
    body: JSON.stringify(input)
  });
}

export function deleteResumeVersion(id: string) {
  return request<void>(`/api/resume-versions/${id}`, {
    method: "DELETE"
  });
}
