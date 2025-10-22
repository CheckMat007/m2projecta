// src/app/(main)/portfolio/[id]/page.tsx

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Esta função de SEO (pré-renderização) continua a mesma
export async function generateStaticParams() {
  const items = await prisma.portfolioItem.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true },
  });

  return items.map((item) => ({
    id: item.id,
  }));
}

// Esta função de busca de dados continua a mesma
async function getProjectDetails(id: string) {
  const project = await prisma.portfolioItem.findUnique({
    where: { 
      id: id,
      status: 'PUBLISHED'
    },
  });

  if (!project) {
    notFound();
  }
  return project;
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProjectDetails(params.id);

  // --- LÓGICA PARA DIVIDIR O TÍTULO ---
  const titleWords = project.title.split(' ');
  // pop() remove e retorna o último item do array
  const lastWord = titleWords.pop(); 
  // join() junta o que sobrou
  const titleStart = titleWords.join(' '); 
  // --- FIM DA LÓGICA ---

  return (
    <>
      {/* Seção 1: O "Hero" Cinematográfico do Projeto */}
      <section className="relative flex min-h-[50vh] w-full items-center justify-center py-20 text-center">
        
        {/* Imagem de Fundo (coverImage do projeto) */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={project.coverImage} 
            alt={`Fundo do projeto ${project.title}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>
        
        {/* Conteúdo de Texto (sobre o fundo) */}
        <div className="relative z-20 container mx-auto px-6">
          <div className="mb-4">
            <span className="inline-block rounded-full bg-m2-green/20 px-4 py-1 text-sm font-semibold text-m2-green uppercase tracking-wider">
              {project.category}
            </span>
          </div>
          
          {/* TÍTULO ATUALIZADO COM A ÚLTIMA PALAVRA EM VERDE */}
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white">
            {titleStart} <span className="text-m2-green">{lastWord}</span>
          </h1>

          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            {project.shortDescription}
          </p>
        </div>
      </section>

      {/* Seção 2: O Foco Principal (Conteúdo) */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Coluna da Esquerda (Maior) - O Vídeo */}
            <div className="md:col-span-2">
              {project.videoUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-lg shadow-2xl">
                  <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${project.videoUrl}`}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
                
              ) : (
                <Image
                  src={project.coverImage}
                  alt={`Imagem de capa do projeto ${project.title}`}
                  width={1200}
                  height={675}
                  className="rounded-lg shadow-lg w-full h-auto object-cover"
                />
              )}
            </div>

            {/* Coluna da Direita (Menor) - O Contexto */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold text-white mb-4">Sobre o Projeto</h3>
              <div className="prose prose-invert text-gray-300">
                <p className="whitespace-pre-wrap">
                  {project.longDescription}
                </p>
              </div>
              <div className="mt-8">
                <Link href="/portfolio" className="text-m2-green font-bold hover:underline text-lg">
                  &larr; Voltar para todos os projetos
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}