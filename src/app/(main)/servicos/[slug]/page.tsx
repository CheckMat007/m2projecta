// src/app/(main)/servicos/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next";
import * as LucideIcons from "lucide-react"; 
import { Service, PortfolioItem } from "@prisma/client";


// FUNÇÃO NOVA: Gera o SEO dinamicamente
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // busca o serviço (podemos usar uma query leve, só os campos necessários)
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
    select: { name: true, shortDescription: true, image: true }
  });

  if (!service) {
    return {
      title: "Serviço não encontrado",
    };
  }

  // Pega as imagens anteriores (do layout pai) para não perder o logo, se quiser
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: service.name, // Vai ficar: "Nome do Serviço | M2 Projecta"
    description: service.shortDescription, // A descrição curta do banco de dados
    keywords: [service.name, "serviços drone", "imagens aéreas", "M2 Projecta"], // Palavras-chave específicas
    openGraph: {
      title: service.name,
      description: service.shortDescription,
      images: [service.image, ...previousImages], // A imagem do serviço aparece no WhatsApp
    },
  };
}

// Definir um tipo composto para o Serviço com Portfólio
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

  // CORREÇÃO 2: Lógica dinâmica para pegar o ícone
  // O nome no banco já está salvo como 'ArrowRight', 'Camera', etc.
  // @ts-expect-error - Acesso dinâmico à biblioteca de ícones
  const IconComponent = LucideIcons[service.icon] || LucideIcons.Building;

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] w-full items-center justify-center py-20 text-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src={service.image} 
            alt={`Imagem de fundo para ${service.name}`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>
        <div className="relative z-20 container mx-auto px-6">
          <IconComponent className="w-16 h-16 text-m2-green mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white">
            {service.name}
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            {service.shortDescription}
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-invert prose-lg max-w-none text-gray-300">
            <p className="whitespace-pre-wrap">
              {service.longDescription}
            </p>
          </div>
          
          {service.videoUrl && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Veja em Ação</h2>
              <div className="aspect-video w-full overflow-hidden rounded-lg shadow-2xl">
                <iframe 
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${service.videoUrl}`}
                  title={`Vídeo sobre ${service.name}`}
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
      </section>

      {/* Projetos Relacionados */}
      {service.portfolioItems && service.portfolioItems.length > 0 && (
        <section className="py-20 bg-m2-dark">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold uppercase text-white">Conheça alguns projetos sobre <span className="text-m2-green">{service.name}</span></h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.portfolioItems.map((item: PortfolioItem) => (
                <Link href={`/portfolio/${item.id}`} key={item.id} className="group block">
                  <div className="relative overflow-hidden rounded-lg aspect-video">
                    <Image 
                      src={item.coverImage} 
                      alt={item.title} 
                      fill
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/70 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div>
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        <p className="text-m2-green">{service.name}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}