import { http, HttpResponse, delay } from 'msw';
import { db } from '@/db';

const API_BASE = '/api';

// Simulate network latency (200-1200ms)
const randomDelay = () => delay(Math.random() * 1000 + 200);

// Simulate 5-10% error rate for write operations
const shouldFail = () => Math.random() < 0.075;

export const handlers = [
  // Jobs endpoints
  http.get(`${API_BASE}/jobs`, async ({ request }) => {
    await randomDelay();
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    const tags = url.searchParams.get('tags')?.split(',').filter(Boolean);

    let jobs = await db.jobs.orderBy('order').toArray();

    // Apply filters
    if (status) {
      jobs = jobs.filter(job => job.status === status);
    }
    if (search) {
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (tags && tags.length > 0) {
      jobs = jobs.filter(job => 
        tags.some(tag => job.tags.includes(tag))
      );
    }

    const total = jobs.length;
    const start = (page - 1) * limit;
    const paginatedJobs = jobs.slice(start, start + limit);

    return HttpResponse.json({
      data: paginatedJobs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }),

  http.get(`${API_BASE}/jobs/:id`, async ({ params }) => {
    await randomDelay();
    const job = await db.jobs.get(params.id);
    
    if (!job) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(job);
  }),

  http.post(`${API_BASE}/jobs`, async ({ request }) => {
    await randomDelay();
    
    if (shouldFail()) {
      return new HttpResponse(null, { 
        status: 500,
        statusText: 'Internal Server Error' 
      });
    }

    const body = await request.json();
    const existingCount = await db.jobs.count();
    
    // Check for unique slug
    const existingJob = await db.jobs.where('slug').equals(body.slug).first();
    if (existingJob) {
      return HttpResponse.json(
        { error: 'Slug must be unique' },
        { status: 400 }
      );
    }

    const job = {
      id: `job-${Date.now()}`,
      title: body.title,
      slug: body.slug,
      description: body.description || '',
      status: body.status || 'draft',
      tags: body.tags || [],
      order: existingCount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.jobs.add(job);
    return HttpResponse.json(job, { status: 201 });
  }),

  http.patch(`${API_BASE}/jobs/:id`, async ({ params, request }) => {
    await randomDelay();
    
    if (shouldFail()) {
      return new HttpResponse(null, { 
        status: 500,
        statusText: 'Internal Server Error' 
      });
    }

    const id = params.id;
    const updates = await request.json();
    const job = await db.jobs.get(id);

    if (!job) {
      return new HttpResponse(null, { status: 404 });
    }

    // Check for unique slug if being updated
    if (updates.slug && updates.slug !== job.slug) {
      const existingJob = await db.jobs.where('slug').equals(updates.slug).first();
      if (existingJob) {
        return HttpResponse.json(
          { error: 'Slug must be unique' },
          { status: 400 }
        );
      }
    }

    const updatedJob = {
      ...job,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await db.jobs.update(id, updatedJob);
    return HttpResponse.json(updatedJob);
  }),

  http.patch(`${API_BASE}/jobs/reorder`, async ({ request }) => {
    await randomDelay();
    
    if (shouldFail()) {
      return new HttpResponse(null, { 
        status: 500,
        statusText: 'Internal Server Error' 
      });
    }

    const { jobIds } = await request.json();
    
    await db.transaction('rw', db.jobs, async () => {
      for (let i = 0; i < jobIds.length; i++) {
        await db.jobs.update(jobIds[i], { order: i });
      }
    });

    return HttpResponse.json({ success: true });
  }),

  // Candidates endpoints
  http.get(`${API_BASE}/candidates`, async ({ request }) => {
    await randomDelay();
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const search = url.searchParams.get('search');
    const stage = url.searchParams.get('stage');
    const jobId = url.searchParams.get('jobId');

    let candidates = await db.candidates.toArray();

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      candidates = candidates.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower)
      );
    }
    if (stage) {
      candidates = candidates.filter(c => c.currentStage === stage);
    }
    if (jobId) {
      candidates = candidates.filter(c => c.jobId === jobId);
    }

    const total = candidates.length;
    const start = (page - 1) * limit;
    const paginatedCandidates = candidates.slice(start, start + limit);

    return HttpResponse.json({
      data: paginatedCandidates,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }),

  http.post(`${API_BASE}/candidates`, async ({ request }) => {
    await randomDelay();
    
    if (shouldFail()) {
      return new HttpResponse(null, { 
        status: 500,
        statusText: 'Internal Server Error' 
      });
    }

    const body = await request.json();
    
    const candidate = {
      id: `candidate-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      jobId: body.jobId,
      currentStage: body.stage || 'applied',
      appliedAt: new Date().toISOString(),
      notes: [],
    };

    await db.candidates.add(candidate);
    
    // Add initial stage history
    await db.stageHistory.add({
      id: `history-${Date.now()}`,
      candidateId: candidate.id,
      fromStage: null,
      toStage: candidate.currentStage,
      timestamp: new Date().toISOString(),
      changedBy: '1',
    });

    return HttpResponse.json(candidate, { status: 201 });
  }),

  http.get(`${API_BASE}/candidates/:id`, async ({ params }) => {
    await randomDelay();
    const candidate = await db.candidates.get(params.id);
    
    if (!candidate) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(candidate);
  }),

  http.get(`${API_BASE}/candidates/:id/history`, async ({ params }) => {
    await randomDelay();
    const history = await db.stageHistory
      .where('candidateId')
      .equals(params.id)
      .sortBy('timestamp');
    
    return HttpResponse.json(history);
  }),

  http.patch(`${API_BASE}/candidates/:id/stage`, async ({ params, request }) => {
    await randomDelay();
    
    if (shouldFail()) {
      return new HttpResponse(null, { 
        status: 500,
        statusText: 'Internal Server Error' 
      });
    }

    const id = params.id;
    const { stage } = await request.json();
    const candidate = await db.candidates.get(id);

    if (!candidate) {
      return new HttpResponse(null, { status: 404 });
    }

    const history = {
      id: `history-${Date.now()}`,
      candidateId: id,
      fromStage: candidate.currentStage,
      toStage: stage,
      timestamp: new Date().toISOString(),
      changedBy: '1', // Admin user
    };

    await db.stageHistory.add(history);
    await db.candidates.update(id, { currentStage: stage });

    return HttpResponse.json({ ...candidate, currentStage: stage });
  }),

  // Assessments endpoints
  http.get(`${API_BASE}/assessments`, async ({ request }) => {
    await randomDelay();
    
    const url = new URL(request.url);
    const jobId = url.searchParams.get('jobId');

    let assessments = await db.assessments.toArray();

    if (jobId) {
      assessments = assessments.filter(a => a.jobId === jobId);
    }

    return HttpResponse.json(assessments);
  }),

  http.get(`${API_BASE}/assessments/:id`, async ({ params }) => {
    await randomDelay();
    const assessment = await db.assessments.get(params.id);
    
    if (!assessment) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(assessment);
  }),

  http.post(`${API_BASE}/assessments`, async ({ request }) => {
    await randomDelay();
    
    if (shouldFail()) {
      return new HttpResponse(null, { 
        status: 500,
        statusText: 'Internal Server Error' 
      });
    }

    const body = await request.json();
    
    const assessment = {
      id: `assessment-${Date.now()}`,
      jobId: body.jobId,
      title: body.title,
      description: body.description,
      sections: body.sections || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.assessments.add(assessment);
    return HttpResponse.json(assessment, { status: 201 });
  }),

  http.patch(`${API_BASE}/assessments/:id`, async ({ params, request }) => {
    await randomDelay();
    
    if (shouldFail()) {
      return new HttpResponse(null, { 
        status: 500,
        statusText: 'Internal Server Error' 
      });
    }

    const id = params.id;
    const updates = await request.json();
    const assessment = await db.assessments.get(id);

    if (!assessment) {
      return new HttpResponse(null, { status: 404 });
    }

    const updatedAssessment = {
      ...assessment,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await db.assessments.update(id, updatedAssessment);
    return HttpResponse.json(updatedAssessment);
  }),

  http.post(`${API_BASE}/assessments/:id/responses`, async ({ params, request }) => {
    await randomDelay();
    
    if (shouldFail()) {
      return new HttpResponse(null, { 
        status: 500,
        statusText: 'Internal Server Error' 
      });
    }

    const body = await request.json();
    
    const response = {
      id: `response-${Date.now()}`,
      assessmentId: params.id,
      candidateId: body.candidateId,
      answers: body.answers,
      completedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
    };

    await db.assessmentResponses.add(response);
    return HttpResponse.json(response, { status: 201 });
  }),
];

