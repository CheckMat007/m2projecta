// src/components/PortfolioGallerySlider.tsx
'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type PortfolioGallerySliderProps = {
  images: string[];
  alt: string;
};

export const PortfolioGallerySlider = memo(function PortfolioGallerySlider({ images, alt }: PortfolioGallerySliderProps) {
  if (images.length <= 1) {
    return (
      <div className="relative w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-[#0a0a0a]">
        <Image
          src={images[0]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div className="portfolio-gallery-slider relative">
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        speed={800}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        navigation={{
          nextEl: '.portfolio-gallery-next',
          prevEl: '.portfolio-gallery-prev',
        }}
        pagination={{
          clickable: true,
          el: '.portfolio-gallery-pagination',
          type: 'bullets',
        }}
        className="w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-[#0a0a0a]"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={`${alt} - foto ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-button-custom prev portfolio-gallery-prev">
        <ChevronLeft />
      </div>
      <div className="swiper-button-custom next portfolio-gallery-next">
        <ChevronRight />
      </div>

      <div className="mt-4 flex w-full items-center justify-center">
        <div className="swiper-pagination-capsule portfolio-gallery-pagination"></div>
      </div>
    </div>
  );
});
