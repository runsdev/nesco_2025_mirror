'use client';

import React, { useState, useEffect } from 'react';
import { agendaData } from '@/modules/data/data';
import './competition.css';
import Image from 'next/image';
import { Car } from '@/components/Element';

export const Competition = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [buildingOffset, setBuildingOffset] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % agendaData.length);
      setFade(true);

      setBuildingOffset((prevOffset) => {
        if (prevOffset === -50) {
          // Jika sudah sampai di ujung kanan, reset ke awal dan lanjutkan ke kanan lagi
          setTimeout(() => {
            setBuildingOffset(0);
            setTimeout(() => setTransitionEnabled(true), 50);
          }, 10);
          return -100;
        }
        return prevOffset - 50;
      });
    }, 300);
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? agendaData.length - 1 : prevIndex - 1
      );
      setFade(true);

      setBuildingOffset((prevOffset) => {
        if (prevOffset === 0) {
          // Jika sudah sampai di ujung kiri, reset ke kanan dan lanjutkan ke kiri lagi
          setTimeout(() => {
            setBuildingOffset(-50);
            setTimeout(() => setTransitionEnabled(true), 50);
          }, 10);
          return 50;
        }
        return prevOffset + 50;
      });
    }, 300);
  };

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center text-center z-20">
      <h1 className="font-kodeMono text-[6vw] font-bold mb-8">Competitions</h1>
      <div className="relative flex w-full flex-col items-center">
        <div className="w-full max-w-[97vw] aspect-[3/2] h-auto max-h-[80vh] lg-portrait:h-custom lg:w-[60%] lg:max-h-[65vh] flex items-center justify-center">
          <div className="relative flex w-full h-full items-center justify-center rounded-[40px] bg-white shadow-lg">

            {/* Prev Button */}
            <div className="bg-[#003c43] p-1 rounded-full mx-3 md:mx-4">
              <button
                onClick={handlePrev}
                className="portrait:w-[3vh] portrait:h-[3vh] w-[3vw] h-[3vw] rounded-full bg-[#0f776e] text-[#EABB37] text-2xl font-semibold shadow-md hover:bg-[#0f776e]/90 flex items-center justify-center transition-transform duration-200 hover:scale-105"
              >
                &#8249;
              </button>
            </div>

            {/* Content */}
            <div className="h-[99%] w-[80%] lg:w-[72%] rounded-[40px] bg-black px-5 py-5 text-white lg:py-14 overflow-hidden relative">
              <div className={`fade-transition ${fade ? 'fade-in' : 'fade-out'}`}>
                <h2 className="mb-3 font-montserrat text-[4vw] font-[800] text-[#EABB37] flex items-center justify-center gap-x-2 lg:text-2xl">
                  <Image
                    src={agendaData[currentIndex].logo}
                    alt={agendaData[currentIndex].title}
                    width={1}
                    height={1}
                    className="w-[2em] h-[2em] inline"
                  />
                  {agendaData[currentIndex].title}
                </h2>

                <p className="text-justify font-montserrat text-[2.5vw] font-[500] text-white lg:text-2xl">
                  {agendaData[currentIndex].description}
                </p>
              </div>

              {/* Garis Abu-Abu dari Kiri ke Kanan*/}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[30%] right-[10%] h-[5%] w-[60vw] bg-white/10  rotate-[-59.27deg]"></div>
                <div className="absolute top-[30%] left-[10%] h-[5%] w-[60vw] bg-white/10  rotate-[-59.27deg]"></div>
                <div className="absolute top-[35%] left-[15%] h-[5%] w-[60vw] bg-white/10  rotate-[-59.27deg]"></div>
              </div>

              {/* City Position */}
              <div className="absolute bottom-0 left-0 right-0 h-[40%] z-10 overflow-hidden">
                <div className="relative w-full h-full overflow-hidden">

                  {/* Gedung */}
                  <div
                    className="absolute bottom-[3vh] md:bottom-[5vh] left-0 h-[80px] md:h-[100px] w-[200%] gedung-container"
                    style={{
                      transform: `translateX(${buildingOffset}%)`,
                      transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none',
                    }}
                  >
                    <Image
                      alt="gedung"
                      src="/assets/beranda/Competition/gedung.svg"
                      fill
                      className="object-contain object-bottom"
                    />
                  </div>

                  {/* Jalan */}
                  <div className="absolute bottom-0 left-0 right-0 min-h-[4vh] md:h-[6vh]">
                    <Image
                      alt="jalan"
                      src="/assets/beranda/Competition/jalan.svg"
                      fill
                      className="object-cover object-bottom"
                    />
                  </div>

                  {/* Mobil */}
                  <div className="absolute bottom-[calc(2vh)] md:bottom-[calc(3vh)] left-1/2 -translate-x-1/2 w-[5%] min-w-[80px] md:w-[15%] min-w-[100px] z-20">
                    <Car variant="blue" right={true} className="w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <div className="bg-[#003c43] p-1 rounded-full mx-3 md:mx-4">
              <button
                onClick={handleNext}
                className="portrait:w-[3vh] portrait:h-[3vh] w-[3vw] h-[3vw] rounded-full bg-[#0f776e] text-[#EABB37] text-2xl font-semibold shadow-md hover:bg-[#0f776e]/90 flex items-center justify-center transition-transform duration-200 hover:scale-105"
              >
                &#8250;
              </button>
            </div>

            {/* Lingkaran Abu-Abu */}
            <div className="flex absolute flex-col right-[5vw] top-[5vh] items-center justify-center gap-y-[1vh] ">
              <div className="p-1 bg-black rounded-full">
                <div className="w-[3vw] h-[3vw] md:w-[2vw] md:h-[2vw] min-w-[20px] min-h-[20px] bg-gray-600 rounded-full"></div>
              </div>
              <div className="p-0.5 bg-black rounded-full">
                <div className="w-[2.5vw] h-[2.5vw] md:w-[1.5vw] md:h-[1.5vw] min-w-[18px] min-h-[18px] bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-[#0f776e] p-2 rounded-full mt-5">
          <div className="flex items-center justify-center gap-2 bg-[#003c43] p-5 rounded-full">
            {agendaData.map((_, index) => (
              <div
                key={index}
                className={`h-10 w-10 rounded-full cursor-pointer hover:opacity-65 transition-all duration-300 ${currentIndex === index ? 'bg-[#EABB37] scale-110' : 'bg-[#0f776e]'
                  }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Competition;
