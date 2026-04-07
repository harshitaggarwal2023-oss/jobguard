import type { JobFormData, PredictionResult, AnalysisRecord, HealthStatus } from "./types";

const BASE_URL = typeof window !== "undefined" ? "" : "";

export async function analyzeJob(formData: JobFormData): Promise<PredictionResult & { id?: string }> {
  const res = await fetch(`${BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Analysis failed" }));
    throw new Error(err.detail || `Analysis failed with status ${res.status}`);
  }

  return res.json();
}

export async function getResults(page: number = 1, limit: number = 12): Promise<{
  results: AnalysisRecord[];
  total: number;
}> {
  const res = await fetch(`${BASE_URL}/api/results?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load results");
  return res.json();
}

export async function getResultById(id: string): Promise<AnalysisRecord> {
  const res = await fetch(`${BASE_URL}/api/results/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Result not found");
    if (res.status === 403) throw new Error("Access denied");
    throw new Error("Failed to load result");
  }
  return res.json();
}

export async function deleteResult(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/results/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete result");
}

export async function getHealth(): Promise<HealthStatus> {
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}
