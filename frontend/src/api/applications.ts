import type { Application, ApplicationInput } from "../types";

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
