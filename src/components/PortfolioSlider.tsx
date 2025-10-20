'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, EffectCoverflow } from 'swiper/modules';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const portfolioItems = [
  { id: 1, title: 'Cristo - Taubaté', category: 'Turismo', image: '/assets/portfolio/cristo.JPG', link: '/portfolio/cristo' },
  { id: 2, title: 'Rodovia Pres. Dutra', category: 'Obra em estrada', image: '/assets/portfolio/dutra.JPG', link: '/portfolio/rodovia-dutra' },
  { id: 3, title: 'Obra na Av. Italia', category: 'Acompanhamento de Obra', image: '/assets/portfolio/obra_av_italia.JPG', link: '/portfolio/obra-av-italia' },
  { id: 4, title: 'Obra na Vila S. José', category: 'Acompanhamento de Obra', image: '/assets/portfolio/obra_vila_sao_jose.JPG', link: '/portfolio/obra-vila-sao-jose' },
  { id: 5, title: 'Parque do Quiririm', category: 'Turismo', image: '/assets/portfolio/quiririm.JPG', link: '/portfolio/parque-quiririm' },
  { id: 1, title: 'Cristo - Taubaté', category: 'Turismo', image: '/assets/portfolio/cristo.JPG', link: '/portfolio/cristo-taubate' },
  { id: 2, title: 'Rodovia Pres. Dutra', category: 'Obra em estrada', image: '/assets/portfolio/dutra.JPG', link: '/portfolio/rodovia-dutra' },
  { id: 3, title: 'Obra na Av. Italia', category: 'Acompanhamento de Obra', image: '/assets/portfolio/obra_av_italia.JPG', link: '/portfolio/obra-av-italia' },
  { id: 4, title: 'Obra na Vila S. José', category: 'Acompanhamento de Obra', image: '/assets/portfolio/obra_vila_sao_jose.JPG', link: '/portfolio/obra-vila-sao-jose' },
  { id: 5, title: 'Parque do Quiririm', category: 'Turismo', image: '/assets/portfolio/quiririm.JPG', link: '/portfolio/parque-quiririm' },
];

export const PortfolioSlider = () => {
  return (
    <div className="portfolio-slider-full-width">
      <Swiper
        modules={[Navigation, Pagination, A11y, EffectCoverflow]}
        speed={800}
        effect={'coverflow'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        loop={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        navigation={{
          nextEl: '.portfolio-full-width-next',
          prevEl: '.portfolio-full-width-prev',
        }}
        pagination={{ 
          clickable: true,
          el: '.portfolio-pagination-container',
          type: 'bullets', 
        }}
        className="h-full"
      >
        {portfolioItems.map((item) => (
          <SwiperSlide key={item.id} className="!w-[80%] md:!w-[50%] lg:!w-[40%]">
            {/* MUDANÇA 2: Aspect ratio responsivo */}
            <div className="group relative overflow-hidden rounded-lg aspect-[3/4] md:aspect-video">
              <Image 
                src={item.image} 
                alt={item.title} 
                fill
                sizes="(max-width: 768px) 80vw, 50vw"
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="portfolio-overlay absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <div className="transform transition-transform duration-500 ease-in-out">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-m2-green">{item.category}</p>
                  <Link href={item.link} className="text-white font-semibold mt-2 inline-flex items-center gap-2 hover:underline">
                    Ver Projeto <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="swiper-button-custom prev portfolio-full-width-prev">
          <ChevronLeft />
        </div>
        <div className="swiper-button-custom next portfolio-full-width-next">
          <ChevronRight />
        </div>
      </Swiper>
      
      <div className="mt-8 md:mt-12 flex w-full items-center justify-center">
        <div className="swiper-pagination-capsule portfolio-pagination-container"></div>
      </div>
    </div>
  );
};