// src/app/(main)/home-client.tsx
'use client'; 

import React, { useState, ReactNode } from 'react';
import Script from 'next/script';
import Image from 'next/image'; 
import Link from "next/link";
import { YouTubeEmbed } from '@next/third-parties/google';
import { PortfolioSlider } from '@/components/PortfolioSlider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building, CheckCircle, Clock, Users, Video, Settings } from 'lucide-react';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { iconMap } from '@/lib/icons';
import type { Service } from '@prisma/client';

// --- DEFINIÇÕES DE TIPO ---
type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
  backgroundImage: string;
};

type Testimonial = {
  quote: { start: string; highlight: string; end: string };
  name: string;
  company: string;
  image: string;
  backgroundImage: string;
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type HomeClientPageProps = {
  heroVideoId: string;
  heroVideoIsVertical?: boolean;
  portfolioItems: PortfolioItem[];
  testimonials: Testimonial[];
  faqItems: FaqItem[];
  services: Service[];
  googleReviews?: ReactNode;
};

const statsData = [
  { icon: CheckCircle, number: 20, label: 'Projetos feitos' },
  { icon: Clock, number: 5, label: 'Anos como piloto' },
  { icon: Users, number: 5, label: 'Certificações' },
  { icon: Video, number: 160, label: 'Horas de Voo' },
];

export default function HomeClientPage({ heroVideoId, heroVideoIsVertical, portfolioItems, faqItems, services, googleReviews }: HomeClientPageProps) {
  const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);

  const portfolioBgImage = portfolioItems[activePortfolioIndex]?.backgroundImage || '/assets/hero-image.JPG';
  
  const faqSchema = faqItems && faqItems.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }
    : null;

  return (
    <>
      {/* --- SEÇÃO HERO --- */}
      <section id="home" aria-label="Introdução" className="relative w-full min-h-[600px] md:min-h-[85vh] py-20 md:py-0 flex items-center overflow-hidden">
        
        <div className="absolute inset-0 w-full h-full -z-20">
          <Image
            src="/assets/hero-image.JPG"
            alt="Visão aérea de um projeto imobiliário capturado por drone"
            fill
            priority={true}
            quality={90}    
            sizes="100vw"
            className="object-cover object-top md:object-center"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 -z-10" aria-hidden="true" />
        
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-x-12 items-center md:pt-20">
            
            <div className="text-center md:text-left mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wider leading-tight text-white drop-shadow-lg">
                Perspectivas que <span className="text-m2-green">Impressionam</span>
              </h1>
              <p className="mt-6 text-lg text-gray-200 font-medium drop-shadow-md max-w-xl mx-auto md:mx-0">
                Aliamos tecnologia de ponta a uma abordagem cinematográfica para capturar com excelência a essência do seu projeto. De empreendimentos imobiliários a eventos corporativos.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a 
                  href="https://wa.me/5512991316774?text=Oi,%20quero%20falar%20sobre%20um%20projeto!" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-m2-green text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105 shadow-lg flex justify-center items-center"
                >
                  Solicite um Orçamento
                </a>
                <Link 
                  href="/servicos" 
                  className="bg-white/90 backdrop-blur-sm text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-m2-green transition-colors duration-300 transform hover:scale-105 shadow-lg flex justify-center items-center"
                >
                  Conheça Nossos Serviços
                </Link>
              </div>
            </div>
            
            <div className="w-full hidden md:block">
              <div
                className={
                  heroVideoIsVertical
                    ? "aspect-[9/16] h-[60vh] max-h-[600px] w-auto mx-auto overflow-hidden rounded-lg shadow-2xl bg-black border border-white/10 z-20 relative [&_lite-youtube]:w-full [&_lite-youtube]:h-full [&_lite-youtube]:absolute [&_lite-youtube]:top-0 [&_lite-youtube]:left-0"
                    : "aspect-video w-full overflow-hidden rounded-lg shadow-2xl bg-black border border-white/10 z-20 relative [&_lite-youtube]:w-full [&_lite-youtube]:h-full [&_lite-youtube]:absolute [&_lite-youtube]:top-0 [&_lite-youtube]:left-0"
                }
              >
                 <YouTubeEmbed
                    videoid={heroVideoId}
                    params="rel=0&modestbranding=1"
                 />
              </div>
              <div className="flex items-center justify-center mt-3" aria-hidden="true">
                <Settings className="w-4 h-4 text-m2-green mr-2" />
                <p className="text-xs text-gray-400">
                  Recomendamos ativar a qualidade 4K no player.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO DE SERVIÇOS (Separada semânticamente do Hero) --- */}
      <section id="servicos" className="w-full relative z-20 bg-gradient-to-b from-black to-m2-dark pb-16 pt-8 md:pt-16">
        <div className="container mx-auto px-6 text-center">
          {/* H2 invisível apenas para acessibilidade (Screen Readers) para não quebrar o layout original, mas manter a semântica */}
          <h2 className="sr-only">Nossos Serviços</h2>
          
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {services.slice(0, 5).map((service) => {
              const IconComponent = iconMap[service.icon] || Building;
              return (
                <Link 
                  href={`/servicos/${service.slug}`} 
                  key={service.slug} 
                  className="group block bg-m2-dark p-8 rounded-lg shadow-xl border border-gray-800 text-center transition-all duration-300 hover:border-m2-green hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-m2-green"
                >
                  <IconComponent className="w-12 h-12 text-m2-green mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-bold mb-2 text-white">{service.name}</h3>
                  <p className="text-gray-400 text-sm">{service.shortDescription}</p>
                </Link>
              )
            })}
          </div>

          <div className="mt-16">
            <Link href="/servicos" className="text-m2-green font-bold text-lg group inline-block">
              <span className="relative text-m2-green group-hover:text-m2-green transition-colors">
                Veja todos os serviços &rarr;
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* --- SEÇÃO DE PORTFÓLIO --- */}
      <section id="portfolio-home" className="py-20 relative overflow-hidden min-h-[600px]">
        <div className="absolute inset-0 w-full h-full z-0">
           {portfolioBgImage && (
             <Image
                key={portfolioBgImage}
                src={portfolioBgImage}
                alt="" 
                fill
                className="object-cover transition-opacity duration-700 ease-in-out opacity-30"
                sizes="(max-width: 768px) 150vw, 100vw"
                quality={85}
                priority={false}
                aria-hidden="true"
             />
           )}
           <div className="absolute inset-0 bg-m2-dark -z-10" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black z-10" aria-hidden="true" />
        
        <div className="container mx-auto px-6 text-center relative z-20">
          <h2 className="text-3xl font-bold uppercase text-white">Portfólio em <span className="text-m2-green">Destaque</span></h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Explore alguns dos nossos projetos mais recentes.</p>
        </div>

        <div className="mt-12 w-full relative z-20">
          <PortfolioSlider 
            portfolioItems={portfolioItems}
            onActiveIndexChange={setActivePortfolioIndex}
          />
        </div>

        <div className="container mx-auto px-6 text-center mt-12 relative z-20">
          <Link href="/portfolio" className="text-m2-green font-bold text-lg group inline-block focus:outline-none focus:ring-2 focus:ring-m2-green focus:ring-offset-4 focus:ring-offset-black rounded">
            <span className="relative text-m2-green group-hover:text-m2-green transition-colors">
              Galeria de projetos →
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
          </Link>
        </div>
      </section>

      {/* --- SEÇÃO DE NÚMEROS --- */}
      <section id="stats" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase text-white">Nossa Experiência em <span className="text-m2-green">Números</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statsData.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <stat.icon className="w-12 h-12 text-m2-green" aria-hidden="true" />
                <p className="text-5xl font-black text-white mt-4" aria-label={`${stat.number} ${stat.label}`}>
                  +<AnimatedCounter end={stat.number} />
                </p>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {googleReviews}

      {/* --- SEÇÃO DE FAQ --- */}
      <section id="faq" className="py-20 bg-m2-dark border-t border-gray-900">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase text-white">Tirando Suas <span className="text-m2-green">Dúvidas</span></h2>
            <p className="text-gray-400 mt-2">Respostas para as perguntas mais comuns antes de você iniciar seu projeto.</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item: FaqItem) => (
              <AccordionItem key={item.id} value={item.id} className="border-b border-gray-800">
                <AccordionTrigger className="text-left text-lg hover:no-underline text-white hover:text-m2-green transition-colors focus:ring-2 focus:ring-m2-green rounded-sm">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pt-2 pb-4 text-left text-base leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      {/* --- SCRIPTS ANALYTICS --- */}
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
    </>
  );
}