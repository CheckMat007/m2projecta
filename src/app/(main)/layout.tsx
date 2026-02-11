// src/app/(main)/layout.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
//import DevelopmentBanner from '@/components/ui/DevelopmentBanner'
import Script from "next/script";
import { CookieConsentBanner } from '@/components/CookieConsentBanner';

// 1. Importação do Prisma Client (ajuste o caminho se o seu arquivo prisma.ts estiver em outro local)
import { prisma } from "@/lib/prisma";

// 2. Transformado em função async para permitir fetch no servidor
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // 3. Busca otimizada dos serviços: 
  // O uso do 'select' garante que não baixaremos as descrições longas ou imagens pesadas, apenas o essencial para o menu.
  const services = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: 'asc' // Ordena alfabeticamente para melhor UX no menu
    }
  });

  return (
    <>
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