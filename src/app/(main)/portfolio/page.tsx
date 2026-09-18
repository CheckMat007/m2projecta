// src/app/(main)/portfolio/page.tsx
// Este é o Componente de Servidor

import { prisma } from '@/lib/prisma';
import PortfolioClientPage from './portfolio-client';
import type { Metadata } from "next";

const pageTitle = 'Nosso Portfólio';
const pageDescription = 'Explore projetos reais de imagens aéreas com drone: inspeções de obra, imóveis, eventos e vídeos corporativos no Vale do Paraíba (SP).';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: '/portfolio',
    type: 'website',
  },
};

export const revalidate = 3600;

// Teto de segurança: o "Carregar mais" no cliente revela 6 por vez a partir desta
// lista, então isso já cobre bastante paginação sem baixar o catálogo inteiro (e todas
// as colunas de cada item, incluindo galeria/vídeo) em toda visita à página.
const PORTFOLIO_FETCH_LIMIT = 60;

// Esta função agora busca os itens E os serviços relacionados
async function getPortfolioPageData() {
  // Independentes entre si — rodam em paralelo em vez de sequencialmente.
  const [items, services] = await Promise.all([
    prisma.portfolioItem.findMany({
      where: {
        status: 'PUBLISHED'
      },
      orderBy: {
        createdAt: 'desc'
      },
      // Só os campos que o card do portfólio realmente renderiza.
      select: {
        id: true,
        slug: true,
        title: true,
        coverImage: true,
        service: { select: { name: true } },
      },
      take: PORTFOLIO_FETCH_LIMIT,
    }),

    // Busca todos os nomes de serviço para usar nos filtros
    prisma.service.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc'
      }
    }),
  ]);

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