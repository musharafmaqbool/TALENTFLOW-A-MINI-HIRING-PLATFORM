import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Spinner } from '@/components/ui/Spinner';
import { KanbanColumn } from './KanbanColumn';
import { api, ApiError } from '@/utils/api';
import type { Candidate, CandidateStage } from '@/types';

const STAGES: { id: CandidateStage; label: string }[] = [
  { id: 'applied', label: 'Applied' },
  { id: 'screening', label: 'Screening' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer' },
  { id: 'hired', label: 'Hired' },
  { id: 'rejected', label: 'Rejected' },
];

export function KanbanBoard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getCandidates({ limit: 10000 }) as any;
      setCandidates(response.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load candidates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const candidate = candidates.find(c => c.id === event.active.id);
    setActiveCandidate(candidate || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveCandidate(null);
    
    const { active, over } = event;

    if (!over) return;

    const candidateId = active.id as string;
    const newStage = over.id as CandidateStage;

    const candidate = candidates.find(c => c.id === candidateId);
    
    if (!candidate || candidate.currentStage === newStage) return;

    // Optimistic update
    const previousCandidates = [...candidates];
    setCandidates(candidates.map(c => 
      c.id === candidateId ? { ...c, currentStage: newStage } : c
    ));

    try {
      await api.updateCandidateStage(candidateId, newStage);
    } catch (err) {
      // Rollback on error
      setCandidates(previousCandidates);
      setError(err instanceof ApiError ? err.message : 'Failed to update candidate');
      
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  const getCandidatesByStage = (stage: CandidateStage) => {
    return candidates.filter(c => c.currentStage === stage);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
        <p className="text-gray-600 mt-1">Drag and drop candidates to move them between stages</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STAGES.map(stage => (
            <KanbanColumn
              key={stage.id}
              id={stage.id}
              title={stage.label}
              candidates={getCandidatesByStage(stage.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCandidate ? (
            <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-primary-500">
              <p className="font-medium text-gray-900">{activeCandidate.name}</p>
              <p className="text-sm text-gray-600 truncate">{activeCandidate.email}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

