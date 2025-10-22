// src/app/gestor/(admin)/portfolio/novo/page.tsx
// Este é o Componente de Servidor

import { prisma } from '@/lib/prisma';
import { NovoPortfolioItemForm } from './_components/NovoPortfolioItemForm';

const MAX_FEATURED_ITEMS = 10;

export default async function NovoPortfolioItemPage() {
  // 1. Busca a contagem de destaques no servidor
  const featuredCount = await prisma.portfolioItem.count({
    where: { isFeatured: true }
  });

  // 2. Renderiza o componente de formulário (cliente) e passa os dados
  return (
    <NovoPortfolioItemForm 
      featuredCount={featuredCount} 
      maxFeatured={MAX_FEATURED_ITEMS} 
    />
  );
}