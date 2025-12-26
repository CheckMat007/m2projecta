// src/app/layout.tsx
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.m2projecta.com.br'),

  title: {
    template: '%s | M2 Projecta',
    default:
      'M2 Projecta | Imagens com Drones: Vídeos Corporativos, Inspeções em Obras, 360° e Imagens Aéreas no Vale do Paraíba',
  },

  description:
    'A M2 Projecta é especialista em imagens aéreas com drone para inspeções de obra, vídeos corporativos, mercado imobiliário, eventos e imagens 360° no Vale do Paraíba (SP) e região. Produção audiovisual profissional.',

  keywords: [
    'M2 Projecta',
    'imagens aéreas com drone',
    'inspeção de obra',
    'filmagem com drone',
    'drone imobiliário',
    'vídeo corporativo',
    'vídeo institucional',
    'imagens 360 graus',
    'tour virtual 360',
    'filmagem de eventos',
    'produção audiovisual',
    'drone no vale do paraíba',
    'drone são josé dos campos',
    'drone taubaté',
    'drone jacareí',
    'drone caçapava',
  ],

  openGraph: {
    title:
      'M2 Projecta | Imagens Aéreas no Vale do Paraíba',
    description:
      'Produção audiovisual profissional com drones para imóveis, empresas e eventos no Vale do Paraíba.',
    url: '/',
    siteName: 'M2 Projecta',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'M2 Projecta - Imagens Aéreas com Drone no Vale do Paraíba',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'M2 Projecta | Imagens Aéreas e Produção Audiovisual',
    description:
      'Imagens aéreas com drone, vídeos corporativos, imobiliários, 360° e eventos no Vale do Paraíba.',
    images: ['/og-image.png'],
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-inter',
});

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.m2projecta.com.br/#localbusiness",
  "name": "M2 Projecta",
  "url": "https://www.m2projecta.com.br/",
  "logo": "https://www.m2projecta.com.br/logo.png",
  "image": "https://www.m2projecta.com.br/logo.png",
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
    {
      "@type": "City",
      "name": "Taubaté",
    },
    {
      "@type": "City",
      "name": "Tremembé",
    },
    {
      "@type": "City",
      "name": "Pindamonhangaba",
    },
    {
      "@type": "City",
      "name": "Ubatuba",
    },
    {
      "@type": "City",
      "name": "Caraguatatuba",
    },
    {
      "@type": "City",
      "name": "São Luís do Paraitinga",
    },
    {
      "@type": "City",
      "name": "Campos do Jordão",
    },
    {
      "@type": "City",
      "name": "Cruzeiro",
    },
    {
      "@type": "City",
      "name": "Cachoeira Paulista",
    },
    {
      "@type": "City",
      "name": "Guaratinguetá",
    },
    {
      "@type": "City",
      "name": "Aparecida",
    },
    {
      "@type": "City",
      "name": "São José dos Campos",
    },
    {
      "@type": "City",
      "name": "Jacareí",
    },
    {
      "@type": "City",
      "name": "Caçapava",
    }
  ],
  "sameAs": [
    "https://www.instagram.com/m2projecta/",
    "https://www.youtube.com/@M2Projecta",
    "https://www.tiktok.com/@m2.projecta"
  ],
  "makesOffer": [
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em Taubaté",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em Taubaté - SP.",
      "areaServed": {
        "@type": "City",
        "name": "Taubaté",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  },
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em São José dos Campos",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em São José dos Campos - SP.",
      "areaServed": {
        "@type": "City",
        "name": "São José dos Campos",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  },
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em Jacareí",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em Jacareí - SP.",
      "areaServed": {
        "@type": "City",
        "name": "Jacareí",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  },
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em Caçapava",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em em Caçapava - SP.",
      "areaServed": {
        "@type": "City",
        "name": "Caçapava",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  },
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em Tremembé",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em Tremembé - SP.",
      "areaServed": {
        "@type": "City",
        "name": "Tremembé",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  },
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em Pindamonhangaba",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em Pindamonhangaba - SP.",
      "areaServed": {
        "@type": "City",
        "name": "Pindamonhangaba",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  },
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em Ubatuba",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em Ubatuba - SP.",
      "areaServed": {
        "@type": "City",
        "name": "Ubatuba",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  },
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em Caraguatatuba",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em Caraguatatuba - SP.",
      "areaServed": {
        "@type": "City",
        "name": "Caraguatatuba",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  },
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em São Luís do Paraitinga",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em em São Luís do Paraitinga - SP.",
      "areaServed": {
        "@type": "City",
        "name": "São Luís do Paraitinga",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  },
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em Campos do Jordão",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em Campos do Jordão - SP.",
      "areaServed": {
        "@type": "City",
        "name": "Campos do Jordão",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  },
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em Cruzeiro",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em Cruzeiro - SP.",
      "areaServed": {
        "@type": "City",
        "name": "Cruzeiro",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  },
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em Cachoeira Paulista",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em em Cachoeira Paulista - SP.",
      "areaServed": {
        "@type": "City",
        "name": "Cachoeira Paulista",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  },
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em Guaratinguetá",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em Guaratinguetá - SP.",
      "areaServed": {
        "@type": "City",
        "name": "Guaratinguetá",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  },
  {
    "@type": "Offer",
    "itemOffered": {
      "@type": "Service",
      "@id": "https://www.m2projecta.com.br/servicos",
      "name": "Imagens aéreas com drone em Aparecida",
      "description": "Serviço profissional de imagens aéreas com drone para imóveis, empresas e eventos em Aparecida - SP.",
      "areaServed": {
        "@type": "City",
        "name": "Aparecida",
        "addressRegion": "SP"
      },
      "provider": {
        "@type": "ProfessionalService",
        "name": "M2 Projecta",
        "url": "https://www.m2projecta.com.br"
      }
    }
  }
]
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
