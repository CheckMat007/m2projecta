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
      'M2 Projecta | Imagens com Drones: Vídeos Corporativos, 360° e Imagens Aéreas no Vale do Paraíba',
  },

  description:
    'A M2 Projecta é especialista em imagens aéreas com drone para inspeções de obra, vídeos corporativos, mercado imobiliário, eventos e imagens 360° no Vale do Paraíba (SP). Produção audiovisual profissional.',

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
      'M2 Projecta | Imagens Aéreas, Vídeos Corporativos e Drone no Vale do Paraíba',
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
      'Imagens aéreas com drone, vídeos corporativos, imobiliários e eventos no Vale do Paraíba.',
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
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'M2 Projecta',
  url: 'https://www.m2projecta.com.br',
  logo: 'https://www.m2projecta.com.br/logo.png',
  description:
    'Empresa especializada em imagens aéreas com drone, vídeos corporativos, imobiliários, eventos e imagens 360° no Vale do Paraíba.',
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Vale do Paraíba - SP',
  },
  serviceType: [
    'Imagens aéreas com drone',
    'Vídeos corporativos',
    'Vídeos imobiliários',
    'Filmagem de eventos',
    'Imagens 360 graus',
    'Tour virtual 360',
  ],
  sameAs: [
    'https://www.instagram.com/m2projecta/',
    'https://www.youtube.com/@M2Projecta',
    'https://www.tiktok.com/@m2.projecta',
  ],
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
