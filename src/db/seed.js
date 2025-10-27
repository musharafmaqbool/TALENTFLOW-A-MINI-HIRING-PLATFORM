import { db } from './index';

const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
];

const JOB_TITLES = [
  'Senior Full Stack Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'DevOps Engineer',
  'Product Manager',
  'UX Designer',
  'Data Scientist',
  'Mobile Developer',
  'QA Engineer',
  'Engineering Manager',
  'Senior Backend Developer',
  'React Developer',
  'Node.js Developer',
  'Cloud Architect',
  'Security Engineer',
  'Machine Learning Engineer',
  'iOS Developer',
  'Android Developer',
  'Full Stack Engineer',
  'Technical Lead',
  'Solutions Architect',
  'Site Reliability Engineer',
  'Platform Engineer',
  'API Developer',
  'Database Administrator',
];

const STAGES = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomElement(domains)}`;
}

export async function seedDatabase() {
  // Check if already seeded
  const jobCount = await db.jobs.count();
  if (jobCount > 0) {
    console.log('✅ Database already seeded');
    return;
  }

  console.log('🌱 Seeding database with fresh data...');
  
  // Clear ALL existing data (in case of partial seed)
  await db.users.clear();
  await db.jobs.clear();
  await db.candidates.clear();
  await db.stageHistory.clear();
  await db.assessments.clear();

  // Create users
  const users = [
    { id: '1', name: 'Admin User', email: 'admin@talentflow.com' },
    { id: '2', name: 'HR Manager', email: 'hr@talentflow.com' },
    { id: '3', name: 'Tech Lead', email: 'tech@talentflow.com' },
  ];

  await db.users.bulkAdd(users);

  // Create jobs
  const jobs = JOB_TITLES.map((title, index) => {
    // Mix of statuses: ~16 active, ~5 draft, ~4 archived
    let status;
    if (index < 16) {
      status = 'active';
    } else if (index < 21) {
      status = 'draft';
    } else {
      status = 'archived';
    }

    return {
      id: `job-${index + 1}`,
      title,
      slug: generateSlug(title),
      description: `We are looking for an experienced ${title} to join our team. This role requires strong technical skills and excellent communication abilities.`,
      status,
      tags: randomElement([
        ['remote', 'full-time'],
        ['on-site', 'full-time'],
        ['hybrid', 'contract'],
        ['remote', 'part-time'],
        ['hybrid', 'full-time'],
        ['remote', 'contract'],
      ]),
      order: index,
      createdAt: new Date(Date.now() - randomInt(1, 60) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  await db.jobs.bulkAdd(jobs);

  // Create 50 candidates (fast loading, perfect for demo)
  const candidates = [];
  const stageHistory = [];
  const activeJobs = jobs.filter(j => j.status === 'active');
  for (let i = 0; i < 50; i++) {
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    const job = randomElement(activeJobs);
    const stage = randomElement(STAGES);
    const appliedAt = new Date(Date.now() - randomInt(1, 90) * 24 * 60 * 60 * 1000);

    const candidate = {
      id: `candidate-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: generateEmail(firstName, lastName),
      phone: `+1${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
      jobId: job.id,
      currentStage: stage,
      appliedAt: appliedAt.toISOString(),
      notes: [],
    };

    candidates.push(candidate);

    // Create initial stage history
    stageHistory.push({
      id: `history-${i + 1}-1`,
      candidateId: candidate.id,
      fromStage: null,
      toStage: 'applied',
      timestamp: appliedAt.toISOString(),
      changedBy: randomElement(users).id,
    });

    // If not in 'applied' stage, add more history
    if (stage !== 'applied') {
      const stageIndex = STAGES.indexOf(stage);
      for (let j = 1; j <= stageIndex; j++) {
        const historyDate = new Date(appliedAt.getTime() + j * 5 * 24 * 60 * 60 * 1000);
        stageHistory.push({
          id: `history-${i + 1}-${j + 1}`,
          candidateId: candidate.id,
          fromStage: STAGES[j - 1],
          toStage: STAGES[j],
          timestamp: historyDate.toISOString(),
          changedBy: randomElement(users).id,
        });
      }
    }
  }

  await db.candidates.bulkAdd(candidates);
  await db.stageHistory.bulkAdd(stageHistory);

  // Create 3 assessments with 6 questions each (fast, still impressive)
  const assessments = activeJobs.slice(0, 3).map((job, index) => ({
    id: `assessment-${index + 1}`,
    jobId: job.id,
    title: `${job.title} Assessment`,
    description: `Assessment for ${job.title} position`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: `section-${index + 1}-1`,
        title: 'Technical Skills',
        description: 'Evaluate your technical knowledge',
        order: 0,
        questions: [
          {
            id: `q-${index + 1}-1`,
            type: 'single-choice',
            text: 'How many years of professional experience do you have?',
            required: true,
            order: 0,
            options: ['0-2 years', '2-5 years', '5-10 years', '10+ years'],
          },
          {
            id: `q-${index + 1}-2`,
            type: 'multi-choice',
            text: 'Which of the following technologies are you proficient in?',
            required: true,
            order: 1,
            options: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Go', 'Rust'],
          },
          {
            id: `q-${index + 1}-3`,
            type: 'numeric',
            text: 'On a scale of 1-10, how would you rate your problem-solving skills?',
            required: true,
            order: 2,
            min: 1,
            max: 10,
          },
          {
            id: `q-${index + 1}-4`,
            type: 'short-text',
            text: 'What is your current job title?',
            required: false,
            order: 3,
            maxLength: 100,
          },
          {
            id: `q-${index + 1}-5`,
            type: 'long-text',
            text: 'Describe a challenging project you worked on.',
            required: true,
            order: 4,
            maxLength: 500,
          },
        ],
      },
      {
        id: `section-${index + 1}-2`,
        title: 'Work Preferences',
        description: 'Tell us about your work preferences',
        order: 1,
        questions: [
          {
            id: `q-${index + 1}-6`,
            type: 'single-choice',
            text: 'Are you open to remote work?',
            required: true,
            order: 0,
            options: ['Yes', 'No', 'Hybrid preferred'],
          },
        ],
      },
    ],
  }));

  await db.assessments.bulkAdd(assessments);

  console.log('✅ Database seeded successfully!');
  console.log(`📋 ${jobs.length} jobs (16 active, 5 draft, 4 archived)`);
  console.log(`👥 ${candidates.length} candidates across all stages`);
  console.log(`📝 ${assessments.length} assessments with 6 questions each`);
  console.log(`📊 ${stageHistory.length} stage history records`);
  console.log(`⚡ Lightning-fast loading!`);
}

