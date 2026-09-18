// src/app/(main)/_components/PortfolioHighlightSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PortfolioSlider } from '@/components/PortfolioSlider';

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
  backgroundImage: string;
};

// Único trecho da home que precisa de estado no cliente: o fundo troca de imagem
// conforme o slide ativo no PortfolioSlider. Isolado aqui para que o resto da home
// (hero, serviços, números, FAQ) permaneça em componentes de servidor estáticos.
export function PortfolioHighlightSection({ portfolioItems }: { portfolioItems: PortfolioItem[] }) {
  const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);
  const portfolioBgImage = portfolioItems[activePortfolioIndex]?.backgroundImage || '/assets/hero-image.JPG';

  return (
    <section id="portfolio-home" className="py-20 relative overflow-hidden min-h-[600px]">
      <div className="absolute inset-0 w-full h-full z-0">
        {portfolioBgImage && (
          <Image
            key={portfolioBgImage}
            src={portfolioBgImage}
            alt=""
            fill
            className="object-cover transition-opacity duration-700 ease-in-out opacity-30"
            sizes="(max-width: 768px) 150vw, 100vw"
            quality={85}
            priority={false}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-m2-dark -z-10" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black z-10" aria-hidden="true" />

      <div className="container mx-auto px-6 text-center relative z-20">
        <h2 className="text-3xl font-bold uppercase text-white">Portfólio em <span className="text-m2-green">Destaque</span></h2>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Explore alguns dos nossos projetos mais recentes.</p>
      </div>

      <div className="mt-12 w-full relative z-20">
        <PortfolioSlider
          portfolioItems={portfolioItems}
          onActiveIndexChange={setActivePortfolioIndex}
        />
      </div>

      <div className="container mx-auto px-6 text-center mt-12 relative z-20">
        <Link href="/portfolio" className="text-m2-green font-bold text-lg group inline-block focus:outline-none focus:ring-2 focus:ring-m2-green focus:ring-offset-4 focus:ring-offset-black rounded">
          <span className="relative text-m2-green group-hover:text-m2-green transition-colors">
            Galeria de projetos →
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </span>
        </Link>
      </div>
    </section>
  );
}
