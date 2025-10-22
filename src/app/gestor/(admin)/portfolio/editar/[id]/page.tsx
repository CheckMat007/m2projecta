// src/app/gestor/(admin)/portfolio/editar/[id]/page.tsx
// Este é o Componente de Servidor

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { EditPortfolioForm } from './_components/EditPortfolioForm'; // Importa o formulário

const MAX_FEATURED_ITEMS = 10;

// Função para buscar o item específico
async function getPortfolioItem(id: string) {
  const item = await prisma.portfolioItem.findUnique({
    where: { id },
  });
  if (!item) {
    notFound();
  }
  return item;
}

export default async function EditPortfolioPage({ params }: { params: { id: string } }) {
  // 1. Busca o item que queremos editar
  const item = await getPortfolioItem(params.id);
  
  // 2. Busca a contagem de destaques
  const featuredCount = await prisma.portfolioItem.count({
    where: { isFeatured: true }
  });

  // 3. Renderiza o formulário (cliente) e passa todos os dados
  return (
    <EditPortfolioForm 
      item={item} 
      featuredCount={featuredCount} 
      maxFeatured={MAX_FEATURED_ITEMS} 
    />
  );
}