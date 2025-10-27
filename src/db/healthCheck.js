import { db } from './index';

export async function checkDatabaseHealth() {
  try {
    const jobCount = await db.jobs.count();
    const candidateCount = await db.candidates.count();
    const assessmentCount = await db.assessments.count();
    const stageHistoryCount = await db.stageHistory.count();

    const health = {
      isHealthy: jobCount >= 25 && candidateCount >= 40 && assessmentCount >= 3,
      data: {
        jobs: jobCount,
        candidates: candidateCount,
        assessments: assessmentCount,
        stageHistory: stageHistoryCount,
      },
      expectedData: {
        jobs: '25',
        candidates: '50',
        assessments: '3',
      },
    };

    if (!health.isHealthy) {
      console.warn('⚠️ Database health check failed:', health);
    } else {
      console.log('✅ Database health check passed:', health.data);
    }

    return health;
  } catch (error) {
    console.error('❌ Database health check error:', error);
    return {
      isHealthy: false,
      error: error.message,
    };
  }
}

// Make it globally available for debugging
if (typeof window !== 'undefined') {
  window.checkDatabaseHealth = checkDatabaseHealth;
}

