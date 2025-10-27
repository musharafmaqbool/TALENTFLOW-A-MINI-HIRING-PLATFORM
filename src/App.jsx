import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { JobList } from './components/jobs/JobList';
import { CandidateList } from './components/candidates/CandidateList';
import { CandidateProfile } from './components/candidates/CandidateProfile';
import { KanbanBoard } from './components/candidates/KanbanBoard';
import { AssessmentList } from './components/assessments/AssessmentList';
import { AssessmentBuilder } from './components/assessments/AssessmentBuilder';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobList />} />
          
          <Route path="/candidates" element={<CandidateList />} />
          <Route path="/candidates/:id" element={<CandidateProfile />} />
          
          <Route path="/kanban" element={<KanbanBoard />} />
          
          <Route path="/assessments" element={<AssessmentList />} />
          <Route path="/assessments/new" element={<AssessmentBuilder />} />
          <Route path="/assessments/:id/edit" element={<AssessmentBuilder />} />
          <Route path="/assessments/job/:jobId" element={<AssessmentBuilder />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

