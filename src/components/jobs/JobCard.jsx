import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Archive, ArchiveRestore } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDistance } from 'date-fns';

export function JobCard({ job, onEdit, onArchive }) {
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
    active: 'success',
    draft: 'warning',
    archived: 'default',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass rounded-xl p-5 hover:shadow-medium transition-all duration-300 border border-gray-200/50 group animate-slide-up"
    >
      <div className="flex items-start gap-4">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-primary-600 transition-all hover:scale-110 p-1 rounded-lg hover:bg-primary-50"
        >
          <GripVertical size={22} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <Link
              to={`/jobs/${job.id}`}
              className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors group-hover:translate-x-1 inline-block"
            >
              {job.title}
            </Link>
            <Badge variant={statusVariant[job.status]} className="shrink-0">
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
          </div>

          {job.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {job.description}
            </p>
          )}

          {job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {job.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-primary-50 to-indigo-50 text-primary-700 rounded-full border border-primary-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse"></span>
              Updated {formatDistance(new Date(job.updatedAt), new Date(), { addSuffix: true })}
            </span>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(job)}
                className="hover:bg-primary-50 hover:text-primary-700"
              >
                <Edit size={16} className="mr-1.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onArchive(job)}
                className="hover:bg-orange-50 hover:text-orange-700"
              >
                {job.status === 'archived' ? (
                  <>
                    <ArchiveRestore size={16} className="mr-1.5" />
                    Unarchive
                  </>
                ) : (
                  <>
                    <Archive size={16} className="mr-1.5" />
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

