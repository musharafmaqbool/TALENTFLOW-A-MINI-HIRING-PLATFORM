import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import type { Candidate } from '@/types';

interface KanbanColumnProps {
  id: string;
  title: string;
  candidates: Candidate[];
}

export function KanbanColumn({ id, title, candidates }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 rounded-lg p-4 min-h-[500px] transition-colors ${
        isOver ? 'bg-primary-50 ring-2 ring-primary-400' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
          {candidates.length}
        </span>
      </div>

      <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {candidates.map(candidate => (
            <KanbanCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </SortableContext>

      {candidates.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          Drop candidates here
        </div>
      )}
    </div>
  );
}

