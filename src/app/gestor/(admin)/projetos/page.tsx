// src/app/gestor/(admin)/projetos/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { ProjectsClientPage } from './_components/ProjectsClientPage';

type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  if (!hasPermission(currentUser, 'manage_projects')) {
    redirect('/gestor');
  }

  // 1. Busca Projetos com dados completos para a listagem e timeline
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      client: { select: { id: true, tradeName: true } },
      contract: { select: { id: true, contractNumber: true } },
      // INCLUI AS ATUALIZAÇÕES (TIMELINE)
      updates: {
        orderBy: { createdAt: 'desc' },
        include: { createdBy: { select: { name: true } } }
      }
    }
  });

  // 2. Busca Clientes
  const clients = await prisma.client.findMany({
    orderBy: { tradeName: 'asc' },
    select: { id: true, tradeName: true }
  });

  // 3. Busca Contratos
  const contracts = await prisma.contract.findMany({
    where: { status: { not: 'CANCELLED' } },
    orderBy: { createdAt: 'desc' },
    select: { id: true, contractNumber: true, clientId: true }
  });

  // 4. Busca Serviços
  const services = await prisma.service.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });

  return (
    <div className="space-y-8">
      
      <ProjectsClientPage 
        initialProjects={projects}
        clients={clients}
        contracts={contracts}
        services={services}
      />
    </div>
  );
}