'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Testimonial = {
  quote: { start: string; highlight: string; end: string };
  name: string;
  company: string;
  image: string;
  backgroundImage: string;
};

export const TestimonialsSlider = ({ testimonials, onActiveIndexChange }: { testimonials: Testimonial[], onActiveIndexChange: (index: number) => void }) => {
  return (
    <div className="relative slider-container-padded">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        speed={800}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          nextEl: '.testimonials-next',
          prevEl: '.testimonials-prev',
        }}
        pagination={{ 
          clickable: true,
          el: '.testimonials-pagination-container',
          type: 'bullets', 
          
        }}
        className="h-full !overflow-visible"
        onSlideChange={(swiper) => onActiveIndexChange(swiper.realIndex)}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index} className="h-full pb-4"> 
            <div className="relative mt-10">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
                <Image 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  width={80} 
                  height={80} 
                  className="rounded-full object-cover border-4 border-m2-dark"
                />
              </div>
              <Card className="bg-m2-dark border-gray-800 text-white h-full flex flex-col pt-16">
                <CardContent className="p-6 flex-1 flex flex-col text-center">
                  <Quote className="w-8 h-8 text-m2-green mb-4 mx-auto" />
                  <p className="text-gray-300 italic text-lg mb-6 flex-1">
                    &quot{testimonial.quote.start}
                    <span className="text-m2-green font-semibold not-italic">{testimonial.quote.highlight}</span>
                    {testimonial.quote.end}"
                  </p>
                  <div className="mt-auto pt-4">
                    <p className="font-bold text-xl">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <div className="swiper-button-custom prev testimonials-prev">
        <ChevronLeft />
      </div>
      <div className="swiper-button-custom next testimonials-next">
        <ChevronRight />
      </div>

      <div className="mt-8 md:mt-12 flex w-full items-center justify-center">
        <div className="swiper-pagination-capsule testimonials-pagination-container"></div>
      </div>
    </div>
  );
};