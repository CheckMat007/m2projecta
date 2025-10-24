// src/app/gestor/(admin)/portfolio/novo/page.tsx
// Este é o Componente de Servidor

import { prisma } from '@/lib/prisma';
import { NovoPortfolioItemForm } from './_components/NovoPortfolioItemForm';

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