import apiClient from './client';
import type { BiographySubmission } from '../types';

/**
 * Set biography directly (for Knights and above).
 * @param biography - The biography text to set
 */
async function setBiography(biography: string): Promise<void> {
  await apiClient.post('/biography', { biography });
}

/**
 * Submit a biography for approval (for Paissa rank members).
 * @param biography - The biography text to submit for review
 */
async function submitBiography(biography: string): Promise<void> {
  await apiClient.post('/submission', { biography });
}

/**
 * Retrieve all pending biography submissions (for Knights and above).
 */
async function getPendingSubmissions(): Promise<BiographySubmission[]> {
  const response = await apiClient.get<BiographySubmission[]>('/submission');
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Approve a pending biography submission (for Knights and above).
 * @param submissionId - The submissionId of the submission to approve (NOT the id field)
 */
async function approveSubmission(submissionId: string): Promise<void> {
  await apiClient.post(`/submission/approve/${submissionId}`);
}

/**
 * Reject a pending biography submission (for Knights and above).
 * @param submissionId - The submissionId of the submission to reject (NOT the id field)
 */
async function rejectSubmission(submissionId: string): Promise<void> {
  await apiClient.post(`/submission/reject/${submissionId}`);
}

/**
 * Get the last pending submission for a user, or their most recently approved one if no pending.
 * @param memberId - The member ID to get submission for
 */
async function getSubmission(memberId: string): Promise<BiographySubmission | null> {
  try {
    const response = await apiClient.get<BiographySubmission>(`/submission/${memberId}`);
    return response.data ?? null;
  } catch (error) {
    // Return null if no submission found (404) or other errors
    // This allows the UI to gracefully handle the "no submission" case
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        return null;
      }
    }
    throw error;
  }
}

/**
 * Edit a pending submission.
 * @param submissionId - The submissionId of the submission to edit
 * @param biography - The updated biography text
 */
async function editSubmission(submissionId: string, biography: string): Promise<void> {
  await apiClient.post(`/submission/edit/${submissionId}`, { biography });
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
