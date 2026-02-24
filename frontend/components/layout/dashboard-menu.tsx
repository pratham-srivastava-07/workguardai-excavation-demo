'use client';

import { useState, useMemo } from 'react';
import { Package, Briefcase, ShoppingCart, MessageSquare, Wallet, Settings, HelpCircle, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardMenuProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const allMenuItems = [
  { id: 'create-post', label: 'Post a project / material', icon: Package, highlight: true },
  { id: 'projects', label: 'Projects & Offers', icon: Briefcase },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, roles: ['COMPANY', 'CITY'] },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'wallet', label: 'Wallet / Payments', icon: Wallet },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

export function DashboardMenu({ activeItem = 'create-post', onItemClick }: DashboardMenuProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Filter menu items based on user role
  const menuItems = useMemo(() => {
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    let userRole: string | null = null;

    if (userData) {
      try {
        const user = JSON.parse(userData);
        userRole = user.role || null;
      } catch {
        // Invalid user data
      }
    }

    // Filter out orders for homeowners
    return allMenuItems.filter(item => {
      if (item.id === 'orders') {
        // Only show orders for COMPANY and CITY roles
        if (item.roles) {
          return item.roles.includes(userRole || '');
        }
        return userRole !== 'HOMEOWNER';
      }
      return true;
    });
  }, []);

  return (
    <div
      className={cn(
        'bg-black border-r border-gray-800 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Toggle Button */}
      <div className="p-2 border-b border-gray-800 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.id === 'create-post' ? Plus : item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={cn(
                'w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : item.highlight
                    ? 'text-primary border border-primary/30 hover:bg-primary/10'
                    : 'text-gray-300 hover:bg-gray-900'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

