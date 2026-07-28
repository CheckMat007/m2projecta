// src/app/(main)/portfolio/portfolio-client.tsx
'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight } from 'lucide-react';
import type { PortfolioItem, Service } from '@prisma/client';

const ITEMS_PER_PAGE = 6;

type PortfolioItemWithService = PortfolioItem & {
  service: Service | null;
};

// COMPONENTE INTERNO COM A LÓGICA
function PortfolioContent({ initialItems, services }: { 
  initialItems: PortfolioItemWithService[],
  services: { id: string; name: string }[]
}) {
  const searchParams = useSearchParams();
  const categoriaUrl = searchParams.get('categoria');

  // Inicializa com a categoria da URL (se existir), senão 'Todos'
  const [activeFilter, setActiveFilter] = useState(categoriaUrl || 'Todos');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  
  const portfolioRef = useRef<HTMLElement>(null);
  const categories = ['Todos', ...services.map(s => s.name)];

  // Efeito para atualizar o filtro caso o usuário navegue pelos botões da página de serviços 
  // e mude a URL sem recarregar a página inteira
  useEffect(() => {
    if (categoriaUrl && categories.includes(categoriaUrl)) {
      setActiveFilter(categoriaUrl);
      
      // Opcional: fazer o scroll automático direto para a grid quando vier de outra página
      setTimeout(() => {
        if (portfolioRef.current) {
          const offsetTop = portfolioRef.current.offsetTop;
          window.scrollTo({ top: offsetTop - 100, behavior: 'smooth' });
        }
      }, 500); // pequeno delay para garantir a renderização
    }
  }, [categoriaUrl]);

  const filteredItems = activeFilter === 'Todos'
    ? initialItems
    : initialItems.filter(item => item.service?.name === activeFilter);
  
  const visibleItems = filteredItems.slice(0, visibleCount);

  const getCategoryCount = (category: string) => {
    if (category === 'Todos') return initialItems.length;
    return initialItems.filter(item => item.service?.name === category).length;
  };

  const handleFilterClick = (category: string) => {
    setActiveFilter(category);
    setVisibleCount(ITEMS_PER_PAGE);
    
    if (portfolioRef.current) {
      const offsetTop = portfolioRef.current.offsetTop;
      window.scrollTo({
        top: offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[40vh] md:min-h-[50vh] flex items-center md:items-end pb-10 md:pb-16 bg-black overflow-hidden">
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
        
        <div className="relative z-20 container mx-auto px-4 md:px-6 pt-24 md:pt-0">
          <div className="max-w-3xl border-l-4 border-m2-green pl-6 md:pl-8">
            <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              Nosso <span className="text-m2-green">Portfólio</span>
            </h1>
            <p className="mt-4 text-base md:text-xl text-gray-300 max-w-xl font-medium leading-relaxed">
              Conheça alguns dos nossos principais projetos.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FILTROS */}
      <section className="sticky top-40 z-[40] bg-black/95 backdrop-blur-md border-y border-white/5 py-6 shadow-2xl transition-all">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {categories.map((category) => {
              const count = getCategoryCount(category);
              const isActive = activeFilter === category;
              
              if (count === 0) return null;

              return (
                <button
                  key={category}
                  onClick={() => handleFilterClick(category)}
                  className={`flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 border
                    ${isActive 
                      ? 'bg-m2-green border-m2-green text-black shadow-lg scale-105' 
                      : 'bg-transparent border-white/10 text-gray-400 hover:border-m2-green hover:text-white'
                    }`}
                >
                  {category}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. GRID DE PORTFÓLIO */}
      <section ref={portfolioRef} className="py-12 md:py-16 bg-black min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 grid-flow-row-dense"
          >
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item, index) => {
                const isFeatured = index === 0 && activeFilter === 'Todos';

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`${isFeatured ? 'md:col-span-2 md:row-span-1' : 'col-span-1'} w-full min-w-0`}
                  >
                    <Link 
                      href={`/portfolio/${item.id}`} 
                      className="group relative block w-full aspect-video md:aspect-auto md:h-full min-h-[280px] overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green"
                    >
                      <Image 
                        src={item.coverImage}
                        alt={item.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110 filter md:grayscale md:group-hover:grayscale-0" 
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="absolute inset-0 flex flex-col justify-end p-5 w-full max-w-full overflow-hidden">
                        <p className="text-m2-green text-[10px] font-bold uppercase tracking-[0.2em] mb-2 truncate w-full">
                          {item.service?.name || 'Projeto Especial'}
                        </p>
                        
                        <h3 className="text-lg md:text-2xl font-black text-white leading-tight mb-4 group-hover:text-m2-green transition-colors break-words line-clamp-3 md:line-clamp-none w-full">
                          {item.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                          Explorar Projeto <ArrowRight size={14} className="text-m2-green flex-shrink-0" />
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
            <div className="text-center mt-16">
              <button 
                onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                className="group relative inline-flex items-center gap-3 px-8 py-3 bg-transparent border-2 border-m2-green text-m2-green text-sm font-black uppercase tracking-widest rounded-xl hover:bg-m2-green hover:text-black transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m2-green"
              >
                Carregar Mais Projetos
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 flex-shrink-0" />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// COMPONENTE PAI (Necessário para evitar erros de build com useSearchParams)
export default function PortfolioClientPage(props: { 
  initialItems: PortfolioItemWithService[],
  services: { id: string; name: string }[]
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        {/* Aqui você pode colocar um loader se preferir */}
      </div>
    }>
      <PortfolioContent {...props} />
    </Suspense>
  );
}