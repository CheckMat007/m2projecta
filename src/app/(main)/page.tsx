// src/app/(main)/page.tsx
// Este é o novo Componente de Servidor

import { prisma } from '@/lib/prisma';
import HomeContent from './home-content';
import GoogleReviews from '@/components/GoogleReviews';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export const revalidate = 3600;

// Esta função busca todos os dados para a página inicial
async function getHomePageData() {
  // As 4 consultas abaixo são independentes entre si — rodam em paralelo em vez de
  // uma esperando a outra terminar. (O antigo 'Testimonial' model foi removido daqui:
  // a home exibe GoogleReviews hoje, não depoimentos manuais — a consulta e a
  // transformação continuavam rodando em todo request só para um resultado nunca
  // renderizado por HomeContent. O CMS de depoimentos em /gestor/site/inicio continua
  // intacto, só a busca morta na home pública foi removida.)
  const [homeData, portfolioItems, faqItems, services] = await Promise.all([
    // 1. ID do vídeo da Hero
    prisma.homePage.findFirst(),

    // 2. Itens de portfólio, incluindo o serviço relacionado
    prisma.portfolioItem.findMany({
      where: { isFeatured: true, status: 'PUBLISHED' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { service: { select: { name: true } } },
    }),

    // 3. Itens do FAQ
    prisma.faqItem.findMany({
      take: 8,
      orderBy: { order: 'asc' },
    }),

    // 4. Serviços para os cards (só os campos realmente usados na home)
    prisma.service.findMany({
      select: { name: true, slug: true, shortDescription: true, icon: true },
      orderBy: { createdAt: 'asc' },
      take: 5,
    }),
  ]);

  // Formata os dados para o formato que o componente cliente espera
  const formattedPortfolio = portfolioItems.map(item => ({
    id: item.id,
    title: item.title,
    category: item.service?.name || 'Sem Categoria', // Usa o nome do serviço
    image: item.coverImage,
    link: `/portfolio/${item.slug}`,
    backgroundImage: item.coverImage,
  }));

  return {
    heroVideoId: homeData?.youtubeVideoId || 'xk4lN3K5jzg',
    heroVideoIsVertical: homeData?.youtubeVideoIsVertical || false,
    portfolioItems: formattedPortfolio,
    faqItems,
    services, // Passa a lista de serviços completa
  };
}

export default async function Page() {
  const { heroVideoId, heroVideoIsVertical, portfolioItems, faqItems, services } = await getHomePageData();

  return (
    <HomeContent
      heroVideoId={heroVideoId}
      heroVideoIsVertical={heroVideoIsVertical}
      portfolioItems={portfolioItems}
      faqItems={faqItems}
      services={services}
      googleReviews={<GoogleReviews />}
    />
  );
}