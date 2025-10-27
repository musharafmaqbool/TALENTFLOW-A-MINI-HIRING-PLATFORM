import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Button = forwardRef(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95',
          {
            'bg-gradient-to-r from-primary-500 to-indigo-600 text-white hover:from-primary-600 hover:to-indigo-700 shadow-medium hover:shadow-large focus:ring-primary-500': variant === 'primary',
            'bg-white text-gray-700 hover:bg-gray-50 shadow-soft hover:shadow-medium border border-gray-200 focus:ring-gray-500': variant === 'secondary',
            'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-medium hover:shadow-large focus:ring-red-500': variant === 'danger',
            'bg-transparent hover:bg-white/50 text-gray-700 hover:text-gray-900 focus:ring-gray-500': variant === 'ghost',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-5 py-2.5 text-base': size === 'md',
            'px-8 py-3.5 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

