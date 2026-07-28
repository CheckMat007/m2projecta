// src/app/(main)/servicos/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";
import * as LucideIcons from "lucide-react"; 
import { Service, PortfolioItem } from "@prisma/client";

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
    select: { name: true, shortDescription: true, image: true }
  });

  if (!service) {
    return {
      title: "Serviço não encontrado",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${service.name} | M2 Projecta`, 
    description: service.shortDescription, 
    keywords: [service.name, "serviços drone", "imagens aéreas", "M2 Projecta"], 
    openGraph: {
      title: service.name,
      description: service.shortDescription,
      images: [service.image, ...previousImages], 
    },
  };
}

type ServiceWithPortfolio = Service & {
  portfolioItems: PortfolioItem[];
};

export async function generateStaticParams() {
  const services = await prisma.service.findMany({ select: { slug: true } });
  return services.map((service) => ({
    slug: service.slug,
  }));
}

async function getServiceDetails(slug: string): Promise<ServiceWithPortfolio | null> {
  const service = await prisma.service.findUnique({
    where: { slug: slug },
    include: {
      portfolioItems: {
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!service) return null;
  return service;
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getServiceDetails(params.slug);

  if (!service) {
    notFound();
  }

  // @ts-expect-error - Acesso dinâmico à biblioteca de ícones
  const IconComponent = LucideIcons[service.icon] || LucideIcons.Building;

  return (
    <>
      {/* 1. HERO SECTION (Corrigido Padding Mobile) */}
      <section className="relative w-full min-h-[60vh] md:h-[75vh] flex items-center md:items-end pb-16 md:pb-24 bg-[#050505]">
        <div className="absolute inset-0 z-0">
          <Image 
            src={service.image} 
            alt={`Visão aérea ilustrando o serviço de ${service.name}`}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-black/20 z-0"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 pt-24 md:pt-32">
          <Link 
            href="/servicos" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-m2-green transition-colors font-medium mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm"
          >
            <LucideIcons.ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Voltar para todos os serviços
          </Link>

          <div className="max-w-4xl border-l-4 border-m2-green pl-6 md:pl-8">
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider text-white leading-tight">
              {service.name}
            </h1>
            <p className="mt-6 text-base md:text-xl text-gray-300 font-medium max-w-2xl leading-relaxed">
              {service.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* 2. CONTEÚDO PRINCIPAL */}
      <section className="py-20 md:py-32 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-32">
                <div className="w-16 h-16 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <IconComponent className="w-8 h-8 text-m2-green" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-white uppercase mb-4 tracking-wide">
                  Visão Geral
                </h2>
                <p className="text-gray-400 leading-relaxed mb-8">
                  Nossa solução de <strong className="text-white font-medium">{service.name.toLowerCase()}</strong> é estruturada para entregar máxima fidelidade, segurança e impacto visual para o seu projeto.
                </p>
                <Link 
                  href={`https://wa.me/5512991316774?text=Oi,%20gostaria%20de%20saber%20mais%20sobre%20o%20serviço%20de%20${service.name}!`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-[#111] border border-white/10 text-white font-bold py-4 px-6 rounded-xl hover:bg-white hover:text-black transition-colors duration-300 flex justify-between items-center group shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green"
                >
                  Falar com Consultor
                  <LucideIcons.ArrowRight className="w-5 h-5 text-m2-green group-hover:text-black transition-colors" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="prose prose-invert prose-lg max-w-none prose-p:text-gray-300 prose-p:leading-relaxed prose-headings:text-white prose-a:text-m2-green">
                <p className="whitespace-pre-wrap">
                  {service.longDescription}
                </p>
              </div>
              
              {service.videoUrl && (
                <div className="mt-16 pt-16 border-t border-white/5">
                  <h3 className="text-2xl font-bold text-white mb-8 uppercase tracking-wide flex items-center gap-3">
                    <LucideIcons.PlayCircle className="text-m2-green w-6 h-6" aria-hidden="true" />
                    Veja em Ação
                  </h3>
                  <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-[#0a0a0a]">
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${service.videoUrl}`}
                      title={`Vídeo demonstrativo sobre ${service.name}`}
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

      {/* 3. PROJETOS RELACIONADOS */}
      {service.portfolioItems && service.portfolioItems.length > 0 && (
        <section className="py-24 bg-black border-t border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-black uppercase text-white">Casos<span className="text-m2-green">Práticos</span></h2>
                <p className="text-gray-400 mt-2">Veja na prática nossos projetos de {service.name.toLowerCase()}.</p>
              </div>
              
              {/* ATUALIZAÇÃO AQUI: Passando a categoria atual via Query Parameter na URL */}
              <Link 
                href={`/portfolio?categoria=${service.name}`} 
                className="text-m2-green font-bold text-sm uppercase tracking-wider hover:text-white transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-sm"
              >
                Ver todo o portfólio
                <LucideIcons.ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.portfolioItems.map((item: PortfolioItem) => (
                <Link href={`/portfolio/${item.id}`} key={item.id} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green rounded-2xl">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-[#111] border border-white/5 shadow-xl">
                    <Image 
                      src={item.coverImage} 
                      alt={`Capa do projeto ${item.title}`} 
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter md:grayscale md:group-hover:grayscale-0" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-80 md:opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <p className="text-m2-green text-xs font-bold uppercase tracking-wider mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        {service.name}
                      </p>
                      <h3 className="text-2xl font-bold text-white leading-tight">{item.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. CALL TO ACTION FINAL */}
      <section className="py-20 bg-m2-dark border-t border-white/5 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-wide mb-6">
            Vamos planejar seu próximo <span className="text-m2-green">voo?</span>
          </h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            Nossa equipe técnica está pronta para avaliar a viabilidade e estruturar um escopo personalizado para a sua necessidade.
          </p>
          <Link 
            href={`https://wa.me/5512991316774?text=Oi,%20estava%20na%20página%20de%20${service.name}%20e%20quero%20solicitar%20um%20orçamento!`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-m2-green text-black font-black uppercase tracking-wider py-4 px-10 rounded-xl text-lg hover:bg-white transition-all duration-300 inline-flex items-center gap-3 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-m2-dark focus-visible:ring-m2-green"
          >
            <LucideIcons.MessageCircle className="w-6 h-6" aria-hidden="true" />
            Iniciar Atendimento
          </Link>
        </div>
      </section>
    </>
  );
}