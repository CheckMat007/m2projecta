// src/app/cliente/_components/ClientLayoutClient.tsx
'use client';

import { useState } from 'react';
import { ClientSidebar } from './ClientSidebar';
import { ClientNotificationBell } from './ClientNotificationBell';

// Tipo customizado para os dados de exibição do usuário
type UserDisplay = {
    name: string;
    email?: string | null;
    image?: string | null;
};

export function ClientLayoutClient({
  children,
  user,
  initialNotifications,
  initialUnreadCount
}: {
  children: React.ReactNode;
  user: UserDisplay;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialNotifications: any[];
  initialUnreadCount: number;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex">
      <ClientSidebar 
        user={user} 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        <ClientNotificationBell 
            initialNotifications={initialNotifications} 
            initialUnreadCount={initialUnreadCount} 
        />
      </ClientSidebar>
      
      <main className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  );
}