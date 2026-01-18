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

export const biographyApi = {
  setBiography,
  submitBiography,
  getPendingSubmissions,
  approveSubmission,
};
