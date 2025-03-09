'use client';
import { cn } from '@/lib/utils';
import { dataPrizepool } from '@/modules/data/prizepool';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

const Hadiah = ({ kategori, juara1, juara2, juara3 }) => {
  return (
    <div className="relative overflow-clip rounded-xl border-4 border-[#0F776E] bg-gradient-to-b from-[#FFE08D] to-[#EABB37] font-montserrat font-[600] lg:rounded-3xl lg:border-8">
      <div className="absolute left-0 top-0 z-20 -mt-1 rounded-br-[60vw] bg-[#0F776E] px-3 py-2 pr-4 text-[2.5vw] text-lightyellow md:px-6 md:py-4 md:pr-8 md:text-[2vw] lg:px-5 lg:py-3 lg:pr-10 lg:text-2xl xl:py-4 xl:text-4xl">
        Kategori {kategori}
      </div>
      <div className="relative z-20 mb-4 mt-[10vw] grid w-full grid-cols-3 place-items-center gap-y-2 text-[4vw] lg:mt-[5.5vw] lg:text-4xl xl:text-5xl">
        {['Juara 1', 'Juara 2', 'Juara 3'].map((juara, index) => (
          <h3
            key={index}
            className="w-full text-center !font-montserrat font-[700] drop-shadow-offset-lg"
          >
            {juara}
          </h3>
        ))}

        <Image
          src="/prizepoolCompt/kotak.png"
          width={60}
          height={60}
          alt="prizepool"
          className="md:w-[15vw]"
        />
        <Image
          src="/prizepoolCompt/kotak.png"
          width={60}
          height={60}
          alt="prizepool"
          className="md:w-[15vw]"
        />
        <Image
          src="/prizepoolCompt/kotak.png"
          width={60}
          height={60}
          alt="prizepool"
          className="md:w-[15vw]"
        />
        {[juara1, juara2, juara3].map((juara, index) => (
          <p
            key={index}
            className="w-full whitespace-pre pb-2 text-center text-[2.3vw] drop-shadow-offset-lg sm:text-[2vw] md:text-lg xl:text-3xl"
          >
            {juara}
          </p>
        ))}
      </div>
    </div>
  );
};

export function Prizepool({ className, slug }) {
  const kategoriHadiah = dataPrizepool[slug];
  const paginationRef = useRef(null);

  return (
    <div
      className={cn(
        'z-[10] flex h-[35svh] w-full flex-col items-center justify-center text-5xl md:h-[50svh] lg:h-[105vh] lg:pt-[2vw] xl:pt-[10vw] 2xl:h-[120vh]',
        className, // Jangan dihapus yang line ini
      )}
    >
      <div
        // data-aos="zoom-in-up"
        className="relative z-[12] flex w-full flex-col items-center justify-start font-montserrat"
      >
        <Image
          src="/prizepoolCompt/judul.png"
          width={250}
          height={50}
          alt="prizepool"
          className="relative h-auto w-[42vw] md:w-[30vw] xl:mt-[3vw]"
        />

        <div className="relative flex w-full flex-col">
          <Swiper
            modules={[Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true, el: paginationRef.current }}
            className="relative mt-[2vw] h-[50vw] w-[80vw] overflow-visible md:h-[42vw] lg:h-[38vw] xl:h-[34vw] 2xl:h-[32vw]"
          >
            {kategoriHadiah.map((item, index) => (
              <SwiperSlide key={index}>
                <Hadiah
                  kategori={item.kategori}
                  juara1={item.juara1}
                  juara2={item.juara2}
                  juara3={item.juara3}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="flex w-full">
        <div
          ref={paginationRef}
          className="relative z-[12] flex justify-center gap-1 [&>span]:h-[1vw] [&>span]:w-[5vw] [&>span]:rounded-md [&>span]:bg-[#0F776E]"
        />
      </div>
    </div>
  );
}
