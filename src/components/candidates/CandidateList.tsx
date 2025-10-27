import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Search } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { api, ApiError } from '@/utils/api';
import type { Candidate, CandidateStage } from '@/types';
import { formatDistance } from 'date-fns';

const STAGE_LABELS: Record<CandidateStage, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

const STAGE_VARIANTS: Record<CandidateStage, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  applied: 'info',
  screening: 'warning',
  interview: 'warning',
  offer: 'success',
  hired: 'success',
  rejected: 'danger',
};

export function CandidateList() {
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Client-side search
  const [searchQuery, setSearchQuery] = useState('');
  
  // Server-like filter
  const [stageFilter, setStageFilter] = useState<CandidateStage | 'all'>('all');

  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCandidates();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allCandidates, searchQuery, stageFilter]);

  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load all candidates (server returns paginated, but we'll load all for virtualization)
      const response = await api.getCandidates({ limit: 10000 }) as any;
      setAllCandidates(response.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load candidates');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allCandidates];

    // Client-side search (name/email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query)
      );
    }

    // Server-like filter (current stage)
    if (stageFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.currentStage === stageFilter);
    }

    setFilteredCandidates(filtered);
  };

  const virtualizer = useVirtualizer({
    count: filteredCandidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
        <p className="text-gray-600 mt-1">
          Showing {filteredCandidates.length.toLocaleString()} of {allCandidates.length.toLocaleString()} candidates
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as CandidateStage | 'all')}
            options={[
              { value: 'all', label: 'All Stages' },
              { value: 'applied', label: 'Applied' },
              { value: 'screening', label: 'Screening' },
              { value: 'interview', label: 'Interview' },
              { value: 'offer', label: 'Offer' },
              { value: 'hired', label: 'Hired' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Virtualized List */}
      <div
        ref={parentRef}
        className="bg-white border border-gray-200 rounded-lg overflow-auto"
        style={{ height: '600px' }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const candidate = filteredCandidates[virtualRow.index];
            
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <Link
                  to={`/candidates/${candidate.id}`}
                  className="block p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{candidate.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied {formatDistance(new Date(candidate.appliedAt), new Date(), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge variant={STAGE_VARIANTS[candidate.currentStage]}>
                        {STAGE_LABELS[candidate.currentStage]}
                      </Badge>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        
        {filteredCandidates.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No candidates found</p>
          </div>
        )}
      </div>
    </div>
  );
}

