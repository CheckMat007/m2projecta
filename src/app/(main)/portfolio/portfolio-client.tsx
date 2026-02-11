// src/app/(main)/portfolio/portfolio-client.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';
import type { PortfolioItem, Service } from '@prisma/client';

const ITEMS_PER_PAGE = 6;

type PortfolioItemWithService = PortfolioItem & {
  service: Service | null;
};

export default function PortfolioClientPage({ initialItems, services }: { 
  initialItems: PortfolioItemWithService[],
  services: { id: string; name: string }[]
}) {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const categories = ['Todos', ...services.map(s => s.name)];

  const filteredItems = activeFilter === 'Todos'
    ? initialItems
    : initialItems.filter(item => item.service?.name === activeFilter);
  
  const visibleItems = filteredItems.slice(0, visibleCount);

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[60vh] md:h-[70vh] flex items-center md:items-end pb-16 md:pb-24 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/hero-image.JPG"
            alt="Vista aérea panorâmica de um projeto da M2 Projecta"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
        </div>
        
        <div className="relative z-20 container mx-auto px-4 md:px-6 pt-32 md:pt-0">
          <div className="max-w-3xl border-l-4 border-m2-green pl-6 md:pl-8">
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight text-white leading-tight">
              Galeria de <span className="text-m2-green">Perspectivas</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl font-medium leading-relaxed">
              Onde a tecnologia encontra a arte. Explore nossos projetos de maior impacto.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FILTROS */}
      <section className="relative z-[30] bg-black border-b border-white/5 py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveFilter(category);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className={`px-5 py-2.5 md:px-8 md:py-3 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 border
                  ${activeFilter === category 
                    ? 'bg-m2-green border-m2-green text-black shadow-lg' 
                    : 'bg-transparent border-white/10 text-gray-400 hover:border-m2-green hover:text-white'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. GRID DE PORTFÓLIO */}
      <section className="py-16 md:py-24 bg-black min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 grid-flow-row-dense"
          >
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item, index) => {
                const isFeatured = index === 0 && activeFilter === 'Todos';

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    // CORREÇÃO: min-w-0 e w-full garantem que o item do grid nunca vaze
                    className={`${isFeatured ? 'md:col-span-2 md:row-span-1' : 'col-span-1'} w-full min-w-0`}
                  >
                    <Link 
                      href={`/portfolio/${item.id}`} 
                      className="group relative block w-full aspect-video md:aspect-auto md:h-full min-h-[320px] overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green"
                    >
                      <Image 
                        src={item.coverImage}
                        alt={item.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110 filter md:grayscale md:group-hover:grayscale-0" 
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* CORREÇÃO: Reduzido padding no mobile para p-5, e w-full com max-w-full para conter o texto */}
                      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8 w-full max-w-full overflow-hidden">
                        <p className="text-m2-green text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-2 truncate w-full">
                          {item.service?.name || 'Projeto Especial'}
                        </p>
                        
                        {/* CORREÇÃO: break-words e line-clamp forçam quebra de linha sem alargar o card */}
                        <h3 className="text-xl md:text-3xl font-black text-white leading-tight mb-4 group-hover:text-m2-green transition-colors break-words line-clamp-3 md:line-clamp-none w-full">
                          {item.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-white text-[10px] md:text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                          Explorar Projeto <ArrowRight size={16} className="text-m2-green flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Load More */}
          {visibleCount < filteredItems.length && (
            <div className="text-center mt-20 md:mt-24">
              <button 
                onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                className="group relative inline-flex items-center gap-3 px-10 py-4 bg-transparent border-2 border-m2-green text-m2-green font-black uppercase tracking-widest rounded-xl hover:bg-m2-green hover:text-black transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              >
                Carregar Mais Projetos
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 flex-shrink-0" />
              </button>
            </div>
          )}

        </div>
      </section>
    </>
  );
}