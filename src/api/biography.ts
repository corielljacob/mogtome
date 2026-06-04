import apiClient from "./client";
import type { BiographySubmission } from "../types";

/** sets bio directly - Knights and above only */
async function setBiography(biography: string): Promise<void> {
  await apiClient.post("/profile/biography", { biography });
}

/** submits for approval - Paissa rank path */
async function submitBiography(biography: string): Promise<void> {
  await apiClient.post("/profile/biography/submission", { biography });
}

/** Knights and above only */
async function getPendingSubmissions(): Promise<BiographySubmission[]> {
  const response = await apiClient.get<BiographySubmission[]>(
    "/profile/biography/submission",
  );
  return Array.isArray(response.data) ? response.data : [];
}

/** Knights and above only. takes submissionId, NOT the id field */
async function approveSubmission(submissionId: string): Promise<void> {
  await apiClient.post(`/profile/biography/submission/approve/${submissionId}`);
}

/** Knights and above only. takes submissionId, NOT the id field */
async function rejectSubmission(submissionId: string): Promise<void> {
  await apiClient.post(`/profile/biography/submission/reject/${submissionId}`);
}

/** last pending submission, or the most recently approved one if none pending */
async function getSubmission(
  memberId: string,
): Promise<BiographySubmission | null> {
  try {
    const response = await apiClient.get<BiographySubmission>(
      `/profile/biography/submission/${memberId}`,
    );
    return response.data ?? null;
  } catch (error) {
    // 404 means no submission yet - let the UI treat that as an empty state
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        return null;
      }
    }
    throw error;
  }
}

async function editSubmission(
  submissionId: string,
  biography: string,
): Promise<void> {
  await apiClient.post(`/profile/biography/submission/edit/${submissionId}`, {
    biography,
  });
}

export const biographyApi = {
  setBiography,
  submitBiography,
  getPendingSubmissions,
  approveSubmission,
  rejectSubmission,
  getSubmission,
  editSubmission,
};
