// src/app/gestor/(admin)/notifications/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { NotificationsClientPage } from './_components/NotificationsClientPage';

// Helper para verificar permissões
type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/gestor/login');
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  if (!currentUser) {
    redirect('/gestor/login');
  }

  if (!hasPermission(currentUser, 'manage_notifications')) {
    redirect('/gestor');
  }

  // Lógica de busca de notificações
  let notifications;
  const includeQuery = {
    sender: { select: { name: true } },
    readStatuses: { include: { user: { select: { name: true } } } },
  };

  if (currentUser.role === 'MASTER') {
    notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      include: includeQuery,
      take: 50,
    });
  } else {
    notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { isBroadcast: true },
          { readStatuses: { some: { userId: currentUser.id } } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { name: true } },
      },
      take: 50,
    });
  }

  const allUsers = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true },
  });

  return (
    <NotificationsClientPage
      initialNotifications={notifications}
      allUsers={allUsers}
      currentUser={currentUser}
    />
  );
}