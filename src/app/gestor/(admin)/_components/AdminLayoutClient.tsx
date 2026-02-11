// src/app/gestor/(admin)/_components/AdminLayoutClient.tsx
'use client';

import React, { useState } from 'react';
import { SidebarClient } from './sidebar-client';
import { NotificationBellClient } from './NotificationBellClient'; // Ajuste o import se necessário
import type { Session } from 'next-auth';
import * as LucideIcons from 'lucide-react';

// Tipos
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
  // Estado inicial: Desktop começa expandido (false), Mobile não usa isso para layout
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-m2-dark">
      {/* Sidebar Client: Gerencia Header Mobile e Sidebar Desktop */}
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
      
      {/* CORREÇÃO PRINCIPAL AQUI:
         1. w-full: Garante que o conteúdo use a largura disponível.
         2. md:ml-*: As margens laterais só aplicam no Desktop (md). No mobile é 0.
         3. pt-20: Adiciona espaço no topo APENAS no mobile (para não ficar atrás do header).
         4. md:pt-8: No desktop, o padding superior volta ao normal.
      */}
      <main 
        className={`
          flex-1 
          w-full 
          p-4 md:p-8 
          pt-20 md:pt-8 
          overflow-y-auto 
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}
        `}
      >
        {children}
      </main>
    </div>
  );
}