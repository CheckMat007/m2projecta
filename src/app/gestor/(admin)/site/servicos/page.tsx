// src/app/gestor/(admin)/site/servicos/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { prisma } from "@/lib/prisma";
import { ServicesClientPage } from "./_components/ServicesClientPage";

// Helper de permissão
type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

// Busca os dados no servidor
async function getServices() {
  const services = await prisma.service.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
  return services;
}

export default async function ServicosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  if (!hasPermission(currentUser, 'manage_site')) {
    redirect('/gestor');
  }

  const services = await getServices();

  return (
    <ServicesClientPage initialServices={services} />
  );
}