// src/app/(main)/layout.tsx

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import DevelopmentBanner from '@/components/ui/DevelopmentBanner'
import Script from "next/script";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
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
    </>
  );
}