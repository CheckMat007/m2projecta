// src/app/layout.tsx
import { Metadata } from 'next';
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers';

export const metadata: Metadata = {
  title: 'M2 Projecta | Filmagem e Imagens Aéreas com Drone em Taubaté e Região',
  description: 'Especialistas em imagens de drone para mercado imobiliário, eventos, vídeos corporativos e turismo no Vale do Paraíba. Eleve seu projeto com perspectivas que impressionam.',
  keywords: 'drone, imagens de drone, filmagem aérea, Taubaté, Vale do Paraíba, São José dos Campos, mercado imobiliário, vídeos corporativos',
  
  openGraph: {
    title: 'M2 Projecta | Filmagem e Imagens Aéreas com Drone',
    description: 'Especialistas em imagens de drone para o Vale do Paraíba.',
    url: 'https://www.m2projecta.com.br',
    siteName: 'M2 Projecta',
    images: [{
      url: 'https://www.m2projecta.com.br/og-image.png',
      width: 1200,
      height: 630,
      alt: 'M2 Projecta - Imagens Aéreas com Drone',
    }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M2 Projecta | Filmagem e Imagens Aéreas com Drone',
    description: 'Especialistas em imagens de drone para o Vale do Paraíba.',
    images: ['https://www.m2projecta.com.br/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico', 
    apple: '/apple-icon.png', 
  },
};

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-inter'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}