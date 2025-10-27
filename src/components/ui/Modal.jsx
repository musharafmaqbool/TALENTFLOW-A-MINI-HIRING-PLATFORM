import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        <div
          className={cn(
            'relative bg-white rounded-lg shadow-xl w-full',
            {
              'max-w-md': size === 'sm',
              'max-w-2xl': size === 'md',
              'max-w-4xl': size === 'lg',
              'max-w-6xl': size === 'xl',
            }
          )}
        >
          {title && (
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          )}
          
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

