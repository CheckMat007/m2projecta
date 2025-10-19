// src/app/(main)/page.tsx
'use client'; 

// 1. ADICIONADO useState
import React, { useState } from 'react';
import Script from 'next/script';
import { PortfolioSlider } from '@/components/PortfolioSlider';
import { TestimonialsSlider } from '@/components/TestimonialsSlider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building, Clapperboard, PartyPopper, Hotel } from 'lucide-react';

// Componente para um card de serviço individual
const ServiceCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <div className="bg-m2-dark p-8 rounded-lg shadow-xl border border-gray-800 text-center transition-all duration-300 hover:border-m2-green hover:-translate-y-2">
    <Icon className="w-12 h-12 text-m2-green mx-auto mb-4" />
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-400">{children}</p>
  </div>
);

// Dados para a seção de FAQ
const faqItems = [
    { question: "Vocês possuem todas as licenças da ANAC para voos de drone?", answer: "Sim. Todos os nossos equipamentos são homologados e os voos são realizados em conformidade com as normas da ANAC e DECEA, garantindo total segurança e legalidade." },
    { question: "Qual a área de atuação da M2 Projecta?", answer: "Nossa base é em Taubaté - SP, e atendemos toda a região do Vale do Paraíba, Litoral Norte e Serra da Mantiqueira. Para projetos especiais, consulte-nos sobre a disponibilidade em outras localidades." },
    { question: "Em quanto tempo o material final é entregue?", answer: "O prazo de entrega varia conforme a complexidade do projeto. Para projetos padrão, o prazo médio é de 5 a 10 dias úteis após a data da captação das imagens." },
    { question: "Além da filmagem, vocês também fazem a edição do vídeo?", answer: "Com certeza. Oferecemos o serviço completo, desde o planejamento e captação até a pós-produção profissional, incluindo edição, color grading, trilha sonora e finalização." },
];

// 2. DADOS DOS TESTIMONIALS MOVIDOS PARA CÁ
const testimonialsData = [
    { 
      quote: { start: "O resultado final superou todas as nossas expectativas. As imagens aéreas deram ", highlight: "uma nova dimensão ao nosso empreendimento.", end: "" },
      name: 'João da Silva', company: 'Diretor de Marketing, Construtora X', image: '/assets/testimonials/equipe-m2-projecta.png',
      backgroundImage: '/assets/portfolio/obra_vila_sao_jose.jpg'
    },
    { 
      quote: { start: "Profissionalismo impecável do início ao fim. A M2 Projecta entendeu nossa visão e a traduziu em ", highlight: "um vídeo corporativo que impressionou nossos stakeholders.", end: "" },
      name: 'Maria Oliveira', company: 'CEO, TechCorp', image: '/assets/testimonials/equipe-m2-projecta.png',
      backgroundImage: '/assets/portfolio/via_vale.jpg'
    },
    { 
      quote: { start: "A cobertura do nosso evento foi espetacular. A perspectiva do drone capturou a energia do momento de uma forma que ", highlight: "câmeras no chão jamais conseguiriam.", end: "" },
      name: 'Carlos Pereira', company: 'Organizador, Festival MusicVibe', image: '/assets/testimonials/equipe-m2-projecta.png',
      backgroundImage: '/assets/portfolio/quiririm.jpg'
    },
];

export default function HomePage() {
  // 3. ESTADO DO SLIDE ATIVO AGORA VIVE AQUI
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      {/* 1. HERO SECTION COM OTIMIZAÇÃO MOBILE */}
      <section id="home" className="relative w-full hero-image-bg">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-x-12 items-center pt-28 pb-20 md:pt-40 md:pb-28">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-wider leading-tight text-white">
              Perspectivas que <span className="text-m2-green">Impressionam</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              Combinamos tecnologia de ponta e um olhar cinematográfico para capturar a essência do seu projeto. De empreendimentos imobiliários a eventos corporativos, criamos imagens aéreas que geram resultados.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="/contato" className="bg-m2-green text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105">
                Solicite um Orçamento
              </a>
              <a href="/servicos" className="border-2 border-m2-green text-m2-green font-bold py-3 px-8 rounded-lg text-lg hover:bg-m2-green hover:text-black transition-colors duration-300">
                Conheça Nossos Serviços
              </a>
            </div>
          </div>
          <div className="w-full hidden md:block">
            <div className="aspect-video w-full overflow-hidden rounded-lg shadow-2xl">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/xk4lN3K5jzg?si=K64_d6Nnu7PYBwjz" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
        {/*section dos serviços*/}
        <div className="container mx-auto px-6 text-center">
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 -mt-25 lg:-mt-30">
            <ServiceCard icon={Building} title="Mercado Imobiliário">
              Imagens e vídeos que valorizam e aceleram a venda de empreendimentos.
            </ServiceCard>
            <ServiceCard icon={Clapperboard} title="Vídeos Corporativos">
              Produções com impacto cinematográfico para fortalecer sua marca.
            </ServiceCard>
            <ServiceCard icon={PartyPopper} title="Cobertura de Eventos">
              Registre momentos únicos por uma perspectiva inesquecível.
            </ServiceCard>
            <ServiceCard icon={Hotel} title="Turismo e Hotelaria">
              Mostre a grandiosidade do seu espaço e atraia mais hóspedes.
            </ServiceCard>
          </div>
          <div className="container mx-auto px-6 text-center mt-12">
          <a href="/servicos" className="text-m2-green font-bold hover:underline text-lg">Veja todos os serviços &rarr;</a>
        </div>
        </div>
      </section>

      {/* 2. SEÇÃO DE SERVIÇOS COM OTIMIZAÇÃO MOBILE versão antiga com sections separadas
      <section id="servicos-home" className="py-20 bg-black">
        <div className="container mx-auto px-6 text-center">
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 -mt-32 lg:-mt-40">
            <ServiceCard icon={Building} title="Mercado Imobiliário">
              Imagens e vídeos que valorizam e aceleram a venda de empreendimentos.
            </ServiceCard>
            <ServiceCard icon={Clapperboard} title="Vídeos Corporativos">
              Produções com impacto cinematográfico para fortalecer sua marca.
            </ServiceCard>
            <ServiceCard icon={PartyPopper} title="Cobertura de Eventos">
              Registre momentos únicos por uma perspectiva inesquecível.
            </ServiceCard>
            <ServiceCard icon={Hotel} title="Turismo e Hotelaria">
              Mostre a grandiosidade do seu espaço e atraia mais hóspedes.
            </ServiceCard>
          </div>
          <div className="mt-16">
            <a href="/servicos" className="text-m2-green font-bold hover:underline text-lg">Veja todos os serviços &rarr;</a>
          </div>
        </div>
      </section>*/}

      {/* 3. SEÇÃO DE PORTFÓLIO MODIFICADA */}
      <section id="portfolio-home" className="py-10 bg-m2-dark overflow-hidden">
        {/* O texto continua dentro do container para manter o alinhamento */}
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold uppercase">Portfólio em <span className="text-m2-green">Destaque</span></h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Explore alguns dos nossos projetos mais recentes.</p>
        </div>
        
        {/* O slider agora é renderizado FORA do container para ocupar a largura total */}
        <div className="mt-12 w-full">
           <PortfolioSlider />
        </div>
        
        <div className="container mx-auto px-6 text-center mt-12">
          <a href="/portfolio" className="text-m2-green font-bold hover:underline text-lg">Veja todos os projetos &rarr;</a>
        </div>
      </section>

      {/* 4. SEÇÃO DE AVALIAÇÕES MODIFICADA */}
      <section id="avaliacoes" className="py-20 bg-black relative overflow-hidden">
        <div 
          className="testimonial-bg-image" 
          style={{ backgroundImage: `url(${testimonialsData[activeIndex].backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-black/90 z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase">Resultados que Geram <span className="text-m2-green">Confiança</span></h2>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Veja o que nossos clientes dizem sobre o impacto do nosso trabalho.</p>
          </div>
          <TestimonialsSlider 
            testimonials={testimonialsData} 
            onActiveIndexChange={setActiveIndex} 
          />
        </div>
      </section>
      
      {/* 5. SEÇÃO DE FAQ COM OTIMIZAÇÃO MOBILE */}
      <section id="faq" className="py-20 bg-m2-dark">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase">Tirando Suas <span className="text-m2-green">Dúvidas</span></h2>
            <p className="text-gray-400 mt-2">Respostas para as perguntas mais comuns antes de você iniciar seu projeto.</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-800">
                <AccordionTrigger className="text-left text-lg hover:no-underline">{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-300 pt-2 pb-4 text-left text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      
      {/* Scripts do Analytics */}
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