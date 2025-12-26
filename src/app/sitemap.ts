// src/app/sitemap.ts

import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.m2projecta.com.br';

  // 1. Busca SERVIÇOS
  const services = await prisma.service.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // 2. Busca PORTFÓLIO (Apenas publicados)
  const portfolioItems = await prisma.portfolioItem.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      id: true,
      updatedAt: true,
    },
  });

  // 3. Busca BLOG POSTS (Apenas publicados)
  const posts = await prisma.post.findMany({
    where: { 
        status: 'PUBLISHED' 
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // --- Mapeamento das URLs ---

  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/servicos/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const portfolioRoutes = portfolioItems.map((item) => ({
    url: `${baseUrl}/portfolio/${item.id}`,
    lastModified: item.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // --- Rotas Estáticas ---
  const staticRoutes = [
    '', 
    '/sobre',
    '/servicos',
    '/portfolio',
    '/blog', // A home do blog
    '/contato',
    '/termos-e-condicoes',
    '/politica-de-privacidade',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : 0.6,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...portfolioRoutes,
    ...blogRoutes, // Adiciona os posts ao sitemap final
  ];
}