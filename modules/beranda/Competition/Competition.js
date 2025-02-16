'use client';

import React, { useState, useEffect } from 'react';
import { agendaData } from '@/modules/data/data';
import './competition.css';
import City from './city';
import Image from 'next/image';

export const Competition = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    setFade(false);
    setDirection(1);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % agendaData.length);
      setFade(true);
    }, 300);
  };

  const handlePrev = () => {
    setFade(false);
    setDirection(-1);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? agendaData.length - 1 : prevIndex - 1
      );
      setFade(true);
    }, 300);
  };

  useEffect(() => {
    setFade(true);
  }, [currentIndex]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center text-center">
      <h1 className="font-kodeMono text-[50px] font-bold mb-8">Competitions</h1>
      <div className="relative flex w-full flex-col items-center">
        <div className="h-[40vh] md:h-[70vh] w-[95%] lg:w-[70%] flex items-center justify-center">
          <div className="relative flex h-[90%] w-full items-center justify-center rounded-[40px] bg-white shadow-lg">
            {/* Prev Button */}
            <div className="bg-[#003c43] p-1 rounded-full mx-4">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-[#0f776e] text-[#EABB37] text-2xl font-semibold shadow-md hover:bg-[#0f776e]/90 flex items-center justify-center transition-transform duration-200 hover:scale-105"
              >
                &#8249;
              </button>
            </div>

            {/* Content */}
            <div className="h-[99%] w-[80%] lg:w-[72%] rounded-[40px] bg-black px-5 py-5 text-white lg:py-14 overflow-hidden relative">
              <div className={`fade-transition ${fade ? 'fade-in' : 'fade-out'}`}>
                <h2 className="mb-3 font-montserrat text-[4vw] font-[800] text-[#EABB37] gap-x-2 md:text-2xl">
                  <Image
                    src={agendaData[currentIndex].logo}
                    alt={agendaData[currentIndex].title}
                    width={50}
                    height={50}
                    className="inline"
                  />
                  {agendaData[currentIndex].title}
                </h2>
                <p className="text-justify font-montserrat text-[2.5vw] font-[500] text-white md:text-2xl">
                  {agendaData[currentIndex].description}
                </p>
              </div>
              
              {/* City Position */}
              <div className="absolute bottom-0 left-0 right-0 z-0">
                <City direction={direction} />
              </div>
            </div>

            {/* Next Button */}
            <div className="bg-[#003c43] p-1 rounded-full mx-4">
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-[#0f776e] text-[#EABB37] text-2xl font-semibold shadow-md hover:bg-[#0f776e]/90 flex items-center justify-center transition-transform duration-200 hover:scale-105"
              >
                &#8250;
              </button>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-[#0f776e] p-2 rounded-full mt-5">
          <div className="flex items-center justify-center gap-2 bg-[#003c43] p-5 rounded-full">
            {agendaData.map((_, index) => (
              <div
                key={index}
                className={`h-10 w-10 rounded-full cursor-pointer hover:opacity-65 transition-all duration-300 ${
                  currentIndex === index ? 'bg-[#EABB37] scale-110' : 'bg-[#0f776e]'
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
