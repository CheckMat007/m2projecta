// src/app/gestor/(admin)/_components/sidebar.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SidebarClient } from './sidebar-client';
import type { User, Permission } from '@prisma/client';
import * as LucideIcons from 'lucide-react'; // 1. Importar todos os ícones

// 2. Definir os tipos aqui também para validação
type IconName = keyof typeof LucideIcons;

interface MenuItem {
  href?: string;
  icon: IconName;
  label: string;
  permission?: string;
  subItems?: Omit<MenuItem, 'subItems' | 'permission'>[];
}

type UserWithPermissions = User & {
  permissions: Permission[];
};

const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

export async function Sidebar() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  // 3. Aplicar o tipo MenuItem[] ao array
  const menuItems: MenuItem[] = [
    { href: "/gestor", icon: 'LayoutDashboard', label: "Dashboard", permission: 'any' },
    {
      label: "Gerenciar Site",
      icon: 'Home',
      permission: 'manage_site',
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

  return <SidebarClient user={session.user} menuItems={accessibleMenuItems} />;
}