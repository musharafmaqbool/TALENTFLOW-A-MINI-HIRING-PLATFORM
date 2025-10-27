import Dexie from 'dexie';

export class TalentFlowDB extends Dexie {
  constructor() {
    super('TalentFlowDB');
    
    this.version(1).stores({
      jobs: 'id, slug, status, order, createdAt',
      candidates: 'id, email, name, jobId, currentStage, appliedAt',
      assessments: 'id, jobId, createdAt',
      assessmentResponses: 'id, assessmentId, candidateId',
      stageHistory: 'id, candidateId, timestamp',
      users: 'id, email',
      candidateNotes: 'id, candidateId, createdAt'
    });

    // Initialize tables
    this.jobs = this.table('jobs');
    this.candidates = this.table('candidates');
    this.assessments = this.table('assessments');
    this.assessmentResponses = this.table('assessmentResponses');
    this.stageHistory = this.table('stageHistory');
    this.users = this.table('users');
    this.candidateNotes = this.table('candidateNotes');
  }
}

export const db = new TalentFlowDB();

