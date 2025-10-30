// src/app/(main)/home-client.tsx
'use client'; 

import React, { useState } from 'react';
import Script from 'next/script';
import Link from "next/link";
import { PortfolioSlider } from '@/components/PortfolioSlider';
// desativado até ter comentários reais: import { TestimonialsSlider } from '@/components/TestimonialsSlider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building, CheckCircle, Clock, Users, Video, Settings } from 'lucide-react';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { iconMap } from '@/lib/icons'; // Importa o mapa de ícones
import type { Service } from '@prisma/client'; // Importa o tipo Service

// --- INÍCIO DAS DEFINIÇÕES DE TIPO ---
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
  services: Service[]; // Adiciona a prop para serviços
};
// --- FIM DAS DEFINIÇÕES DE TIPO ---

const statsData = [
  { icon: CheckCircle, number: 20, label: 'Projetos feitos' },
  { icon: Clock, number: 5, label: 'Anos como piloto' },
  { icon: Users, number: 5, label: 'Certificações' },
  { icon: Video, number: 160, label: 'Horas de Voo' },
];

export default function HomeClientPage({ heroVideoId, portfolioItems, faqItems, services }: HomeClientPageProps) { //Original desativado até ter comentários reais: export default function HomeClientPage({ heroVideoId, portfolioItems, testimonials, faqItems, services }: HomeClientPageProps) {
  //desativado até ter comentários reais: const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);

  const portfolioBgImage = portfolioItems[activePortfolioIndex]?.backgroundImage || '/assets/hero-image.JPG';
  // desativado até ter comentários reais: const testimonialBgImage = testimonials[activeTestimonialIndex]?.backgroundImage || portfolioItems[0]?.backgroundImage || '/assets/portfolio/dutra.JPG';

  return (
    <>
      <section id="home" className="relative w-full hero-image-bg">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-0"></div>
        <div className="relative z-10">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-x-12 items-center pt-28 pb-20 md:pt-40 md:pb-10">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wider leading-tight text-white">
                Perspectivas que <span className="text-m2-green">Impressionam</span>
              </h1>
              <p className="mt-6 text-lg text-gray-300">
                Aliamos tecnologia de ponta a uma abordagem cinematográfica para capturar com excelência a essência do seu projeto. De empreendimentos imobiliários a eventos corporativos, produzimos imagens aéreas que agregam valor e impulsionam resultados.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="https://wa.me/5512991316774?text=Oi,%20quero%20falar%20sobre%20um%20projeto!" target="_blank" rel="noopener noreferrer" className="bg-m2-green text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105">
                  Solicite um Orçamento
                </a>
                <a href="/servicos" className="bg-white text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-m2-green transition-colors duration-300 transform hover:scale-105">
                  Conheça Nossos Serviços
                </a>
              </div>
            </div>
            <div className="w-full hidden md:block">
              <div className="aspect-video w-full overflow-hidden rounded-lg shadow-2xl">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${heroVideoId}?si=K64_d6Nnu7PYBwjz`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              <div className="flex items-center justify-center mt-3">
                <Settings className="w-4 h-4 text-m2-green mr-2" />
                <p className="text-xs text-gray-400">
                  Para a melhor experiência, ative a qualidade 4K nas configurações do vídeo.
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
                  <Link href={`/servicos/${service.id}`} key={service.id} className="group block bg-m2-dark p-8 rounded-lg shadow-xl border border-gray-800 text-center transition-all duration-300 hover:border-m2-green hover:-translate-y-2">
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

      {/* Seção de Portfólio */}
      <section id="portfolio-home" className="py-6 bg-m2-dark relative overflow-hidden">
        <div 
          className="portfolio-bg-image" 
          style={{ backgroundImage: `url(${portfolioBgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black z-0" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-bold uppercase">Portfólio em <span className="text-m2-green">Destaque</span></h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Explore alguns dos nossos projetos mais recentes.</p>
        </div>
        <div className="mt-12 w-full relative z-10">
          <PortfolioSlider 
            portfolioItems={portfolioItems}
            onActiveIndexChange={setActivePortfolioIndex}
          />
        </div>
        <div className="container mx-auto px-6 text-center mt-12 relative z-10">
          <a href="/portfolio" className="text-m2-green  font-bold text-lg group">
            <span className="relative text-m2-green group-hover:text-m2-green transition-colors">
              Galeria de projetos &rarr;
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
          </a>
        </div>
      </section>

      {/* Seção de Números */}
      <section id="stats" className="py-10 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase">Nossa Experiência em <span className="text-m2-green">Números</span></h2>
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

      {/* Seção de Avaliações ocultada até ter depoimentos reais
      {testimonials.length > 0 && (
        <section id="avaliacoes" className="py-20 bg-black relative overflow-hidden">
          <div
            className="testimonial-bg-image" 
            style={{ backgroundImage: `url(${testimonialBgImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-m2-dark via-black/60 to-black z-0" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold uppercase">Resultados que Geram <span className="text-m2-green">Confiança</span></h2>
              <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Veja o que nossos clientes dizem sobre o impacto do nosso trabalho.</p>
            </div>
            <TestimonialsSlider 
              testimonials={testimonials} 
              onActiveIndexChange={setActiveTestimonialIndex} 
            />
          </div>
        </section>
      )}
       fim do comentário */}
      
      {/* Seção de FAQ */}
      <section id="faq" className="py-20 bg-m2-dark">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase">Tirando Suas <span className="text-m2-green">Dúvidas</span></h2>
            <p className="text-gray-400 mt-2">Respostas para as perguntas mais comuns antes de você iniciar seu projeto.</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item: FaqItem) => (
              <AccordionItem key={item.id} value={item.id} className="border-b border-gray-800">
                <AccordionTrigger className="text-left text-lg hover:no-underline">{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-300 pt-2 pb-4 text-left text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-6F0RMM5CY2" strategy="afterInteractive" />
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