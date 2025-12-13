'use client';

import { ReactNode, useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { DashboardMenu } from '@/components/layout/dashboard-menu';
import { LeftPanel } from '@/components/layout/left-panel';
import { MapView } from '@/components/map-view';

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

