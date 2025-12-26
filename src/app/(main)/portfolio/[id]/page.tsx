// src/app/(main)/portfolio/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next"; 

// --- 1. CONFIGURAÇÃO DE SEO DINÂMICO ---
export async function generateMetadata(
  { params }: { params: { id: string } },

): Promise<Metadata> {
  // Buscamos apenas os campos necessários para SEO
  const project = await prisma.portfolioItem.findUnique({
    where: { id: params.id },
    select: { 
        title: true, 
        shortDescription: true, // Usamos shortDescription pois 'description' genérico não existe
        seoTitle: true,         // Campo específico de SEO que vi no seu erro
        seoDescription: true,   // Campo específico de SEO que vi no seu erro
        coverImage: true 
        // location: true       <-- REMOVIDO (Não existe no banco)
    }
  });

  if (!project) {
    return { title: "Projeto não encontrado" };
  }

  // Lógica inteligente: Se tiver título de SEO usa ele, senão usa o título normal
  const pageTitle = project.seoTitle || project.title;
  // Se tiver descrição de SEO usa ela, senão usa a descrição curta
  const pageDescription = project.seoDescription || project.shortDescription;

  return {
    title: pageTitle,
    description: pageDescription,
    // Removemos location das keywords
    keywords: [project.title, "portfólio drone", "case de sucesso", "imagens aéreas", "M2 Projecta"],
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: [project.coverImage],
    },
  };
}

// --- 2. COMPONENTE DA PÁGINA ---
async function getProject(id: string) {
  const project = await prisma.portfolioItem.findUnique({
    where: { id },
    include: {
      service: true, 
    },
  });

  if (!project) {
    notFound();
  }
  return project;
}

export default async function PortfolioDetailsPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);

  return (
    <>
       {/* Hero do Projeto */}
       <div className="relative h-[60vh] w-full">
          <Image 
            src={project.coverImage} 
            alt={project.title} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 container mx-auto">
                <Link href="/portfolio" className="text-m2-green mb-4 inline-block hover:underline">
                    &larr; Voltar para o Portfólio
                </Link>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{project.title}</h1>
                {project.service && (
                    <span className="bg-m2-green text-black px-3 py-1 rounded-full text-sm font-bold">
                        {project.service.name}
                    </span>
                )}
          </div>
       </div>

       <div className="bg-black py-16 text-white">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Descrição Curta (Destaque) */}
                <p className="text-xl md:text-2xl text-gray-300 font-light mb-12 border-l-4 border-m2-green pl-6">
                    {project.shortDescription}
                </p>

                {/* Descrição Longa (Conteúdo) */}
                <div className="prose prose-invert prose-lg max-w-none mb-12">
                    <div className="whitespace-pre-wrap">{project.longDescription}</div>
                </div>

                {/* Vídeo (Se houver) */}
                {project.videoUrl && (
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Registro Visual</h3>
                        <div className="aspect-video w-full overflow-hidden rounded-lg shadow-2xl bg-gray-900">
                             <iframe 
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${project.videoUrl}`}
                                title={`Vídeo do projeto ${project.title}`}
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
       </div>
    </>
  );
}