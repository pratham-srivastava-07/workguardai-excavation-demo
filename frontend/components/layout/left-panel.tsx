'use client';

import { ReactNode } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LeftPanelProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  title?: string;
  className?: string;
}

export function LeftPanel({ children, isOpen, onClose, onToggle, title, className }: LeftPanelProps) {
  return (
    <>
      {/* Toggle Button when closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="absolute top-20 left-4 z-40 bg-black border border-gray-800 rounded-r-lg shadow-lg p-2 hover:bg-gray-900 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Panel */}
      <div
        className={cn(
          'absolute top-16 left-0 h-[calc(100vh-4rem)] bg-black border-r border-gray-800 shadow-2xl transition-transform duration-300 z-30 flex flex-col',
          isOpen ? 'translate-x-0 w-full sm:w-96 md:w-[420px]' : '-translate-x-full',
          className
        )}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50">
            {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
            <div className="flex items-center space-x-2">
              {onToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="md:hidden text-gray-400 hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-0">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

