'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { agendaData } from '@/modules/data/data';
import './competition.css';
import greyRectangle from './icon/greyRectangle';

export const Competition = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center text-center">
      <h1 className="font-kodeMono text-[50px] font-bold">Competitions</h1>
      <div className="relative flex w-[100%] flex-col items-center">
        <Swiper
          modules={[Pagination]}
          loop={true}
          pagination={{
            clickable: true,
            renderBullet: function (index, className) {
              return `<span class="${className}"></span>`;
            },
          }}
          className="swiper-container h-[40vh] w-[95%] rounded-xl md:h-[80vh] lg:w-[70%]"
        >
          {agendaData.map((competition, index) => (
            <SwiperSlide key={index} className="transparent">
              <div className="relative flex h-[90%] w-full flex-col items-center justify-center">
                <div className="relative flex h-[90%] w-[100%] items-center justify-center rounded-[40px] bg-white shadow-lg">
                  <div className="h-[99%] w-[80%] rounded-[40px] bg-black px-5 py-5 text-white lg:w-[72%] lg:py-14">
                    <h2 className="mb-3 font-montserrat text-xl font-[800] text-[#EABB37] md:text-2xl">
                      {competition.title}
                    </h2>
                    <p className="text-justify font-montserrat text-sm font-[500] text-white md:text-2xl">
                      {competition.description}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination"></div>
      </div>
    </div>
  );
};
