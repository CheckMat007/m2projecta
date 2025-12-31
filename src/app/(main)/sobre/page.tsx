// src/app/(main)/sobre/page.tsx

import Image from "next/image";
import { Award, Target, Eye as VisionIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sobre a M2 PROJECTA',
  description: 'Mais do que imagens, entregamos uma nova perspectiva para o seu negócio.',
};

// Função para buscar TODOS os dados da página "Sobre" de uma vez
async function getAboutPageData() {
  const teamMembers = await prisma.user.findMany({
    where: { showOnAboutPage: true },
    orderBy: { name: 'asc' },
  });

  const pageSettings = await prisma.pageSettings.findUnique({
    where: { pageKey: "ABOUT" },
  });
  
  // Busca o conteúdo principal do banco
  const mainContent = await prisma.aboutPageContent.findFirst();

  return { teamMembers, pageSettings, mainContent };
}


export default async function SobrePage() {
  const { teamMembers, pageSettings, mainContent } = await getAboutPageData();

  // Define valores padrão caso o conteúdo ainda não tenha sido criado no banco
  const heroImage = pageSettings?.heroImageUrl || "/assets/portfolio/dutra.JPG";
  const contentTitle = mainContent?.title || "Título Padrão";
  const contentText = mainContent?.mainText || "Texto padrão... edite no painel do gestor.";
  const contentImage = mainContent?.mainImageUrl || "/assets/about/historia.jpg";

  return (
    <>
      {/* Hero Section DINÂMICA */}
      <section className="relative flex min-h-[50vh] w-full items-center justify-center py-20 text-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroImage} 
            alt="Fundo da página Sobre Nós"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 z-0"></div>
        </div>
        <div className="relative z-20 container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white">
            Nossa <span className="text-m2-green">História</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Mais do que imagens, entregamos uma nova perspectiva para o seu negócio.
          </p>
        </div>
      </section>

       {/* Seção de Conteúdo Principal ATUALIZADA com Duas Colunas */}
      <section 
        className="relative flex items-center justify-center text-center py-24 md:py-32"
        style={{
          backgroundImage: `url(${contentImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay do background principal */}
        <div className="absolute inset-0 bg-gradient-to-t from-m2-dark via-black/40 to-black z-0"></div>

        {/* Container para o conteúdo do CARD (posicionado na frente) */}
        <div className="relative z-10 container mx-auto px-6">
          {/* ESTE É O CARD SEMI-TRANSPARENTE DIVIDIDO EM DUAS COLUNAS */}
          <div className="max-w-5xl mx-auto bg-black/80 backdrop-blur-sm rounded-lg p-0 border border-white/10 overflow-hidden"> {/* PADDING ZERO AQUI */}
            <div className="grid md:grid-cols-2 h-full"> {/* Grid de 2 colunas */}
              
              {/* Coluna da Esquerda: Texto */}
              <div className="flex flex-col justify-center p-8 md:p-12 text-left"> {/* Adicione padding e alinhamento aqui */}
                {/* LÓGICA PARA DIVIDIR O TÍTULO */}
            {(() => {
              const words = contentTitle.split(' ');
              const lastTwoWords = words.slice(-2).join(' ');
              const startWords = words.slice(0, -2).join(' ');

              return (
                <h2 className="text-4xl font-bold text-white mb-6 uppercase">
                  {startWords} <span className="text-m2-green">{lastTwoWords}</span>
                </h2>
              );
            })()}
                <div className="prose prose-invert prose-lg text-gray-300"> {/* Removi mx-auto daqui */}
                  <p className="whitespace-pre-wrap">
                    {contentText}
                  </p>
                </div>
              </div>
              
              {/* Coluna da Direita: Imagem (sem overlay) */}
              <div className="relative h-64 md:h-auto overflow-hidden"> {/* Altura responsiva para a imagem */}
                <Image
                  src={heroImage}
                  alt={`Imagem complementar da seção ${contentTitle}`}
                  fill
                  className="object-cover"
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Seção de Missão, Visão e Valores */}
      <section className="py-20 bg-m2-dark">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <Target className="w-12 h-12 text-m2-green mx-auto" />
              <h3 className="text-2xl font-bold text-white">Nossa Missão</h3>
              <p className="text-gray-400">Elevar o padrão da comunicação visual de nossos clientes com imagens aéreas que informam, encantam e geram resultados mensuráveis.</p>
            </div>
            <div className="space-y-3">
              <VisionIcon className="w-12 h-12 text-m2-green mx-auto" />
              <h3 className="text-2xl font-bold text-white">Nossa Visão</h3>
              <p className="text-gray-400">Ser a referência em produções aéreas no Vale do Paraíba, reconhecida pela inovação, qualidade cinematográfica e excelência no atendimento.</p>
            </div>
            <div className="space-y-3">
              <Award className="w-12 h-12 text-m2-green mx-auto" />
              <h3 className="text-2xl font-bold text-white">Nossos Valores</h3>
              <p className="text-gray-400">Segurança em primeiro lugar, paixão pela inovação, compromisso com a qualidade e parceria genuína com cada cliente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção da Equipe ATUALIZADA com Fundo e Overlay */}
      <section 
        className="relative py-20"
        style={{
          backgroundImage: `url(${contentImage})`, // Certifique-se que a variável 'contentImage' correta está disponível
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed' // Opcional: Efeito parallax
        }}
      >
        {/* NOVO: Overlay com o degradê */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-m2-dark z-0"></div>

        {/* O conteúdo agora é posicionado na frente com 'relative z-10' */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold uppercase text-white">Nossa <span className="text-m2-green">Equipe</span></h2>
          <p className="text-gray-300 mt-2">Pilotos certificados e videomakers experientes prontos para o seu projeto.</p>
          
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="bg-m2-dark p-6 rounded-lg border border-gray-800 text-center transition-all duration-300 hover:border-m2-green hover:-translate-y-2 w-full max-w-sm"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image 
                    src={member.image || '/assets/testimonials/exemplo1.jpg'}
                    alt={`Foto de ${member.name}`} 
                    fill
                    className="rounded-full border-2 border-m2-green object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-m2-green">{member.jobDescription}</p>
                {member.personalQuote && (
                  <p className="text-gray-400 italic mt-2 text-sm">{member.personalQuote}</p>
                )}
              </div>
            ))}
          </div>

          {teamMembers.length === 0 && (
            <p className="mt-12 text-gray-500">Nossa equipe está sendo formada. Volte em breve!</p>
          )}
        </div>
      </section>
    </>
  );
}