// src/app/(main)/sobre/page.tsx

import Image from "next/image";
import { Award, Target, Eye as VisionIcon, CheckCircle2, ShieldCheck, Film } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Mais do que imagens, entregamos uma nova perspectiva para o seu negócio.',
  alternates: { canonical: '/sobre' },
};

// --- DATA FETCHING (Mantido intacto) ---
async function getAboutPageData() {
  const teamMembers = await prisma.user.findMany({
    where: { showOnAboutPage: true },
    orderBy: { name: 'asc' },
  });

  const pageSettings = await prisma.pageSettings.findUnique({
    where: { pageKey: "ABOUT" },
  });
  
  const mainContent = await prisma.aboutPageContent.findFirst();

  return { teamMembers, pageSettings, mainContent };
}

export default async function SobrePage() {
  const { teamMembers, pageSettings, mainContent } = await getAboutPageData();

  // Valores padrão
  const heroImage = pageSettings?.heroImageUrl || "/assets/portfolio/dutra.JPG";
  const contentTitle = mainContent?.title || "Nossa História";
  const contentText = mainContent?.mainText || "Texto padrão... edite no painel do gestor.";
  const contentImage = mainContent?.mainImageUrl || "/assets/about/historia.jpg";

  // Lógica segura para dividir o título dinâmico
  const words = contentTitle.split(' ');
  const lastWord = words.length > 1 ? words.pop() : '';
  const startWords = words.join(' ');

  return (
    <>
      {/* 1. HERO SECTION (Estilo Editorial) */}
      <section className="relative w-full h-[60vh] md:h-[75vh] flex items-end pb-16 md:pb-24">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroImage} 
            alt="Bastidores de captação de drone da M2 Projecta"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-0"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-3xl border-l-4 border-m2-green pl-6 md:pl-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider text-white leading-tight">
              A <span className="text-m2-green">Essência</span> <br className="hidden md:block" />
              Por Trás da Lente
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 font-medium max-w-xl">
              Mais do que imagens, entregamos uma nova perspectiva para o seu negócio.
            </p>
          </div>
        </div>
      </section>

      {/* 2. HISTÓRIA (Layout Split-Screen Moderno) */}
      <section className="py-20 md:py-32 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Coluna Texto */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8 uppercase tracking-wide">
                {startWords} <span className="text-m2-green">{lastWord}</span>
              </h2>
              <div className="prose prose-lg prose-invert text-gray-400">
                <p className="whitespace-pre-wrap leading-relaxed text-base md:text-lg">
                  {contentText}
                </p>
              </div>
            </div>
            
            {/* Coluna Imagem - ATUALIZADA: Adicionado max-w-[480px] e altura reduzida para ficar mais sutil */}
            <div className="order-1 lg:order-2 relative w-full max-w-[480px] mx-auto lg:ml-auto h-[350px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-m2-green/10 group">
              <div className="absolute inset-0 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay"></div>
              <Image
                src={contentImage}
                alt="História da M2 Projecta"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 3. MISSÃO, VISÃO E VALORES (Bento Box Design) */}
      <section className="py-20 bg-m2-dark border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card Missão */}
            <div className="bg-[#111] p-10 rounded-2xl border border-white/5 hover:border-m2-green/50 transition-colors duration-300">
              <div className="w-14 h-14 bg-m2-green/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-m2-green" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase">Nossa Missão</h3>
              <p className="text-gray-400 leading-relaxed">
                Elevar o padrão da comunicação visual de nossos clientes com imagens aéreas que informam, encantam e geram resultados mensuráveis.
              </p>
            </div>

            {/* Card Visão */}
            <div className="bg-[#111] p-10 rounded-2xl border border-white/5 hover:border-m2-green/50 transition-colors duration-300 md:-translate-y-4">
              <div className="w-14 h-14 bg-m2-green/10 rounded-xl flex items-center justify-center mb-6">
                <VisionIcon className="w-7 h-7 text-m2-green" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase">Nossa Visão</h3>
              <p className="text-gray-400 leading-relaxed">
                Ser a referência em produções aéreas no Vale do Paraíba, reconhecida pela inovação, qualidade cinematográfica e excelência no atendimento.
              </p>
            </div>

            {/* Card Valores */}
            <div className="bg-[#111] p-10 rounded-2xl border border-white/5 hover:border-m2-green/50 transition-colors duration-300">
              <div className="w-14 h-14 bg-m2-green/10 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-m2-green" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 uppercase">Nossos Valores</h3>
              <p className="text-gray-400 leading-relaxed">
                Segurança em primeiro lugar, paixão pela inovação, compromisso com a qualidade visual e parceria genuína com cada cliente que confia em nós.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEÇÃO ESTÁTICA EXTRA (O Padrão M2) */}
      <section className="py-24 bg-[#050505]">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <h2 className="text-sm font-bold text-m2-green uppercase tracking-[0.2em] mb-3">Nossa Abordagem</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase mb-12">
            O Padrão <span className="text-m2-green">M2 Projecta</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 text-left mt-16">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <ShieldCheck className="w-10 h-10 text-m2-green mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Segurança Regulatória</h4>
              <p className="text-gray-400 text-sm">Operamos dentro de todas as normas da ANAC e DECEA, garantindo voos 100% seguros e legais para o seu projeto.</p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Film className="w-10 h-10 text-m2-green mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Olhar Cinematográfico</h4>
              <p className="text-gray-400 text-sm">Não apenas pilotamos drones; compomos quadros, pensamos em iluminação e entregamos uma colorimetria profissional.</p>
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <CheckCircle2 className="w-10 h-10 text-m2-green mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Entrega Ágil</h4>
              <p className="text-gray-400 text-sm">Entendemos a velocidade do mercado. Nosso fluxo de pós-produção é otimizado para entregar qualidade sem atrasos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EQUIPE (Design Premium de Perfil) */}
      <section className="py-24 bg-m2-dark relative overflow-hidden">
        {/* Elemento de background decorativo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-m2-green/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-4">
              Quem Faz <span className="text-m2-green">Acontecer</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Pilotos certificados e especialistas em captação prontos para elevar o nível do seu projeto.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
  {teamMembers.map((member) => (
    <div 
      key={member.id} 
      className="group relative bg-[#111] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-m2-green/30 hover:-translate-y-2 flex flex-col w-full max-w-[280px] mx-auto shadow-xl"
    >
    
      {/* Container da imagem: Ajustado para preencher toda a largura */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#1a1a1a]">
        <Image 
          src={member.image || '/assets/testimonials/exemplo1.jpg'}
          alt={`Foto de ${member.name}`} 
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          /* 
             Removemos o 'p-2' (padding) para que a foto ocupe 100% da largura.
             Mantenha o 'rounded-t-2xl' se quiser que a foto acompanhe o arredondamento superior do card.
          */
          className="object-contain object-center transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0 rounded-t-2xl"
        />
        {/* Gradiente sutil em cima da foto */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent pointer-events-none"></div>
      </div>
      
      {/* Informações: Mantemos o padding aqui para afastar o texto das bordas */}
      <div className="p-5 md:p-6 relative">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{member.name}</h3>
        <p className="text-m2-green text-sm md:text-base font-medium mb-3 md:mb-4">{member.jobDescription}</p>
        
        {member.personalQuote && (
          <div className="relative mt-2">
            <span className="absolute -top-4 -left-2 text-4xl text-gray-800 font-serif leading-none">&quot;</span>
            <p className="text-gray-400 italic text-xs md:text-sm pl-4 relative z-10 leading-relaxed">
              {member.personalQuote}
            </p>
          </div>
        )}
      </div>
    </div>
  ))}
</div>

          {teamMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg border border-white/10 p-8 rounded-lg inline-block">
                Nossa equipe está sendo formada. Volte em breve!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}