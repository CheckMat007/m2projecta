// src/app/gestor/(admin)/portfolio/novo/page.tsx
// Este é o Componente de Servidor

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { NovoPortfolioItemForm } from './_components/NovoPortfolioItemForm';

// Helper de permissão
type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

const MAX_FEATURED_ITEMS = 10;

// Esta função agora busca a contagem de destaques E a lista de serviços
async function getFormData() {
  const featuredCount = await prisma.portfolioItem.count({
    where: { isFeatured: true }
  });

  const services = await prisma.service.findMany({
    orderBy: { name: 'asc' }
  });

  return { featuredCount, services };
}

export default async function NovoPortfolioItemPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  if (!hasPermission(currentUser, 'manage_portfolio')) {
    redirect('/gestor');
  }

  const { featuredCount, services } = await getFormData();

  // Renderiza o formulário (cliente) e passa todos os dados necessários
  return (
    <NovoPortfolioItemForm 
      featuredCount={featuredCount} 
      maxFeatured={MAX_FEATURED_ITEMS} 
      services={services} // Passa a lista de serviços como prop
    />
  );
}