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
  { id: 1, title: 'Edifício SkyTower', category: 'Marketing Imobiliário' },
  { id: 2, title: 'Festival MusicVibe', category: 'Cobertura de Evento' },
  { id: 3, title: 'Inspeção Industrial', category: 'Acompanhamento de Obra' },
  { id: 4, title: 'Casamento na Praia', category: 'Cobertura de Evento Social' },
  { id: 5, title: 'AgroTech Corp', category: 'Vídeo Corporativo' },
  { id: 6, title: 'Fazenda Verde', category: 'Mapeamento para Agricultura' },
  { id: 7, title: 'Lançamento Residencial', category: 'Marketing Imobiliário' },
  { id: 8, title: 'Concerto ao Ar Livre', category: 'Cobertura de Evento' },
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
              src="https://placehold.co/600x400/111/FFF?text=Imagem+Exemplo" 
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