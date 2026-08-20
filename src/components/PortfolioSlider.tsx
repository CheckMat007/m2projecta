'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, EffectCoverflow } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
  backgroundImage: string;
};

export const PortfolioSlider = memo(function PortfolioSlider({ portfolioItems, onActiveIndexChange }: { portfolioItems: PortfolioItem[], onActiveIndexChange: (index: number) => void }) {
  return (
    <div className="portfolio-slider-full-width">
      <Swiper
        modules={[Navigation, Pagination, A11y, EffectCoverflow]}
        speed={800}
        spaceBetween={0}
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
        slidesPerGroupSkip={1}
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
        // CORREÇÃO CRÍTICA:
        // 'onRealIndexChange' funciona perfeitamente com loop={true}.
        // Ele dispara assim que o slide ativo muda logicamente, garantindo que o fundo atualize.
        onRealIndexChange={(swiper) => onActiveIndexChange(swiper.realIndex)}
        // Em modo loop, o Swiper às vezes não sincroniza a classe 'swiper-slide-active'
        // (da qual o link "Ver Projeto" depende para ficar visível/clicável) no slide
        // central logo após montar — só corrige sozinho após a primeira navegação.
        // Forçar um update logo após a inicialização resolve isso sem esperar o clique na seta.
        onSwiper={(swiper) => {
          requestAnimationFrame(() => {
            swiper.update();
            swiper.slideToLoop(swiper.realIndex, 0, false);
          });
        }}
      >
        {portfolioItems.map((item) => (
          <SwiperSlide key={item.id} className="!w-[80%] md:!w-[50%] lg:!w-[40%]">
            <div className="group relative overflow-hidden rounded-lg aspect-[3/4] md:aspect-video">
              <Image 
                src={item.image} 
                alt={item.title} 
                fill
                // Tamanhos ajustados para garantir qualidade nos cards
                sizes="(max-width: 768px) 80vw, 50vw"
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="portfolio-overlay absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <div className="transform transition-transform duration-500 ease-in-out">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-m2-green">{item.category}</p>
                  <Link href={item.link} className="text-white mt-2 inline-flex items-center gap-2">
                    <span className="relative text-white group-hover:text-m2-green transition-colors">
                      Ver Projeto &rarr;
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-m2-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </span>
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
});