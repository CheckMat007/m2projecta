// src/app/(main)/servicos/page.tsx

import { Building, Clapperboard, PartyPopper, Hotel, Building2 } from "lucide-react";
import Link from "next/link";

// Array com os dados dos serviços para facilitar a manutenção
const servicesData = [
  {
    icon: Building,
    title: "Mercado Imobiliário",
    description: "Produção de vídeos e fotos aéreas que valorizam empreendimentos, impulsionam vendas e fortalecem seu portfólio imobiliário.",
    slug: "/servicos/mercado-imobiliario", // Link para a futura sub-página
  },
  {
    icon: Clapperboard,
    title: "Vídeos Corporativos",
    description: "Vídeos institucionais com qualidade cinematográfica e destaque de sua marca com imagens aéreas de alto impacto para fortalecer sua comunicação e presença no mercado.",
    slug: "/servicos/videos-corporativos",
  },
  {
    icon: PartyPopper,
    title: "Cobertura de Eventos",
    description: "Cada etapa da evolução da sua obra com imagens que contam sua história.",
    slug: "/servicos/cobertura-de-eventos",
  },
  {
    icon: Hotel,
    title: "Monitoramento de obra",
    description: "Cada etapa da evolução da sua obra com imagens que contam sua história.",
    slug: "/servicos/turismo-e-hotelaria",
  },
  {
    icon: Building2,
    title: "Inspeções e vistorias prediais",
    description: "Imagens aéreas para medições, vistorias e análises estruturais.",
    slug: "/servicos/turismo-e-hotelaria",
  },
];

export default function ServicosPage() {
  return (
    <>
      {/* Seção de Título */}
      <section className="bg-m2-dark pt-32 pb-16 md:pt-40 md:pb-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white">
            Nossos <span className="text-m2-green">Serviços</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Oferecemos soluções completas em imagens aéreas, com foco em qualidade, segurança e inovação. Cada projeto é executado com planejamento rigoroso e em conformidade com as normas legais, garantindo resultados que aliam estética, precisão e confiabilidade.
          </p>
        </div>
      </section>

      {/* Grid com os Cards de Serviços */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {servicesData.map((service) => (
              <Link href={service.slug} key={service.title} className="group block">
                <div className="bg-m2-dark p-8 rounded-lg border border-gray-800 h-full transition-all duration-300 group-hover:border-m2-green group-hover:-translate-y-2">
                  <service.icon className="w-12 h-12 text-m2-green mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400 mb-6">{service.description}</p>
                  <span className="font-bold text-m2-green group-hover:underline">
                    Saiba Mais &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Call to Action (CTA) */}
      <section className="py-20 bg-m2-dark">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white max-w-3xl mx-auto">
            Pronto para elevar seu projeto a um novo patamar?
          </h2>
          <p className="text-gray-400 mt-4 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como nossas imagens aéreas podem gerar valor para o seu negócio.
          </p>
          <Link 
            href="/contato" 
            className="bg-m2-green text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105 inline-block"
          >
            Solicite um Orçamento
          </Link>
        </div>
      </section>
    </>
  );
}