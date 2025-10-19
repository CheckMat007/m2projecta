// src/app/(main)/blog/page.tsx

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Dados fictícios para os artigos do blog
const mockBlogPosts = [
  {
    id: '1',
    title: 'Como a filmagem com drone pode acelerar a venda de um imóvel',
    category: 'Mercado Imobiliário',
    excerpt: 'Descubra como imagens aéreas de alta qualidade podem destacar os melhores ângulos do seu imóvel, atrair mais compradores e fechar negócios mais rápido.',
    image: 'https://placehold.co/800x500/111/FFF?text=Blog+Imobiliário',
    slug: '/blog/como-acelerar-venda-imovel-com-drone',
  },
  {
    id: '2',
    title: 'Guia completo: O que saber antes de contratar imagens aéreas',
    category: 'Dicas',
    excerpt: 'De licenças da ANAC a tipos de equipamento, este guia completo responde às suas principais dúvidas para garantir uma contratação segura e um resultado espetacular.',
    image: 'https://placehold.co/800x500/222/FFF?text=Guia+Drone',
    slug: '/blog/guia-contratar-imagens-aereas',
  },
  {
    id: '3',
    title: 'Os bastidores de um vídeo corporativo aéreo de sucesso',
    category: 'Estudo de Caso',
    excerpt: 'Acompanhe o processo de criação de um vídeo aéreo para a TechCorp, desde o briefing inicial até a pós-produção e o impacto gerado.',
    image: 'https://placehold.co/800x500/333/FFF?text=Bastidores',
    slug: '/blog/bastidores-video-corporativo',
  },
  {
    id: '4',
    title: '5 tendências de filmagem de casamentos com drones para 2026',
    category: 'Eventos',
    excerpt: 'De planos cinematográficos a entradas triunfais, veja como a tecnologia de drones está a revolucionar a forma como registamos um dos dias mais importantes da vida.',
    image: 'https://placehold.co/800x500/444/FFF?text=Casamentos',
    slug: '/blog/tendencias-casamento-drone',
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Secção de Título */}
      <section className="bg-m2-dark pt-32 pb-16 md:pt-40 md:pb-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white">
            Nosso <span className="text-m2-green">Blog</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Dicas, tendências e os bastidores do mundo das imagens aéreas.
          </p>
        </div>
      </section>

      {/* Grelha com os Artigos do Blog */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {mockBlogPosts.map((post) => (
              <Link href={post.slug} key={post.id} className="group block">
                <div className="bg-m2-dark rounded-lg overflow-hidden border border-gray-800 h-full flex flex-col">
                  <div className="relative">
                    <Image
                      src={post.image}
                      alt={`Imagem de destaque para o artigo ${post.title}`}
                      width={800}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-m2-green font-semibold text-sm mb-2">{post.category}</p>
                    <h3 className="text-2xl font-bold text-white mb-3 flex-1">{post.title}</h3>
                    <p className="text-gray-400 mb-6">{post.excerpt}</p>
                    <span className="font-bold text-white group-hover:text-m2-green transition-colors mt-auto flex items-center">
                      Ler Artigo <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}