'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { agendaData } from '@/modules/data/data';

export const Competition = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center text-center text-[50px] font-[700]">
      COMPETITION
      <div className="relative w-[95%] lg:w-[85%]">
        <Swiper
          modules={[Pagination]}
          loop={true}
          pagination={{
            clickable: true,
            renderBullet: function (index, className) {
              return '<span class="' + className + '"></span>';
            },
          }}
          className="h-[400px] w-full rounded-lg"
        >
          {agendaData.map((competition, index) => (
            <SwiperSlide key={index}>
              <div className="relative flex h-full w-full flex-col items-center justify-center">
                <div className="relative flex h-[90%] w-[90%] items-center justify-center rounded-xl bg-white shadow-lg">
                  <div className="h-[85%] w-[90%] rounded-lg bg-black p-5 text-white">
                    <h2 className="mb-3 text-xl font-bold">{competition.title}</h2>
                    <p className="text-sm">{competition.description}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Custom Pagination */}
      </div>
    </div>
  );
};
