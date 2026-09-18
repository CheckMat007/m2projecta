// src/app/gestor/(admin)/portfolio/editar/[id]/page.tsx

import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { EditPortfolioForm } from './_components/EditPortfolioForm';

// Helper de permissão
type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

const MAX_FEATURED_ITEMS = 10;

// Função para buscar todos os dados necessários para o formulário
async function getPageData(id: string) {
  const item = await prisma.portfolioItem.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  const featuredCount = await prisma.portfolioItem.count({
    where: { isFeatured: true }
  });
  
  const services = await prisma.service.findMany({
    orderBy: { name: 'asc' }
  });

  return { item, featuredCount, services };
}

export default async function EditPortfolioPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  if (!hasPermission(currentUser, 'manage_portfolio')) {
    redirect('/gestor');
  }

  const { item, featuredCount, services } = await getPageData(params.id);

  // Renderiza o formulário (cliente) e passa todos os dados
  return (
    <EditPortfolioForm 
      item={item} 
      featuredCount={featuredCount} 
      maxFeatured={MAX_FEATURED_ITEMS} 
      services={services}
    />
  );
}