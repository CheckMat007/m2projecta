// src/components/PortfolioSlider.tsx

'use client';

import React from 'react';
import Image from 'next/image';

// Importações essenciais da Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

// Importação dos estilos da Swiper (MUITO IMPORTANTE)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Array com os dados do portfólio para facilitar a manutenção
const portfolioItems = [
  { id: 1, title: 'Cristo - Taubaté', category: 'Turismo', image: '/assets/portfolio/cristo.jpg' },
  { id: 2, title: 'Rodovia Pres. Dutra', category: 'Obra em estrada', image: '/assets/portfolio/dutra.jpg' },
  { id: 3, title: 'Obra na Av. Italia', category: 'Acompanhamento de Obra', image: '/assets/portfolio/obra_av_italia.jpg' },
  { id: 4, title: 'Obra na Vila S. José', category: 'Acompanhamento de Obra', image: '/assets/portfolio/obra_vila_sao_jose.jpg' },
  { id: 5, title: 'Parque do Quiririm', category: 'Turismo', image: '/assets/portfolio/quiririm.jpg' },
  { id: 6, title: 'Passarela em São Paulo', category: 'Acompanhamento de Obra', image: '/assets/portfolio/passarela.jpg' },
  { id: 7, title: 'Obra em Ubatuba', category: 'Acompanhamento de Obra', image: '/assets/portfolio/ubatuba.jpg' },
  { id: 8, title: 'Via Vale Garden Shopping', category: 'Voo noturno', image: '/assets/portfolio/via_vale.jpg' },
];

export const PortfolioSlider = () => {
  return (
    <Swiper
      // Módulos que vamos usar
      modules={[Navigation, Pagination, A11y]}
      // Espaço entre os slides
      spaceBetween={30}
      // Quantidade de slides visíveis
      slidesPerView={1}
      // Configuração de breakpoints para responsividade
      breakpoints={{
        // Quando a tela for >= 768px (tablets)
        768: {
          slidesPerView: 2,
        },
        // Quando a tela for >= 1024px (desktops)
        1024: {
          slidesPerView: 3,
        },
      }}
      // Habilita os botões de navegação (setas)
      navigation
      // Habilita a paginação (bolinhas) e torna-as clicáveis
      pagination={{ clickable: true }}
      className="w-full"
    >
      {portfolioItems.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="group relative overflow-hidden rounded-lg">
            <Image 
              src={item.image} 
              alt={item.title} 
              width={600} 
              height={400} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-black/70 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-m2-green">{item.category}</p>
              </div>
            </div>
          </div>
        </SwiperSlide> // <-- ERRO CORRIGIDO AQUI!
      ))}
    </Swiper>
  );
};