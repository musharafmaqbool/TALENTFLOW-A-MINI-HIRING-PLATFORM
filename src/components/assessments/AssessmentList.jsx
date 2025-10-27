import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { api, ApiError } from '@/utils/api';
import { db } from '@/db';
import { formatDistance } from 'date-fns';

export function AssessmentList() {
  const [assessments, setAssessments] = useState([]);
  const [jobs, setJobs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [assessmentsData, jobsData] = await Promise.all([
        api.getAssessments(),
        db.jobs.toArray(),
      ]);

      setAssessments(assessmentsData);
      
      const jobsMap = {};
      jobsData.forEach(job => {
        jobsMap[job.id] = job;
      });
      setJobs(jobsMap);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load assessments');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
          <p className="text-gray-600 mt-1">Create and manage job assessments</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assessments.map((assessment) => {
          const job = jobs[assessment.jobId];
          const questionCount = assessment.sections.reduce(
            (sum, section) => sum + section.questions.length,
            0
          );

          return (
            <Link
              key={assessment.id}
              to={`/assessments/${assessment.id}/edit`}
              className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <FileText size={24} className="text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {assessment.title}
                  </h3>
                  {job && (
                    <p className="text-sm text-gray-600 truncate">{job.title}</p>
                  )}
                </div>
              </div>

              {assessment.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {assessment.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{assessment.sections.length} sections</span>
                <span>{questionCount} questions</span>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Updated {formatDistance(new Date(assessment.updatedAt), new Date(), { addSuffix: true })}
              </p>
            </Link>
          );
        })}

        {/* Create New Card */}
        <Link
          to="/assessments/new"
          className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-500 hover:bg-primary-50 transition-colors min-h-[200px]"
        >
          <Plus size={48} className="text-gray-400 mb-2" />
          <p className="text-gray-600 font-medium">Create New Assessment</p>
        </Link>
      </div>

      {assessments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No assessments yet</p>
          <Link to="/assessments/new">
            <Button>
              <Plus size={20} className="mr-2" />
              Create Your First Assessment
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

