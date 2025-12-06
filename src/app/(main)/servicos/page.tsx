// src/app/(main)/servicos/page.tsx

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import * as LucideIcons from "lucide-react"; // CORREÇÃO 1: Importar tudo do lucide-react

// This function fetches the data on the server
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
      {/* Title Section */}
      <section className="bg-m2-dark pt-32 pb-16 md:pt-40 md:pb-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white">
            Nossos <span className="text-m2-green">Serviços</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Soluções completas em imagens aéreas para transformar a visão do seu projeto.
          </p>
        </div>
      </section>

      {/* Grid with Dynamic Service Cards */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => {
              // CORREÇÃO 2: Lógica dinâmica para pegar o ícone
              // @ts-expect-error - Acesso dinâmico à biblioteca de ícones
              const IconComponent = LucideIcons[service.icon] || LucideIcons.Building;

              return (
                <Link href={`/servicos/${service.slug}`} key={service.slug} className="group block">
                  <div className="bg-m2-dark p-8 rounded-lg border border-gray-800 h-full transition-all duration-300 group-hover:border-m2-green group-hover:-translate-y-2">
                    <IconComponent className="w-12 h-12 text-m2-green mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-3">{service.name}</h3>
                    <p className="text-gray-400 mb-6">{service.shortDescription}</p>
                    <span className="font-bold text-m2-green group-hover:underline">
                      Saiba Mais &rarr;
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
          {/* Message if there are no services */}
          {services.length === 0 && (
            <p className="text-center text-gray-500">Nenhum serviço cadastrado no momento. Volte em breve!</p>
          )}
        </div>
      </section>

      {/* Call to Action (CTA) Section */}
      <section className="py-20 bg-m2-dark">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white max-w-3xl mx-auto">
            Pronto para Elevar seu Projeto a um Novo Patamar?
          </h2>
          <p className="text-gray-400 mt-4 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como nossas imagens aéreas podem gerar valor para o seu negócio.
          </p>
          <Link 
            href="https://wa.me/5512991316774?text=Oi,%20quero%20falar%20sobre%20um%20projeto!" target="_blank" rel="noopener noreferrer" 
            className="bg-m2-green text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105 inline-block"
          >
            Solicite um Orçamento
          </Link>
        </div>
      </section>
    </>
  );
}