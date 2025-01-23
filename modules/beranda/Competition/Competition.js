'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { agendaData } from '@/modules/data/data';
import './competition.css';

export const Competition = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center text-center">
      <h1 className="font-kodeMono text-[50px] font-bold">Competitions</h1>
      <div className="relative w-[100%]">
        <Swiper
          modules={[Pagination]}
          loop={true}
          pagination={{
            clickable: true,
            renderBullet: function (index, className) {
              return `
                <span class="${className}">
                </span>
              `;
            },
          }}
          className="h-[80vh] w-[95%] rounded-xl lg:w-[85%]"
        >
          {agendaData.map((competition, index) => (
            <SwiperSlide key={index} className="bg-gradient-to-b from-[#f0d478] to-[#addccf]">
              <div className="relative flex h-[90%] w-full flex-col items-center justify-center">
                <div className="relative flex h-[90%] w-[100%] items-center justify-center rounded-[40px] bg-white shadow-lg">
                  <div className="h-[99%] w-[72%] rounded-[40px] bg-black px-5 py-5 text-white lg:py-14">
                    <h2 className="mb-3 font-montserrat text-2xl font-bold text-[#EABB37] lg:text-2xl">
                      {competition.title}
                    </h2>
                    <p className="text-justify font-montserrat text-sm text-white lg:text-2xl">
                      {competition.description}
                    </p>
                  </div>
                </div>
                <div className=""></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
