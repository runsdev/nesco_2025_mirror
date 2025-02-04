'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export const Register = () => {
  const targetDate = new Date('2025-03-01 00:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetDate - now;
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, timeLeft]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <>
      <div className="relative flex min-h-screen w-full items-center justify-center lg:min-h-screen">
        <div className="flex min-h-screen w-full flex-col items-center justify-center">
          <Image
            src="/register/road.png"
            width={810}
            height={456}
            alt="prizepool"
            className="absolute bottom-[0vw] h-auto w-[100vw] md:w-[100vw] lg:w-[100vw]"
          />
          <Image
            src="/register/gedung.png"
            width={810}
            height={456}
            alt="prizepool"
            className="absolute bottom-[0vw] h-auto w-[100vw] md:w-[100vw] lg:w-[100vw]"
          />
          <Image
            src="/register/train.png"
            width={810}
            height={456}
            alt="prizepool"
            className="absolute bottom-[0vw] h-auto w-[100vw] md:w-[100vw] lg:w-[100vw]"
          />
          <Image
            src="/register/registerNow.png"
            width={810}
            height={456}
            alt="prizepool"
            className="absolute bottom-[4.5vw] h-auto w-[20vw] md:w-[20vw] lg:w-[20vw]"
          />
        </div>
        <div className="relatif z-10 flex flex-row items-center justify-start text-[4vw] font-bold">
          <h1 className="absolute bottom-[11.5vw] left-[27.5vw] md:left-[28.4vw] lg:left-[28.4vw]">
            {days < 10 ? `0${days}` : days}
          </h1>
          <h1 className="absolute bottom-[11.5vw] left-[39.5vw] md:left-[40vw] lg:left-[40vw]">
            {hours < 10 ? `0${hours}` : hours}
          </h1>
          <h1 className="absolute bottom-[11.5vw] left-[51.5vw] md:left-[53vw] lg:left-[53vw]">
            {minutes < 10 ? `0${minutes}` : minutes}
          </h1>
          <h1 className="absolute bottom-[11.5vw] left-[64vw] md:left-[64.4vw] lg:left-[64.4vw]">
            {seconds < 10 ? `0${seconds}` : seconds}
          </h1>
        </div>
      </div>
    </>
  );
};
