// src/app/gestor/(admin)/portfolio/editar/[id]/page.tsx

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { EditPortfolioForm } from './_components/EditPortfolioForm';

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