// src/app/layout.tsx
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "M2 Projecta",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. Adicionado suppressHydrationWarning
    // 2. Adicionado className="dark" para o primeiro carregamento (SSR)
    <html lang="pt-BR" className="scroll-smooth dark" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}