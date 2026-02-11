// src/app/(main)/servicos/page.tsx

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import * as LucideIcons from "lucide-react"; 
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Nossos Serviços | M2 Projecta',
  description: 'Conheça nosso catálogo de soluções em imagens aéreas, timelapse, inspeções e monitoramento de obras.',
};

// Busca os dados no servidor
async function getServices() {
  const services = await prisma.service.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  });
  return services;
}

export default async function ServicosPage() {
  const services = await getServices();

  return (
    <>
      {/* 1. HERO SECTION (Tipográfica e Impactante) */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#050505]">
        {/* Efeito de luz de fundo suave */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-m2-green/5 blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-sm font-bold text-m2-green uppercase tracking-[0.3em] mb-4">Portfólio de Soluções</h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider text-white leading-tight max-w-4xl mx-auto">
            Eleve a <span className="text-m2-green">Perspectiva</span> <br className="hidden md:block"/>
            Do Seu Projeto
          </h1>
          <p className="mt-8 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Combinamos tecnologia de drones de ponta com um olhar cinematográfico para entregar muito mais que imagens: entregamos valor, segurança e impacto.
          </p>
        </div>
      </section>

      {/* 2. CATÁLOGO DE SERVIÇOS (Layout Alternado Premium) */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="container mx-auto px-6 max-w-6xl space-y-24 md:space-y-32">
          {services.map((service, index) => {
            // @ts-expect-error - Acesso dinâmico à biblioteca de ícones
            const IconComponent = LucideIcons[service.icon] || LucideIcons.Camera;
            
            // Alterna a direção do layout (Imagem na esquerda, depois direita...)
            const isEven = index % 2 === 0;

            return (
              <div key={service.slug} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center group`}>
                
                {/* Lado da Imagem */}
                <div className="w-full lg:w-1/2">
                  <div className="relative w-full aspect-[4/3] lg:aspect-square max-h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-black">
                    {/* AJUSTE DE HOVER MOBILE: 
                        Usamos 'md:grayscale' para que no mobile a imagem seja sempre colorida nativamente.
                        O efeito PB -> Cor acontece apenas de tablets para cima.
                    */}
                    <Image 
                      src={service.image || '/assets/hero-image.JPG'} 
                      alt={`Apresentação do serviço: ${service.name}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-105 filter md:grayscale md:group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-m2-green/10 mix-blend-overlay opacity-0 md:group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true" />
                  </div>
                </div>

                {/* Lado do Texto */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center text-left">
                  <div className="w-16 h-16 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <IconComponent className="w-8 h-8 text-m2-green" aria-hidden="true" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase">{service.name}</h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    {service.shortDescription}
                  </p>
                  
                  <div>
                    <Link 
                      href={`/servicos/${service.slug}`} 
                      className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-wider text-sm border-b-2 border-m2-green pb-1 hover:text-m2-green transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-black focus-visible:ring-m2-green rounded-sm"
                    >
                      Ver detalhes do serviço
                      <LucideIcons.ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

              </div>
            )
          })}

          {services.length === 0 && (
            <div className="text-center py-20 border border-white/10 rounded-2xl bg-[#0a0a0a]">
              <LucideIcons.AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-xl text-gray-400 font-medium">Nosso catálogo de serviços está sendo atualizado.</p>
              <p className="text-gray-500 mt-2">Volte em breve para novidades!</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. SEÇÃO ESTÁTICA: COMO FUNCIONA */}
      <section className="py-24 bg-m2-dark border-t border-white/5">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-4">Nosso <span className="text-m2-green">Processo</span></h2>
            <p className="text-gray-400 text-lg">Do alinhamento de ideias à entrega final, trabalhamos com um fluxo otimizado.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] w-[80%] h-0.5 bg-gradient-to-r from-m2-green/10 via-m2-green/50 to-m2-green/10" aria-hidden="true"></div>

            <div className="relative bg-[#111] p-8 rounded-2xl border border-white/5 z-10 hover:border-m2-green/30 transition-colors">
              <div className="w-12 h-12 bg-black border-2 border-m2-green rounded-full flex items-center justify-center text-xl font-black text-m2-green absolute -top-6 left-1/2 -translate-x-1/2">
                1
              </div>
              <LucideIcons.ClipboardList className="w-10 h-10 text-white mt-4 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-white mb-2">Briefing & Avaliação</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Entendemos a sua necessidade, estudamos o local de voo e checamos todas as exigências de espaço aéreo.</p>
            </div>

            <div className="relative bg-[#111] p-8 rounded-2xl border border-white/5 z-10 hover:border-m2-green/30 transition-colors">
              <div className="w-12 h-12 bg-black border-2 border-m2-green rounded-full flex items-center justify-center text-xl font-black text-m2-green absolute -top-6 left-1/2 -translate-x-1/2">
                2
              </div>
              <LucideIcons.Crosshair className="w-10 h-10 text-white mt-4 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-white mb-2">Captação em Campo</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Nossa equipe vai a campo com equipamentos de última geração para capturar as imagens com segurança e precisão cênica.</p>
            </div>

            <div className="relative bg-[#111] p-8 rounded-2xl border border-white/5 z-10 hover:border-m2-green/30 transition-colors">
              <div className="w-12 h-12 bg-black border-2 border-m2-green rounded-full flex items-center justify-center text-xl font-black text-m2-green absolute -top-6 left-1/2 -translate-x-1/2">
                3
              </div>
              <LucideIcons.MonitorPlay className="w-10 h-10 text-white mt-4 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-white mb-2">Pós-Produção & Entrega</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Tratamento de cor, edição profissional e entrega do material em alta resolução direto na sua plataforma.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION (Sem Neon) */}
      <section className="py-24 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/assets/hero-image.JPG" 
            alt="" 
            fill 
            className="object-cover object-center grayscale" 
          />
          <div className="absolute inset-0 bg-[#050505]/80"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          {/* Caixa com borda sutil e fundo escuro focado no contraste, sem brilho verde */}
          <div className="bg-black/80 backdrop-blur-md border border-white/10 p-10 md:p-16 rounded-3xl max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-wide">
              Pronto Para Tirar Seu Projeto <span className="text-m2-green">Do Papel?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Fale diretamente com nossa equipe via WhatsApp. Entendemos sua demanda e montamos um orçamento sob medida de forma rápida.
            </p>
            <Link 
              href="https://wa.me/5512991316774?text=Oi,%20estava%20olhando%20os%20serviços%20no%20site%20e%20quero%20falar%20sobre%20um%20projeto!" 
              target="_blank" 
              rel="noopener noreferrer" 
              // Removido o shadow glow verde e adicionado um shadow comum de profundidade
              className="bg-m2-green text-black font-black uppercase tracking-wider py-4 px-10 rounded-xl text-lg hover:bg-white transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-black focus-visible:ring-m2-green"
            >
              <LucideIcons.MessageCircle className="w-6 h-6" aria-hidden="true" />
              Solicitar Orçamento Agora
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}