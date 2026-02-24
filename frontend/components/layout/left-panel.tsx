'use client';

import { ReactNode, useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
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
  const [isMaximized, setIsMaximized] = useState(false);
  const [width, setWidth] = useState(420);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      // Calculate new width relative to the left margin (left-4 = 16px)
      const newWidth = e.clientX - 16;

      // Constraints: Min 360px, Max 80% of window width
      if (newWidth >= 360 && newWidth <= window.innerWidth * 0.8) {
        setWidth(newWidth);
        // If they manually resize significantly, disable the "maximized" flag
        if (newWidth < 700) setIsMaximized(false);
        else if (newWidth > 710) setIsMaximized(true);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing]);

  // Handle maximization toggle
  useEffect(() => {
    if (isMaximized) {
      setWidth(720);
    } else {
      // Don't override if they are mid-resize
      if (!isResizing) {
        setWidth(420);
      }
    }
  }, [isMaximized]);

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
          'absolute top-20 left-4 bottom-4 bg-black/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-30 flex flex-col',
          'transition-all duration-300', // Enable smooth transitions for all properties
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0 pointer-events-none',
          className
        )}
        style={{
          width: typeof window !== 'undefined' && window.innerWidth < 640 ? 'calc(100% - 2rem)' : `${width}px`,
          transitionProperty: isResizing ? 'none' : 'transform, width, opacity'
        }}
      >
        {/* Resize Handle */}
        {isOpen && (
          <div
            onMouseDown={startResizing}
            className="absolute -right-1 top-0 bottom-0 w-2 cursor-col-resize z-50 group"
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-white/10 group-hover:bg-primary/50 rounded-full transition-colors" />
          </div>
        )}

        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50">
            {title && <h2 className="text-lg font-semibold text-white truncate mr-2">{title}</h2>}
            <div className="flex items-center space-x-1">
              {isOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMaximized(!isMaximized)}
                  title={isMaximized ? "Collapse" : "Expand"}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              )}
              {onToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="text-gray-400 hover:text-white cursor-pointer"
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

