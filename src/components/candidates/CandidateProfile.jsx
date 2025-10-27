import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { api, ApiError } from '@/utils/api';
import { format } from 'date-fns';
import { db } from '@/db';

const STAGE_LABELS = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

export function CandidateProfile() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [history, setHistory] = useState([]);
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCandidateData();
  }, [id]);

  const loadCandidateData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      const [candidateData, historyData] = await Promise.all([
        api.getCandidate(id),
        api.getCandidateHistory(id),
      ]);

      setCandidate(candidateData);
      setHistory(historyData);

      // Load job details
      if (candidateData.jobId) {
        const jobData = await db.jobs.get(candidateData.jobId);
        setJob(jobData || null);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load candidate');
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

  if (error || !candidate) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error || 'Candidate not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link to="/candidates" className="inline-flex items-center text-primary-600 hover:text-primary-700">
        <ArrowLeft size={20} className="mr-2" />
        Back to Candidates
      </Link>

      {/* Candidate Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href={`mailto:${candidate.email}`} className="hover:text-primary-600">
                  {candidate.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>{candidate.phone}</span>
              </div>
            </div>
          </div>
          <Badge variant="info">{STAGE_LABELS[candidate.currentStage]}</Badge>
        </div>

        {job && (
          <div className="flex items-center gap-2 text-gray-600 mt-4 pt-4 border-t">
            <Briefcase size={16} />
            <span>Applied for:</span>
            <Link to={`/jobs/${job.id}`} className="font-medium text-primary-600 hover:text-primary-700">
              {job.title}
            </Link>
          </div>
        )}
      </div>

      {/* Stage Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
        
        <div className="space-y-4">
          {history.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${index === history.length - 1 ? 'bg-primary-600' : 'bg-gray-400'}`} />
                {index < history.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-300 mt-2" />
                )}
              </div>
              
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {event.fromStage ? (
                      <>
                        Moved from <span className="text-primary-600">{STAGE_LABELS[event.fromStage]}</span> to{' '}
                        <span className="text-primary-600">{STAGE_LABELS[event.toStage]}</span>
                      </>
                    ) : (
                      <>
                        Applied for position
                      </>
                    )}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {format(new Date(event.timestamp), 'PPpp')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {history.length === 0 && (
          <p className="text-gray-500 text-center py-4">No history available</p>
        )}
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
        
        {candidate.notes && candidate.notes.length > 0 ? (
          <div className="space-y-3">
            {candidate.notes.map((note) => (
              <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{note.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(note.createdAt), 'PPpp')} by {note.createdBy}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No notes yet</p>
        )}
      </div>
    </div>
  );
}

