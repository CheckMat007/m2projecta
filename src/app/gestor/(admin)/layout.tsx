// src/app/gestor/(admin)/layout.tsx
// Este é um Server Component.

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { User, Permission } from '@prisma/client';
import * as LucideIcons from 'lucide-react';
import { AdminLayoutClient } from './_components/AdminLayoutClient';
import { getNotificationsForBell } from './notifications/actions';

// Tipos e helper (sem alterações)
type IconName = keyof typeof LucideIcons;
interface MenuItem { href?: string; icon: IconName; label: string; permission?: string; subItems?: Omit<MenuItem, 'subItems' | 'permission'>[];}
type UserWithPermissions = User & { permissions: Permission[]; };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

export default async function GestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/gestor/login');
  }

  // Buscamos o usuário completo e mais recente do banco de dados
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  // Adicionamos uma verificação de segurança: se o usuário da sessão não existe mais no banco, desloga ele.
  if (!user) {
    redirect('/gestor/login');
  }

  const { notifications, unreadCount } = await getNotificationsForBell();

  const menuItems: MenuItem[] = [
    { href: "/gestor", icon: 'LayoutDashboard', label: "Dashboard", permission: 'any' },
    { href: "/gestor/notifications", icon: 'Bell', label: "Gerenciar Notificações", permission: 'manage_notifications' },
    { href: "/gestor/blog", icon: 'BookText', label: "Blog", permission: 'manage_blog' },
    {
      label: "Gerenciar Site", icon: 'Home', permission: 'manage_site',
      subItems: [
        { href: "/gestor/site/inicio", icon: 'Home', label: "Início" },
        { href: "/gestor/site/sobre", icon: 'BookOpen', label: "Sobre Nós" },
        { href: "/gestor/site/servicos", icon: 'Briefcase', label: "Serviços" },
        { href: "/gestor/site/contato", icon: 'Contact', label: "Contato" },
        { href: "/gestor/site/aparencia", icon: 'Paintbrush', label: "Aparência" },
      ],
    },
    { href: "/gestor/clientes", icon: 'Users', label: "Gerenciar Clientes", permission: 'manage_clients' },
    { href: "/gestor/projetos", icon: 'Briefcase', label: "Gerenciar Projetos", permission: 'manage_projects' },
    { href: "/gestor/portfolio", icon: 'LayoutDashboard', label: "Gerenciar Portfólio", permission: 'manage_portfolio' },
    { href: "/gestor/contratos", icon: 'FileText', label: "Gerenciar Contratos", permission: 'manage_contracts' },
    { href: "/gestor/equipe", icon: 'UserCog', label: "Gerenciar Equipe", permission: 'manage_team' },
  ];

  const accessibleMenuItems = menuItems.filter(item =>
    item.permission === 'any' || (item.permission && hasPermission(user, item.permission))
  );

  return (
    <div className="min-h-screen bg-m2-dark text-white">
      <AdminLayoutClient
        // --- CORREÇÃO APLICADA AQUI ---
        // Passamos o objeto 'user' fresco do banco de dados, em vez do 'session.user' obsoleto.
        user={user}
        menuItems={accessibleMenuItems}
        initialNotifications={notifications}
        initialUnreadCount={unreadCount}
      >
        {children}
      </AdminLayoutClient>
    </div>
  );
}