'use client';

import React, { useState } from 'react';
import { agendaData } from '@/modules/data/data';
import './competition.css';
import Image from 'next/image';
import { Car } from '@/components/Element';
import { cn } from '@/lib/utils';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';

const GrayLine = ({ className }) => {
  return (
    <div
      className={cn(
        'absolute top-[30%] h-[5%] w-[80vw] rotate-[-59.27deg] bg-white/10 lg:w-[60vw]',
        className,
      )}
    />
  );
};

const Gedung = ({ className, flip = false }) => {
  return (
    <div
      className={cn(
        'animasi-gedung absolute bottom-[12%] left-0 h-[80px] w-[100%] sm:bottom-[10%] md:bottom-[16%] md:h-[100px] lg:bottom-[18%]',
        className,
      )}
    >
      <Image
        alt="gedung"
        src="/assets/beranda/Competition/Union.svg"
        fill
        className={cn('object-contain object-bottom', flip && 'scale-x-[-1]')}
      />
    </div>
  );
};

const Jalan = ({ className }) => {
  return (
    <div
      className={cn(
        'animasi-gedung absolute bottom-[-10%] left-0 right-0 aspect-[480/35] w-full sm:bottom-[-5%]',
        className,
      )}
    >
      <Image
        alt="jalan"
        src="/assets/beranda/Competition/jalan.svg"
        fill
        className="object-cover object-bottom"
      />
    </div>
  );
};

export const Competition = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const lombaData = agendaData.filter((item) => item.slug !== 'seminar');

  const handleChange = (index) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, 300);
  };

  const handleNext = () => handleChange((prevIndex) => (prevIndex + 1) % lombaData.length);
  const handlePrev = () =>
    handleChange((prevIndex) => (prevIndex === 0 ? lombaData.length - 1 : prevIndex - 1));
  const handleClick = (index) => handleChange(index);

  return (
    <section className="z-20 flex min-h-[60vh] w-full flex-col items-center justify-center text-center">
      <h1 className="mb-8 mt-7 font-kodeMono text-[6vw] font-bold md:text-[5vw]">Competitions</h1>
      <div className="relative flex w-full flex-col items-center">
        <div className="lg-portrait:h-custom flex aspect-[5/4] h-auto max-h-[80vh] w-full max-w-[95vw] items-center justify-center md:aspect-[3/2] lg:max-h-[65vh] lg:w-[60%]">
          <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-white py-4 shadow-lg md:rounded-2xl md:py-5 xl:rounded-[35px]">
            {/* Prev Button */}
            <div className="mx-3 rounded-full bg-[#003c43] p-1 max-md:hidden md:mx-4">
              <button
                type="button"
                onClick={handlePrev}
                className="flex h-[3vw] w-[3vw] items-center justify-center rounded-full bg-[#0f776e] text-2xl font-semibold text-[#EABB37] shadow-md transition-transform duration-300 hover:scale-105 hover:bg-[#0f776e]/90 portrait:h-[4vh] portrait:w-[4vh]"
              >
                <GoChevronLeft className="h-3 w-3 md:h-4 md:w-4 lg:h-6 lg:w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="relative h-full w-[93%] overflow-hidden rounded-xl bg-black px-5 py-5 text-white md:w-[80%] md:rounded-2xl lg:w-[80%] lg:px-6 lg:py-14 xl:rounded-[35px]">
              <div className={`fade-transition ${fade ? 'fade-in' : 'fade-out'}`}>
                <h2 className="mb-3 flex items-center justify-center gap-x-2 font-montserrat text-[4vw] font-[800] text-[#EABB37] lg:text-2xl xl:text-3xl">
                  <Image
                    src={lombaData[currentIndex].logo}
                    alt={lombaData[currentIndex].title}
                    width={1}
                    height={1}
                    className="inline w-[2em] xl:w-[2.7em]"
                  />
                  {lombaData[currentIndex].title}
                </h2>

                <p className="text-justify font-montserrat text-[3vw] font-[500] text-white md:text-[2.5vw] lg:text-[16px] lg:leading-snug xl:text-[25px]">
                  {lombaData[currentIndex].description}
                </p>
              </div>

              {/* Garis Abu-Abu dari Kiri ke Kanan*/}
              <div className="animasi-lampu pointer-events-none absolute left-0 top-0 h-full w-full">
                <GrayLine className="left-[-45%]" />
                <GrayLine className="left-[10%]" />
                <GrayLine className="left-[15%]" />
                <GrayLine className="left-[55%]" />
                <GrayLine className="left-[110%]" />
                <GrayLine className="left-[115%]" />
              </div>

              {/* City Position */}
              <div className="absolute bottom-0 left-0 right-0 z-10 h-[40%] overflow-hidden">
                <div className="relative h-full w-full overflow-hidden">
                  <Gedung className="left-0" />
                  <Gedung className="left-[100%]" flip />
                  <Gedung className="left-[200%]" />

                  {/* Jalan */}
                  <Jalan />
                  <Jalan className="left-[100%]" />
                  <Jalan className="left-[200%]" />

                  {/* Mobil */}
                  <div className="absolute bottom-[4%] left-1/2 z-20 w-[18%] -translate-x-1/2 md:bottom-[5%] md:w-[15%]">
                    <Car variant="blue" right={true} className="w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="mx-3 rounded-full bg-[#003c43] p-1 max-md:hidden md:mx-4">
              <button
                type="button"
                onClick={handleNext}
                className="flex h-[3vw] w-[3vw] items-center justify-center rounded-full bg-[#0f776e] text-2xl font-semibold text-[#EABB37] shadow-md transition-transform duration-300 hover:scale-105 hover:bg-[#0f776e]/90 lg:text-4xl portrait:h-[4vh] portrait:w-[4vh]"
              >
                <GoChevronRight className="h-3 w-3 md:h-4 md:w-4 lg:h-6 lg:w-6" />
              </button>
            </div>

            {/* Lingkaran Abu-Abu */}
            <div className="absolute right-[4%] top-[5vh] flex flex-col items-center justify-center gap-y-[1vh] max-md:hidden">
              <div className="rounded-full bg-black p-1">
                <div className="h-[3vw] min-h-[20px] w-[3vw] min-w-[20px] rounded-full bg-gray-600 md:h-[2vw] md:w-[2vw]"></div>
              </div>
              <div className="rounded-full bg-black p-0.5">
                <div className="h-[2.5vw] min-h-[18px] w-[2.5vw] min-w-[18px] rounded-full bg-gray-600 md:h-[1.5vw] md:w-[1.5vw]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-5 rounded-full bg-[#0f776e] p-[6px] max-md:hidden xl:p-2">
          <div className="flex items-center justify-center gap-2 rounded-full bg-[#003c43] p-2 xl:p-3">
            {lombaData.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`h-7 w-7 cursor-pointer rounded-full transition-all duration-300 hover:opacity-65 lg:h-8 lg:w-8 xl:h-10 xl:w-10 ${
                  currentIndex === index ? 'scale-110 bg-[#EABB37]' : 'bg-[#0f776e]'
                }`}
                onClick={() => handleClick(index)}
              />
            ))}
          </div>
        </div>
        {/* Button buat mobile */}
        <div className="mt-5 flex w-full justify-around md:hidden">
          {/* Prev Button */}
          <div className="mx-3 rounded-full bg-[#003c43] p-1 md:mx-4">
            <button
              type="button"
              onClick={handlePrev}
              className="flex h-[4vw] w-[4vw] items-center justify-center rounded-full bg-[#0f776e] text-2xl font-semibold text-[#EABB37] shadow-md transition-transform duration-300 hover:scale-105 hover:bg-[#0f776e]/90 lg:text-4xl portrait:h-[4.5vh] portrait:w-[4.5vh]"
            >
              <GoChevronLeft className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6" />
            </button>
          </div>
          {/* Next Button */}
          <div className="mx-3 rounded-full bg-[#003c43] p-1 md:mx-4">
            <button
              type="button"
              onClick={handleNext}
              className="flex h-[4vw] w-[4vw] items-center justify-center rounded-full bg-[#0f776e] text-2xl font-semibold text-[#EABB37] shadow-md transition-transform duration-300 hover:scale-105 hover:bg-[#0f776e]/90 lg:text-4xl portrait:h-[4.5vh] portrait:w-[4.5vh]"
            >
              <GoChevronRight className="h-4 w-4 md:h-4 md:w-4 lg:h-6 lg:w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Competition;
