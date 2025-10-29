// src/app/gestor/(admin)/_components/AdminLayoutClient.tsx
'use client';

import React, { useState } from 'react';
import { SidebarClient } from './sidebar-client';
import { NotificationBellClient } from './NotificationBellClient';
import type { Session } from 'next-auth';
import * as LucideIcons from 'lucide-react';

// Tipos para os dados recebidos do servidor
type IconName = keyof typeof LucideIcons;
interface MenuItem { href?: string; icon: IconName; label: string; subItems?: Omit<MenuItem, 'subItems'>[];}
type NotificationWithReadStatus = { id: string; title: string; message: string; createdAt: Date; isRead: boolean; sender: { name: string | null } | null; };

interface AdminLayoutClientProps {
  user: Session['user'];
  menuItems: MenuItem[];
  initialNotifications: NotificationWithReadStatus[];
  initialUnreadCount: number;
  children: React.ReactNode;
}

export function AdminLayoutClient({
  user,
  menuItems,
  initialNotifications,
  initialUnreadCount,
  children,
}: AdminLayoutClientProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex">
      <SidebarClient 
        user={user}
        menuItems={menuItems}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      >
        <NotificationBellClient
          initialNotifications={initialNotifications}
          initialUnreadCount={initialUnreadCount}
        />
      </SidebarClient>
      
      <main className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  );
}