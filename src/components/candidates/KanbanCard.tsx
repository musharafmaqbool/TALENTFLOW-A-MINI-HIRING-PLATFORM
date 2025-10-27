import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import type { Candidate } from '@/types';

interface KanbanCardProps {
  candidate: Candidate;
}

export function KanbanCard({ candidate }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <Link to={`/candidates/${candidate.id}`} className="block" onClick={(e) => e.stopPropagation()}>
        <p className="font-medium text-gray-900 mb-1 truncate">{candidate.name}</p>
        <p className="text-sm text-gray-600 truncate">{candidate.email}</p>
      </Link>
    </div>
  );
}


