import { cn } from '@/utils/cn';

export function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-soft transition-all duration-200 hover:scale-105',
        {
          'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300': variant === 'default',
          'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border border-green-300': variant === 'success',
          'bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800 border border-yellow-300': variant === 'warning',
          'bg-gradient-to-r from-red-100 to-rose-200 text-red-800 border border-red-300': variant === 'danger',
          'bg-gradient-to-r from-blue-100 to-cyan-200 text-blue-800 border border-blue-300': variant === 'info',
        },
        className
      )}
    >
      {children}
    </span>
  );
}

