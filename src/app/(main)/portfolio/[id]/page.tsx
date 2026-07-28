// src/app/(main)/portfolio/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next"; 
import * as LucideIcons from "lucide-react";

// --- 1. CONFIGURAÇÃO DE SEO DINÂMICO ---
export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const project = await prisma.portfolioItem.findUnique({
    where: { id: params.id },
    select: { 
        title: true, 
        shortDescription: true, 
        seoTitle: true,         
        seoDescription: true,   
        coverImage: true 
    }
  });

  if (!project) {
    return { title: "Projeto não encontrado" };
  }

  const pageTitle = project.seoTitle || `${project.title} | M2 Projecta`;
  const pageDescription = project.seoDescription || project.shortDescription;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [project.title, "portfólio drone", "case de sucesso", "imagens aéreas", "M2 Projecta"],
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: [project.coverImage, ...previousImages],
    },
  };
}

// --- 2. BUSCA DE DADOS ---
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

// --- 3. COMPONENTE DA PÁGINA ---
export default async function PortfolioDetailsPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden bg-[#050505]">
      
      {/* HERO SECTION - Corrigida com pt-28/32 para afastar do Header Fixo */}
      <section className="relative w-full min-h-[45vh] md:min-h-[55vh] flex flex-col justify-center md:justify-end pt-28 md:pt-32 pb-10 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={project.coverImage} 
            alt={`Plano de fundo do projeto: ${project.title}`} 
            fill 
            sizes="100vw"
            className="object-cover object-center opacity-40 md:opacity-60 blur-[2px] md:blur-0"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-black/50 z-10" />
        </div>

        <div className="relative z-20 container mx-auto px-4 md:px-6">
          <Link 
            href="/portfolio" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-m2-green transition-colors font-medium mb-6 md:mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm text-sm md:text-base"
          >
            <LucideIcons.ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Voltar para o Portfólio
          </Link>

          <div className="max-w-4xl border-l-4 border-m2-green pl-4 md:pl-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-wider text-white leading-tight break-words">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL (Sidebar + Detalhes) */}
      <section className="py-10 md:py-20 bg-[#050505]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16">
            
            {/* Coluna Esquerda: Contexto & CTA (Sticky no Desktop) */}
            <div className="lg:col-span-4 space-y-6 md:space-y-8 order-2 lg:order-1">
              <div className="sticky top-28 md:top-32 bg-[#111]/80 backdrop-blur-sm border border-white/5 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl">
                
                <h3 className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Categoria</h3>
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-m2-green/10 rounded-lg flex items-center justify-center shrink-0">
                    <LucideIcons.FolderGit2 className="w-4 h-4 md:w-5 md:h-5 text-m2-green" aria-hidden="true" />
                  </div>
                  <span className="text-base md:text-lg font-bold text-white break-words">
                    {project.service?.name || "Projeto Especial"}
                  </span>
                </div>

                <hr className="border-white/5 mb-6 md:mb-8" />

                <h3 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest mb-3 md:mb-4">Interessado num projeto similar?</h3>
                <Link 
                  href={`https://wa.me/5512991316774?text=Oi,%20vi%20o%20projeto%20"${project.title}"%20no%20portfólio%20e%20gostaria%20de%20falar%20sobre%20uma%20ideia!`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-m2-green text-black font-black uppercase tracking-wider py-3 px-4 md:py-4 md:px-6 rounded-xl hover:bg-white transition-colors duration-300 flex justify-between items-center group shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green focus-visible:ring-offset-2 focus-visible:ring-offset-[#111] text-xs sm:text-sm"
                >
                  Solicitar Orçamento
                  <LucideIcons.ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1 shrink-0 ml-2" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Coluna Direita: O Estudo de Caso */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              
              {/* IMAGEM DE DESTAQUE - Adicionada para visualização limpa */}
              <div className="mb-8 md:mb-12 relative w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-[#0a0a0a] group">
                <Image 
                  src={project.coverImage}
                  alt={`Visualização da imagem do projeto: ${project.title}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>

              {/* Lead / Short Description */}
              <div className="mb-8 md:mb-10">
                <LucideIcons.Quote className="w-8 h-8 md:w-10 md:h-10 text-m2-green mb-3 md:mb-4" aria-hidden="true" />
                <p className="text-lg md:text-2xl text-white font-light leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              {/* Long Description (Prose) */}
              <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:text-gray-400 prose-p:leading-relaxed prose-headings:text-white prose-a:text-m2-green mb-12 md:mb-16">
                <div className="whitespace-pre-wrap">{project.longDescription}</div>
              </div>

              {/* Seção de Vídeo (se existir) */}
              {project.videoUrl && (
                <div className="mt-10 md:mt-16 pt-10 md:pt-16 border-t border-white/5">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8 uppercase tracking-wide flex items-center gap-2 md:gap-3">
                    <LucideIcons.PlayCircle className="text-m2-green w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
                    Registro Visual
                  </h3>
                  
                  <div className="aspect-video w-full overflow-hidden rounded-xl md:rounded-2xl border border-white/10 shadow-2xl bg-[#0a0a0a]">
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${project.videoUrl}`}
                      title={`Vídeo do projeto ${project.title}`}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    
    </div>
  );
}