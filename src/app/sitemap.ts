// src/app/sitemap.ts

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // URL base do seu site
  const baseUrl = 'https://www.m2projecta.com.br';

  // Lista de páginas estáticas
  const staticRoutes = [
    '/',
    '/sobre',
    '/servicos',
    '/portfolio',
    '/blog',
    '/contato',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const, // Com que frequência a página muda
    priority: route === '/' ? 1 : 0.8,      // A Home é a mais importante
  }));

  // No futuro, quando o portfólio e o blog forem dinâmicos, adicionaremos a lógica aqui
  // para buscar os projetos e posts do banco de dados e adicioná-los ao sitemap.

  return [
    ...staticRoutes,
    // ...dynamicRoutes (quando existirem)
  ];
}