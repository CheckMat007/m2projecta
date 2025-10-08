// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-inter' // Deixamos isso aqui por enquanto, não atrapalha
})

export const metadata: Metadata = {
  title: 'M2 Projecta - Filmagem Profissional com Drones',
  description: 'Capturamos imagens aéreas de alta definição para elevar o nível do seu projeto, evento ou negócio.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      {/* A ÚNICA MUDANÇA É AQUI: .variable -> .className */}
      <body className={inter.className}>{children}</body>
    </html>
  )
}