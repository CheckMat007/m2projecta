// src/app/(main)/portfolio/page.tsx
'use client'; // Usaremos 'useState' para o filtro, então precisa ser um Componente Cliente

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { allPortfolioItems, categories } from '@/data/portfolio';
// Dados fictícios para a galeria completa do portfólio

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('Todos');

  // Lógica de filtragem (ainda com dados fictícios)
  const filteredItems = activeFilter === 'Todos'
    ? allPortfolioItems
    : allPortfolioItems.filter(item => item.category === activeFilter);

  return (
    <>
      {/* Seção de Título */}
      <section className="bg-m2-dark pt-32 pb-16 md:pt-40 md:pb-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white">
            Nossos <span className="text-m2-green">Projetos</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Explore uma seleção de trabalhos que demonstram nossa paixão por imagens aéreas e nosso compromisso com a qualidade.
          </p>
        </div>
      </section>

      {/* Seção da Galeria e Filtros */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          {/* Botões de Filtro */}
          <div className="flex justify-center flex-wrap gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveFilter(category)}
                variant={activeFilter === category ? 'default' : 'outline'}
                className={
                  activeFilter === category
                    ? 'bg-m2-green text-black hover:bg-m2-green/80'
                    : 'bg-transparent border-gray-600 hover:bg-gray-800 hover:text-white'
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Grid de Projetos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Link href={`/portfolio/${item.id}`} key={item.id} className="group block">
                <div className="relative overflow-hidden rounded-lg">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    width={600} 
                    height={400} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/70 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <p className="text-m2-green">{item.category}</p>
                    </div>
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