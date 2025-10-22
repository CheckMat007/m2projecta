// src/app/(main)/page.tsx
// Este é o Componente de Servidor

import { prisma } from '@/lib/prisma';
import HomeClientPage from './home-client'; // <-- CORREÇÃO AQUI (removido .tsx)

// Esta função busca todos os dados para a página inicial
async function getHomeData() {
  // 1. Busca o ID do vídeo da Hero
  const homeData = await prisma.homePage.findFirst();
  
  // 2. Busca os 5 itens de portfólio marcados como "Destaque"
  const portfolioItems = await prisma.portfolioItem.findMany({
    where: { isFeatured: true, status: 'PUBLISHED' },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  // 3. Busca os 5 primeiros depoimentos
  const testimonials = await prisma.testimonial.findMany({
    take: 5,
    orderBy: { order: 'asc' },
  });

  // 4. Busca os 8 primeiros itens do FAQ
  const faqItems = await prisma.faqItem.findMany({
    take: 8,
    orderBy: { order: 'asc' },
  });

  // Mapeia os dados do banco para o formato que o componente cliente espera
  const formattedPortfolio = portfolioItems.map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    image: item.coverImage,
    link: `/portfolio/${item.id}`,
    backgroundImage: item.coverImage,
  }));

  const formattedTestimonials = testimonials.map(item => ({
    quote: { start: item.quote, highlight: item.highlight || '', end: '' },
    name: item.name,
    company: item.company,
    image: item.image || '/assets/testimonials/exemplo1.jpg', // Imagem padrão
    backgroundImage: '', // Este campo não será mais buscado do banco
  }));
  
  const faqData = faqItems.length > 0 ? faqItems : [
      { id: '1', question: "Nenhum FAQ encontrado.", answer: "Por favor, adicione perguntas e respostas no painel do gestor." }
  ];

  return {
    heroVideoId: homeData?.youtubeVideoId || 'xk4lN3K5jzg', // ID padrão
    portfolioItems: formattedPortfolio,
    testimonials: formattedTestimonials,
    faqItems: faqData,
  };
}


export default async function Page() {
  // 1. Busca todos os dados no servidor
  const { heroVideoId, portfolioItems, testimonials, faqItems } = await getHomeData();

  // 2. Passa os dados para o componente cliente, que lida com a interatividade
  return (
    <HomeClientPage
      heroVideoId={heroVideoId}
      portfolioItems={portfolioItems}
      testimonials={testimonials}
      faqItems={faqItems}
    />
  );
}