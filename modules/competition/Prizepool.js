'use client';
import { cn } from '@/lib/utils';
import { dataPrizepool } from '@/modules/data/prizepool';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';

const Hadiah = ({ kategori, juara1, juara2, juara3 }) => {
  return (
    <div className="rounded-2xl border-4 border-[#0F776E] lg:border-8">
      <div
        className="absolute left-[2] z-20 mt-[-1vw] rounded-br-[90vw] rounded-tl-[50vw] bg-[#0F776E] px-5 py-2 font-montserrat text-[2.5vw] lg:rounded-tl-[35vw]"
        style={{ color: '#EABB37' }}
      >
        Kategori {kategori}
      </div>
      <div className="relative z-20 mt-[10vw] grid w-full grid-cols-3 place-items-center gap-y-2 text-[4vw] lg:mt-[5vw]">
        <p className="w-full text-center">Juara 1</p>
        <p className="w-full text-center">Juara 2</p>
        <p className="w-full text-center">Juara 3</p>
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
        <p className="w-full pb-2 text-center text-[3vw] md:text-[2vw]">{juara1}</p>
        <p className="w-full pb-2 text-center text-[3vw] md:text-[2vw]">{juara2}</p>
        <p className="w-full pb-2 text-center text-[3vw] md:text-[2vw]">{juara3}</p>
      </div>
    </div>
  );
};

export function Prizepool({ className, slug }) {
  const kategoriHadiah = dataPrizepool[slug];

  return (
    <div
      className={cn(
        'z-[12] flex h-[50dvh] w-full items-center justify-center text-5xl lg:h-screen',
        className, // Jangan dihapus yang line ini
      )}
    >
      <div
        data-aos="zoom-in-up"
        className="flex min-h-screen w-full flex-col items-center justify-center"
      >
        <Image
          src="/prizepoolCompt/judul.png"
          width={250}
          height={50}
          alt="prizepool"
          className="relative h-auto w-[40vw] md:w-[30vw]"
        />
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          pagination={{ clickable: true, el: '.custom-pagination' }}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
          className="mt-[2vw] h-[48vw] w-[80vw] md:h-[38vw] lg:h-[31vw]"
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
        <div className="custom-pagination flex justify-center gap-1 [&>span]:h-[1vw] [&>span]:w-[5vw] [&>span]:rounded-md [&>span]:bg-[#0F776E]"></div>
      </div>
    </div>
  );
}
