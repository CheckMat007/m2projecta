// src/app/(main)/portfolio/page.tsx
// Este é o novo Componente de Servidor

import { prisma } from '@/lib/prisma';
import PortfolioClientPage from './portfolio-client'; // Importa nosso componente cliente

// Esta função busca todos os itens de portfólio PUBLICADOS
async function getPublishedPortfolioItems() {
  const portfolioItems = await prisma.portfolioItem.findMany({
    where: { 
      status: 'PUBLISHED' // Só busca itens publicados
    },
    orderBy: { 
      createdAt: 'desc' 
    },
  });

  return portfolioItems;
}

export default async function Page() {
  // 1. Busca os dados no servidor
  const items = await getPublishedPortfolioItems();

  // 2. Passa os dados para o componente cliente, que lida com o filtro
  return (
    <PortfolioClientPage initialItems={items} />
  );
}