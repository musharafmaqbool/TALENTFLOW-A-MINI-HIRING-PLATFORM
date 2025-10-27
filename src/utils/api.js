const API_BASE = '/api';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new ApiError(response.status, error.error || response.statusText);
  }
  return response.json();
}

// Retry wrapper for fetch calls
async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
  try {
    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (error) {
    // Don't retry on client errors (4xx) or if no retries left
    if (error.status && error.status >= 400 && error.status < 500) {
      throw error;
    }
    
    if (retries > 0) {
      console.log(`Retrying request to ${url}... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await sleep(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    
    throw error;
  }
}

export const api = {
  // Jobs
  getJobs: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.status) searchParams.set('status', params.status);
    if (params.search) searchParams.set('search', params.search);
    if (params.tags) searchParams.set('tags', params.tags.join(','));

    return fetchWithRetry(`${API_BASE}/jobs?${searchParams}`);
  },

  getJob: async (id) => {
    return fetchWithRetry(`${API_BASE}/jobs/${id}`);
  },

  createJob: async (job) => {
    return fetchWithRetry(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
  },

  updateJob: async (id, updates) => {
    return fetchWithRetry(`${API_BASE}/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  },

  reorderJobs: async (jobIds) => {
    return fetchWithRetry(`${API_BASE}/jobs/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobIds }),
    });
  },

  // Candidates
  getCandidates: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.stage) searchParams.set('stage', params.stage);
    if (params.jobId) searchParams.set('jobId', params.jobId);

    return fetchWithRetry(`${API_BASE}/candidates?${searchParams}`);
  },

  getCandidate: async (id) => {
    return fetchWithRetry(`${API_BASE}/candidates/${id}`);
  },

  getCandidateHistory: async (id) => {
    return fetchWithRetry(`${API_BASE}/candidates/${id}/history`);
  },

  updateCandidateStage: async (id, stage) => {
    return fetchWithRetry(`${API_BASE}/candidates/${id}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    });
  },

  // Assessments
  getAssessments: async (jobId) => {
    const searchParams = new URLSearchParams();
    if (jobId) searchParams.set('jobId', jobId);

    return fetchWithRetry(`${API_BASE}/assessments?${searchParams}`);
  },

  getAssessment: async (id) => {
    return fetchWithRetry(`${API_BASE}/assessments/${id}`);
  },

  createAssessment: async (assessment) => {
    return fetchWithRetry(`${API_BASE}/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessment),
    });
  },

  updateAssessment: async (id, updates) => {
    return fetchWithRetry(`${API_BASE}/assessments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  },

  submitAssessmentResponse: async (assessmentId, candidateId, answers) => {
    return fetchWithRetry(`${API_BASE}/assessments/${assessmentId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId, answers }),
    });
  },
};

