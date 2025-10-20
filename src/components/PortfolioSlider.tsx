'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, EffectCoverflow } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// MUDANÇA 1: Definindo os tipos para as props
type PortfolioItem = {
  id: number;
  title: string;
  category: string;
  image: string;
  link: string;
  backgroundImage: string;
};

// MUDANÇA 2: O componente agora recebe props
export const PortfolioSlider = ({ portfolioItems, onActiveIndexChange }: { portfolioItems: PortfolioItem[], onActiveIndexChange: (index: number) => void }) => {
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
        // MUDANÇA 3: Adicionando o callback onSlideChange
        onSlideChange={(swiper) => onActiveIndexChange(swiper.realIndex)}
      >
        {/* MUDANÇA 4: Mapeando sobre a prop `portfolioItems` */}
        {portfolioItems.map((item) => (
          <SwiperSlide key={item.id} className="!w-[80%] md:!w-[50%] lg:!w-[40%]">
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
};