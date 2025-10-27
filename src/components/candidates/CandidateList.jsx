import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Search, AlertCircle, RefreshCw, Users } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { api, ApiError } from '@/utils/api';
import { formatDistance } from 'date-fns';

const STAGE_LABELS = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

const STAGE_VARIANTS = {
  applied: 'info',
  screening: 'warning',
  interview: 'warning',
  offer: 'success',
  hired: 'success',
  rejected: 'danger',
};

export function CandidateList() {
  const [allCandidates, setAllCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Client-side search
  const [searchQuery, setSearchQuery] = useState('');
  
  // Server-like filter
  const [stageFilter, setStageFilter] = useState('all');

  const parentRef = useRef(null);

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
      const response = await api.getCandidates({ limit: 10000 });
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
      <div className="animate-slide-down">
        <h1 className="text-4xl font-bold gradient-text mb-2">Candidates</h1>
        <p className="text-gray-600 text-lg">
          Showing {filteredCandidates.length.toLocaleString()} of {allCandidates.length.toLocaleString()} candidates
        </p>
      </div>

      {/* Filters */}
      <div className="glass p-6 rounded-2xl border border-gray-200/50 shadow-soft animate-slide-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm transition-all"
            />
          </div>

          <Select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
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
        <div className="glass rounded-xl p-6 border border-red-200 shadow-soft animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-medium">
              <AlertCircle className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Unable to load candidates</h3>
              <p className="text-gray-600">{error}</p>
            </div>
            <Button onClick={loadCandidates} variant="primary">
              <RefreshCw size={18} className="mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Virtualized List */}
      <div
        ref={parentRef}
        className="glass border border-gray-200/50 rounded-2xl overflow-auto shadow-soft custom-scrollbar"
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
                  className="block p-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary-50/30 hover:to-indigo-50/30 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{candidate.email}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
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
        
        {filteredCandidates.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Users className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600 max-w-sm">
              {searchQuery || stageFilter !== 'all'
                ? 'Try adjusting your filters to see more results'
                : 'No candidates have been added yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

