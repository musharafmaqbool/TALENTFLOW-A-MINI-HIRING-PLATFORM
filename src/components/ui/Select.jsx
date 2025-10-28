import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Select = forwardRef(
  ({ className, label, error, id, options, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    // If no label, return select directly to avoid extra wrapper
    if (!label) {
      return (
        <>
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed bg-white transition-all h-[48px]',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </>
      );
    }

    return (
      <div className="w-full">
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed bg-white transition-all h-[48px]',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

