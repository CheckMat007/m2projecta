// src/app/gestor/(admin)/contratos/gerar/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { GenerateContractForm } from './_components/GenerateContractForm';

type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

export default async function GenerateContractPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  if (!hasPermission(currentUser, 'manage_contracts')) {
    redirect('/gestor');
  }

  const clients = await prisma.client.findMany({
    orderBy: { tradeName: 'asc' },
    select: { id: true, tradeName: true },
  });

  return (
    <div className="space-y-6">
      <GenerateContractForm
        clients={clients}
        defaultContactName={currentUser?.name || ''}
        defaultContactPhone={currentUser?.phone || ''}
      />
    </div>
  );
}
