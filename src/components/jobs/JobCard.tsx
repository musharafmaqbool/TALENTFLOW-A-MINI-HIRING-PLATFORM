import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Archive, ArchiveRestore } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Job } from '@/types';
import { formatDistance } from 'date-fns';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onArchive: (job: Job) => void;
  isDragging?: boolean;
}

export function JobCard({ job, onEdit, onArchive }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const statusVariant = {
    active: 'success' as const,
    draft: 'warning' as const,
    archived: 'default' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical size={20} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link
              to={`/jobs/${job.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
            >
              {job.title}
            </Link>
            <Badge variant={statusVariant[job.status]}>
              {job.status}
            </Badge>
          </div>

          {job.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {job.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {job.tags.map(tag => (
              <Badge key={tag} variant="info">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Updated {formatDistance(new Date(job.updatedAt), new Date(), { addSuffix: true })}
            </span>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(job)}
              >
                <Edit size={16} className="mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onArchive(job)}
              >
                {job.status === 'archived' ? (
                  <>
                    <ArchiveRestore size={16} className="mr-1" />
                    Unarchive
                  </>
                ) : (
                  <>
                    <Archive size={16} className="mr-1" />
                    Archive
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



