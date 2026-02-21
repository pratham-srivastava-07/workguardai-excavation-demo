'use client';

import { ReactNode, useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { DashboardMenu } from '@/components/layout/dashboard-menu';
import { LeftPanel } from '@/components/layout/left-panel';
import { MapView } from '@/components/map-view';
import { toast } from 'sonner';

interface PersistentMapLayoutProps {
  children?: ReactNode;
  initialSearchQuery?: string;
  onSearch?: (query: string) => void;
  leftPanelContent?: ReactNode;
  leftPanelTitle?: string;
  showLeftPanel?: boolean;
  onLeftPanelClose?: () => void;
  activeMenuItem?: string;
  onMenuItemClick?: (item: string) => void;
  loading?: boolean;
}

export function PersistentMapLayout({
  children,
  initialSearchQuery = '',
  onSearch,
  leftPanelContent,
  leftPanelTitle,
  showLeftPanel = false,
  onLeftPanelClose,
  activeMenuItem = 'map',
  onMenuItemClick,
  loading = false,
}: PersistentMapLayoutProps) {
  const [leftPanelOpen, setLeftPanelOpen] = useState(showLeftPanel);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      toast("Please sign in or sign up to access all features", {
        action: {
          label: "Sign In",
          onClick: () => window.location.href = '/login'
        }
      })
    }
  }, []);

  useEffect(() => {
    setLeftPanelOpen(showLeftPanel);
  }, [showLeftPanel]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/';
  };

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
    // Open left panel when searching
    if (query) {
      setLeftPanelOpen(true);
    }
  };

  const handleMenuItemClick = (item: string) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
    // Open left panel for non-map items
    if (item !== 'map') {
      setLeftPanelOpen(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <TopBar
        onSearch={handleSearch}
        searchQuery={initialSearchQuery}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dashboard Menu */}
        {isAuthenticated && (
          <DashboardMenu
            activeItem={activeMenuItem}
            onItemClick={handleMenuItemClick}
          />
        )}

        {/* Map Area */}
        <div className="flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>
          {/* Map View - Always visible, behind everything */}
          <div className="absolute inset-0 w-full h-full z-0">
            {children}
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-2xl flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white font-medium text-sm animate-pulse">Searching...</p>
              </div>
            </div>
          )}

          {/* Left Panel Overlay - Above map */}
          <LeftPanel
            isOpen={leftPanelOpen}
            onToggle={() => setLeftPanelOpen(!leftPanelOpen)}
            onClose={() => {
              setLeftPanelOpen(false);
              if (onLeftPanelClose) {
                onLeftPanelClose();
              }
            }}
            title={leftPanelTitle}
          >
            {leftPanelContent}
          </LeftPanel>
        </div>
      </div>
    </div>
  );
}

