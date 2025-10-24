// src/app/(main)/portfolio/portfolio-client.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
// Importa os tipos completos do Prisma
import type { PortfolioItem, Service } from '@prisma/client';

const ITEMS_PER_PAGE = 6;

// Define o tipo para os itens do portfólio que incluem o serviço
type PortfolioItemWithService = PortfolioItem & {
  service: Service | null;
};

export default function PortfolioClientPage({ initialItems, services }: { 
  initialItems: PortfolioItemWithService[],
  services: { id: string; name: string }[]
}) {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Cria a lista de categorias dinamicamente a partir dos serviços
  const categories = ['Todos', ...services.map(s => s.name)];

  // Lógica de filtragem ATUALIZADA
  const filteredItems = activeFilter === 'Todos'
    ? initialItems
    : initialItems.filter(item => item.service?.name === activeFilter);
  
  const visibleItems = filteredItems.slice(0, visibleCount);

  return (
    <>
      <section className="relative flex min-h-[50vh] w-full items-center justify-center py-20 text-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/portfolio/dutra.JPG"
            alt="Vista aérea panorâmica de um projeto da M2 Projecta"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70 z-10"></div>
        </div>
        <div className="relative z-20 container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white">
            Galeria de <span className="text-m2-green">Perspectivas</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Explore uma seleção de trabalhos que demonstram nossa paixão por imagens aéreas e nosso compromisso com a qualidade.
          </p>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex justify-center flex-wrap gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => {
                  setActiveFilter(category);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                variant={activeFilter === category ? 'default' : 'outline'}
                className={ activeFilter === category ? 'bg-m2-green text-black hover:bg-m2-green/80' : 'bg-transparent border-gray-600 hover:bg-gray-800 hover:text-white' }
              >
                {category}
              </Button>
            ))}
          </div>

          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {visibleItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link href={`/portfolio/${item.id}`} className="group block">
                    <div className="relative overflow-hidden rounded-lg">
                      <Image 
                        src={item.coverImage}
                        alt={item.title} 
                        width={600} 
                        height={400} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-black/70 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div>
                          <h3 className="text-xl font-bold text-white">{item.title}</h3>
                          {/* CORREÇÃO AQUI */}
                          <p className="text-m2-green">{item.service?.name || 'Sem categoria'}</p>
                          <span className="mt-2 inline-flex items-center text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Ver Projeto <PlusCircle size={18} className="ml-2" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {visibleCount < filteredItems.length && (
            <div className="text-center mt-12">
              <Button 
                onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                variant="outline"
                className="bg-transparent border-m2-green text-m2-green hover:bg-m2-green hover:text-black transition-colors"
              >
                Carregar Mais Projetos
              </Button>
            </div>
          )}

          <div className="mt-20 text-center border-t border-gray-800 pt-12">
            <h3 className="text-2xl font-bold text-white mb-6">Pronto para dar vida ao seu projeto?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contato" className="bg-m2-green text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-white transition-colors duration-300 transform hover:scale-105">
                Solicite um Orçamento
              </a>
              <a href="/servicos" className="border-2 border-m2-green text-m2-green font-bold py-3 px-8 rounded-lg text-lg hover:bg-m2-green hover:text-black transition-colors duration-300">
                Conheça Nossos Serviços
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}