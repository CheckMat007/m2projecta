// src/app/(main)/home-client.tsx
'use client'; 

import React, { useState } from 'react';
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
  portfolioItems: PortfolioItem[];
  testimonials: Testimonial[];
  faqItems: FaqItem[];
  services: Service[];
};

const statsData = [
  { icon: CheckCircle, number: 20, label: 'Projetos feitos' },
  { icon: Clock, number: 5, label: 'Anos como piloto' },
  { icon: Users, number: 5, label: 'Certificações' },
  { icon: Video, number: 160, label: 'Horas de Voo' },
];

export default function HomeClientPage({ heroVideoId, portfolioItems, faqItems, services }: HomeClientPageProps) {
  const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);

  // Fallback para evitar erro se não houver itens
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
      <section id="home" className="relative w-full min-h-[600px] md:min-h-[85vh] py-20 md:py-0 flex items-center overflow-hidden">
        
        {/* 1. Imagem de Fundo (LCP Otimizado) */}
        <div className="absolute inset-0 w-full h-full -z-20">
          <Image
            src="/assets/hero-image.JPG"
            alt="Imagem aérea de drone M2 Projecta"
            fill
            priority={true}
            quality={90}    
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* 2. Overlay Escuro */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 -z-10"></div>
        
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-x-12 items-center md:pt-20">
            
            {/* Texto Hero */}
            <div className="text-center md:text-left mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wider leading-tight text-white drop-shadow-lg">
                Perspectivas que <span className="text-m2-green">Impressionam</span>
              </h1>
              <p className="mt-6 text-lg text-gray-200 font-medium drop-shadow-md max-w-xl mx-auto md:mx-0">
                Aliamos tecnologia de ponta a uma abordagem cinematográfica para capturar com excelência a essência do seu projeto. De empreendimentos imobiliários a eventos corporativos.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="https://wa.me/5512991316774?text=Oi,%20quero%20falar%20sobre%20um%20projeto!" target="_blank" rel="noopener noreferrer" className="bg-m2-green text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105 shadow-lg">
                  Solicite um Orçamento
                </a>
                <a href="/servicos" className="bg-white/90 backdrop-blur-sm text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-m2-green transition-colors duration-300 transform hover:scale-105 shadow-lg">
                  Conheça Nossos Serviços
                </a>
              </div>
            </div>
            
            {/* Vídeo - Oculto no Mobile */}
            <div className="w-full hidden md:block">
              {/* OTIMIZAÇÃO: Usamos classes do Tailwind no pai ([&_lite-youtube]) para estilizar o componente filho
                  sem precisar passar a prop 'style' que causa o erro de TypeScript. */}
              <div className="aspect-video w-full overflow-hidden rounded-lg shadow-2xl bg-black border border-white/10 z-20 relative [&_lite-youtube]:w-full [&_lite-youtube]:h-full [&_lite-youtube]:absolute [&_lite-youtube]:top-0 [&_lite-youtube]:left-0">
                 <YouTubeEmbed 
                    videoid={heroVideoId}
                    params="rel=0&modestbranding=1" 
                    // Removemos o 'style', 'width' e 'height' daqui para deixar o CSS do pai controlar tudo
                 />
              </div>
              <div className="flex items-center justify-center mt-3">
                <Settings className="w-4 h-4 text-m2-green mr-2" />
                <p className="text-xs text-gray-400">
                  Recomendamos ativar a qualidade 4K no player.
                </p>
              </div>
            </div>
            </div>

          {/* Service Cards Dinâmicos */}

          <div className="container mx-auto px-6 text-center pb-5">

            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mt-12 lg:mt-3">

              {services.slice(0, 5).map((service) => {

                const IconComponent = iconMap[service.icon] || Building;

                return (

                  <Link href={`/servicos/${service.slug}`} key={service.slug} className="group block bg-m2-dark p-8 rounded-lg shadow-xl border border-gray-800 text-center transition-all duration-300 hover:border-m2-green hover:-translate-y-2">

                    <IconComponent className="w-12 h-12 text-m2-green mx-auto mb-4" />

                    <h3 className="text-xl font-bold mb-2 text-white">{service.name}</h3>

                    <p className="text-gray-400 text-sm">{service.shortDescription}</p>

                  </Link>

                )

              })}

            </div>

            <div className="mt-16">

              <a href="/servicos" className="text-m2-green font-bold text-lg group">

                <span className="relative text-m2-green group-hover:text-m2-green transition-colors">

                  Veja todos os serviços &rarr;

                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>

                </span>

              </a>

            </div>

          </div>

        </div>

      </section>

      {/* --- SEÇÃO DE PORTFÓLIO --- */}
      <section id="portfolio-home" className="py-6 relative overflow-hidden min-h-[600px]">
        {/* 1. Background Dinâmico (Camada Base: z-0) */}
        <div className="absolute inset-0 w-full h-full z-0">
           {portfolioBgImage && (
             <Image
                key={portfolioBgImage}
                src={portfolioBgImage}
                alt="Portfolio Background"
                fill
                className="object-cover transition-opacity duration-700 ease-in-out opacity-40"
                sizes="(max-width: 768px) 150vw, 100vw"
                quality={85}
                priority={false}
             />
           )}
           <div className="absolute inset-0 bg-m2-dark -z-10" />
        </div>
        
        {/* 2. Overlay Gradiente (Camada Intermediária: z-10) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black z-10" />
        
        {/* 3. Conteúdo (Camada Superior: z-20) */}
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
          <a href="/portfolio" className="text-m2-green font-bold text-lg group inline-block">
            <span className="relative text-m2-green group-hover:text-m2-green transition-colors">
              Galeria de projetos →
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
          </a>
        </div>
      </section>

      {/* --- SEÇÃO DE NÚMEROS (RESTAURADA) --- */}
      <section id="stats" className="py-10 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase text-white">Nossa Experiência em <span className="text-m2-green">Números</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statsData.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <stat.icon className="w-12 h-12 text-m2-green" />
                <p className="text-5xl font-black text-white mt-4">
                  +<AnimatedCounter end={stat.number} />
                </p>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* --- SEÇÃO DE FAQ --- */}
      <section id="faq" className="py-20 bg-m2-dark">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase text-white">Tirando Suas <span className="text-m2-green">Dúvidas</span></h2>
            <p className="text-gray-400 mt-2">Respostas para as perguntas mais comuns antes de você iniciar seu projeto.</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item: FaqItem) => (
              <AccordionItem key={item.id} value={item.id} className="border-b border-gray-800">
                <AccordionTrigger className="text-left text-lg hover:no-underline text-white">{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-300 pt-2 pb-4 text-left text-base">
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
        strategy="lazyOnload" 
      />
      <Script id="google-analytics" strategy="lazyOnload">
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