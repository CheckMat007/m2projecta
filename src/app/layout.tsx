// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import DevelopmentBanner from '@/components/ui/DevelopmentBanner'
import Providers from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'M2 Projecta | Filmagem e Imagens Aéreas com Drone em Taubaté e Região',
  description: 'Especialistas em imagens de drone para mercado imobiliário, eventos, vídeos corporativos e turismo no Vale do Paraíba. Eleve seu projeto com perspectivas que impressionam.',
  keywords: 'drone, imagens de drone, filmagem aérea, Taubaté, Vale do Paraíba, São José dos Campos, mercado imobiliário, vídeos corporativos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        {/* Adiciona o link para o CSS da Swiper aqui */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <DevelopmentBanner />
      </body>
    </html>
  )
}