// src/app/(main)/page.tsx
// Este é o novo Componente de Servidor

import { prisma } from '@/lib/prisma';
import HomeClientPage from './home-client';
import GoogleReviews from '@/components/GoogleReviews';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// Esta função busca todos os dados para a página inicial
async function getHomePageData() {
  // 1. Busca o ID do vídeo da Hero
  const homeData = await prisma.homePage.findFirst();
  
  // 2. Busca os itens de portfólio, incluindo o serviço relacionado
  const portfolioItems = await prisma.portfolioItem.findMany({
    where: { isFeatured: true, status: 'PUBLISHED' },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { service: true }, // Inclui os dados do serviço
  });

  // 3. Busca os depoimentos
  const testimonials = await prisma.testimonial.findMany({
    take: 5,
    orderBy: { order: 'asc' },
  });

  // 4. Busca os itens do FAQ
  const faqItems = await prisma.faqItem.findMany({
    take: 8,
    orderBy: { order: 'asc' },
  });

  // 5. Busca todos os serviços para os cards
  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'asc' },
  });

  // Formata os dados para o formato que o componente cliente espera
  const formattedPortfolio = portfolioItems.map(item => ({
    id: item.id,
    title: item.title,
    category: item.service?.name || 'Sem Categoria', // Usa o nome do serviço
    image: item.coverImage,
    link: `/portfolio/${item.slug}`,
    backgroundImage: item.coverImage,
  }));

  const formattedTestimonials = testimonials.map(item => ({
    quote: { start: item.quote, highlight: item.highlight || '', end: '' },
    name: item.name,
    company: item.company,
    image: item.image || '/assets/testimonials/exemplo1.jpg',
    backgroundImage: portfolioItems.find(p => p.service?.name === item.company)?.coverImage || '/assets/portfolio/dutra.JPG',
  }));
  
  return {
    heroVideoId: homeData?.youtubeVideoId || 'xk4lN3K5jzg',
    heroVideoIsVertical: homeData?.youtubeVideoIsVertical || false,
    portfolioItems: formattedPortfolio,
    testimonials: formattedTestimonials,
    faqItems,
    services, // Passa a lista de serviços completa
  };
}

export default async function Page() {
  const { heroVideoId, heroVideoIsVertical, portfolioItems, testimonials, faqItems, services } = await getHomePageData();

  return (
    <HomeClientPage
      heroVideoId={heroVideoId}
      heroVideoIsVertical={heroVideoIsVertical}
      portfolioItems={portfolioItems}
      testimonials={testimonials}
      faqItems={faqItems}
      services={services} 
      googleReviews={<GoogleReviews />}
    />
  );
}