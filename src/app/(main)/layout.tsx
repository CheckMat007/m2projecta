// src/app/(main)/layout.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
//import DevelopmentBanner from '@/components/ui/DevelopmentBanner'
import Script from "next/script";
import { CookieConsentBanner } from '@/components/CookieConsentBanner';
import { JsonLd } from '@/components/JsonLd';
import { SITE_URL } from '@/lib/site';

// 1. Importação do Prisma Client (ajuste o caminho se o seu arquivo prisma.ts estiver em outro local)
import { prisma } from "@/lib/prisma";

// 2. Transformado em função async para permitir fetch no servidor
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // 3. Busca otimizada dos serviços (para o menu) e das estatísticas reais de avaliação
  // (para o dado estruturado) em paralelo, já que uma consulta não depende da outra.
  // O uso do 'select' garante que não baixaremos as descrições longas ou imagens pesadas, apenas o essencial para o menu.
  const [services, reviewStats] = await Promise.all([
    prisma.service.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
      },
      orderBy: {
        name: 'asc' // Ordena alfabeticamente para melhor UX no menu
      }
    }),
    // Só entram no schema se já existirem avaliações — nunca inventamos nota/quantidade
    prisma.googleReview.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    "name": "M2 Projecta",
    "url": `${SITE_URL}/`,
    "logo": `${SITE_URL}/logo.png`,
    "image": `${SITE_URL}/logo.png`,
    "description":
      "Empresa especializada em imagens aéreas com drone, vídeos corporativos, imobiliários, eventos e imagens 360° no Vale do Paraíba.",
    "telephone": "+55 12 99131-6774",
    "priceRange": "$$",

    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Dom Duarte Leopoldo e Silva, 131",
      "addressLocality": "Taubaté",
      "addressRegion": "SP",
      "postalCode": "12070-590",
      "addressCountry": "BR"
    },

    "areaServed": [
      { "@type": "City", "name": "Taubaté" },
      { "@type": "City", "name": "Tremembé" },
      { "@type": "City", "name": "Pindamonhangaba" },
      { "@type": "City", "name": "Ubatuba" },
      { "@type": "City", "name": "Caraguatatuba" },
      { "@type": "City", "name": "São Luís do Paraitinga" },
      { "@type": "City", "name": "Campos do Jordão" },
      { "@type": "City", "name": "Cruzeiro" },
      { "@type": "City", "name": "Cachoeira Paulista" },
      { "@type": "City", "name": "Guaratinguetá" },
      { "@type": "City", "name": "Aparecida" },
      { "@type": "City", "name": "São José dos Campos" },
      { "@type": "City", "name": "Jacareí" },
      { "@type": "City", "name": "Caçapava" }
    ],
    "sameAs": [
      "https://www.instagram.com/m2projecta/",
      "https://www.youtube.com/@M2Projecta",
      "https://www.tiktok.com/@m2.projecta"
    ],
    // Ofertas geradas a partir do catálogo real de serviços (CMS), evitando divergência
    // entre o que está anunciado no site e o que aparece no dado estruturado.
    "makesOffer": services.map((service) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": service.name,
        "description": service.shortDescription,
        "url": `${SITE_URL}/servicos/${service.slug}`,
      },
    })),
    ...(reviewStats._count.rating > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": reviewStats._avg.rating?.toFixed(1),
        "reviewCount": reviewStats._count.rating,
      },
    }),
  };

  return (
    <>
      {/* Dado estruturado (JSON-LD) só nas páginas públicas — não faz sentido no painel gestor/cliente */}
      <JsonLd data={localBusinessSchema} />

      {/* 4. Passando a prop dinâmica para o Header */}
      <Header services={services} />
      
      <main>
        {children}
      </main>
      
      <Footer />

      {/* Script do Google Analytics para todas as páginas públicas */}
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=G-6F0RMM5CY2" 
        strategy="afterInteractive" 
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-6F0RMM5CY2');
        `}
      </Script>
      {/*<DevelopmentBanner />*/}
      <CookieConsentBanner />
    </>
  );
}