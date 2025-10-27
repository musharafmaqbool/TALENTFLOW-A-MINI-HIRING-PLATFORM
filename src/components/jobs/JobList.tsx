import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Plus, Search } from 'lucide-react';
import { JobCard } from './JobCard';
import { JobModal } from './JobModal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { api, ApiError } from '@/utils/api';
import type { Job, JobStatus } from '@/types';

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadJobs();
  }, [currentPage, statusFilter]);

  useEffect(() => {
    applyClientFilters();
  }, [jobs, searchQuery, selectedTags]);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await api.getJobs(params) as any;
      setJobs(response.data);
      setFilteredJobs(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const applyClientFilters = () => {
    let filtered = [...jobs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(job =>
        selectedTags.some(tag => job.tags.includes(tag))
      );
    }

    setFilteredJobs(filtered);
  };

  const handleCreateOrUpdate = async (jobData: Partial<Job>) => {
    if (editingJob) {
      await api.updateJob(editingJob.id, jobData);
    } else {
      await api.createJob(jobData);
    }
    await loadJobs();
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleArchive = async (job: Job) => {
    const newStatus = job.status === 'archived' ? 'active' : 'archived';
    
    // Optimistic update
    const previousJobs = [...jobs];
    setJobs(jobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j));
    
    try {
      await api.updateJob(job.id, { status: newStatus });
      await loadJobs();
    } catch (err) {
      // Rollback on error
      setJobs(previousJobs);
      setError(err instanceof ApiError ? err.message : 'Failed to update job');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = filteredJobs.findIndex(job => job.id === active.id);
    const newIndex = filteredJobs.findIndex(job => job.id === over.id);

    const newOrder = arrayMove(filteredJobs, oldIndex, newIndex);
    const previousJobs = [...jobs];
    
    // Optimistic update
    setFilteredJobs(newOrder);
    setJobs(newOrder);

    try {
      await api.reorderJobs(newOrder.map(job => job.id));
    } catch (err) {
      // Rollback on error
      setJobs(previousJobs);
      setFilteredJobs(previousJobs);
      setError(err instanceof ApiError ? err.message : 'Failed to reorder jobs');
    }
  };

  const allTags = Array.from(new Set(jobs.flatMap(job => job.tags)));
  const existingSlugs = jobs.map(job => job.slug);

  if (isLoading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600 mt-1">Manage your job postings</p>
        </div>
        <Button onClick={() => { setEditingJob(null); setIsModalOpen(true); }}>
          <Plus size={20} className="mr-2" />
          Create Job
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as JobStatus | 'all')}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'draft', label: 'Draft' },
              { value: 'archived', label: 'Archived' },
            ]}
          />

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev =>
                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Jobs List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredJobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No jobs found</p>
              </div>
            ) : (
              filteredJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={handleEdit}
                  onArchive={handleArchive}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingJob(null);
        }}
        onSubmit={handleCreateOrUpdate}
        job={editingJob}
        existingSlugs={existingSlugs}
      />
    </div>
  );
}

