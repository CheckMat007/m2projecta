// src/app/robots.ts

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.m2projecta.com.br';

  return {
    rules: {
      userAgent: '*',     // Aplica as regras para TODOS os robôs (Google, Bing, etc)
      allow: '/',         // Permite ler todo o site
      disallow: [         // Bloqueia áreas privadas que não devem aparecer no Google
        '/gestor/',       // Bloqueia o painel administrativo
        '/cliente/',      // Bloqueia a área do cliente (privacidade)
        '/api/',          // Bloqueia rotas de API
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Aponta o caminho do mapa do tesouro
  };
}