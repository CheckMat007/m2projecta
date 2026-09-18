// src/app/sitemap.ts

import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

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
      slug: true,
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

  // 4. Busca CATEGORIAS e TAGS do blog (páginas de arquivo reais, indexáveis, que
  // antes não apareciam no sitemap — o Google só as encontrava seguindo links internos)
  const categories = await prisma.category.findMany({
    where: { posts: { some: { status: 'PUBLISHED' } } },
    select: { slug: true },
  });

  const tags = await prisma.tag.findMany({
    where: { posts: { some: { status: 'PUBLISHED' } } },
    select: { slug: true },
  });

  // --- Mapeamento das URLs ---

  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/servicos/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const portfolioRoutes = portfolioItems.map((item) => ({
    url: `${baseUrl}/portfolio/${item.slug}`,
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

  const blogCategoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/blog/categoria/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  const blogTagRoutes = tags.map((tag) => ({
    url: `${baseUrl}/blog/tag/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.4,
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
    ...blogCategoryRoutes,
    ...blogTagRoutes,
  ];
}