// src/app/(main)/portfolio/page.tsx
// Este é o Componente de Servidor

import { prisma } from '@/lib/prisma';
import PortfolioClientPage from './portfolio-client';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Nosso Portfólio',
  description: 'Explore nossos projetos recentes e veja como transformamos a visão de construtoras e imobiliárias com tecnologia de ponta.',
};

// Esta função agora busca os itens E os serviços relacionados
async function getPortfolioPageData() {
  const items = await prisma.portfolioItem.findMany({
    where: { 
      status: 'PUBLISHED'
    },
    orderBy: { 
      createdAt: 'desc' 
    },
    // A MÁGICA ACONTECE AQUI: Inclui os dados do serviço
    include: {
      service: true,
    }
  });

  // Busca todos os nomes de serviço para usar nos filtros
  const services = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc'
    }
  });

  return { items, services };
}

export default async function Page() {
  const { items, services } = await getPortfolioPageData();

  return (
    /* CORREÇÃO: Envolver o componente cliente com uma trava de largura (max-w-[100vw]) 
      e overflow horizontal oculto (overflow-x-hidden). Isso impede que as animações 
      do Framer Motion "vazem" a tela do celular para os lados.
    */
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <PortfolioClientPage initialItems={items} services={services} />
    </div>
  );
}