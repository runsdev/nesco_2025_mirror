'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export const Register = () => {
  const targetDate = new Date('2025-03-01 08:00:00').getTime();
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
            src="/register/road1.png"
            width={810}
            height={456}
            alt="road"
            className="absolute bottom-[0vw] block h-auto w-[100vw] md:hidden"
          />
          <Image
            src="/register/road2.png"
            width={810}
            height={456}
            alt="road"
            className="absolute bottom-[0vw] hidden h-auto w-[100vw] md:block"
          />
          <Image
            src="/register/gedung1.png"
            width={810}
            height={456}
            alt="gedung"
            className="absolute bottom-[1vw] block h-auto w-[100vw] md:hidden"
          />
          <Image
            src="/register/gedung2.png"
            width={810}
            height={456}
            alt="gedung"
            className="absolute bottom-[0vw] hidden h-auto w-[100vw] md:block"
          />
          <Image
            src="/register/registerBefore.png"
            width={810}
            height={456}
            alt="register before"
            className="absolute bottom-[27vw] z-10 block h-auto w-[30vw] md:hidden"
          />
          <Image
            src="/register/train1.png"
            width={810}
            height={456}
            alt="train"
            className="absolute bottom-[0vw] block h-auto w-[90vw] md:hidden"
          />
          <Image
            src="/register/train2.png"
            width={810}
            height={456}
            alt="train"
            className="absolute bottom-[0vw] hidden h-auto w-[100vw] md:block"
          />
        </div>

        <div className="absolute flex min-h-screen w-full items-center justify-center">
          <Image
            src="/register/button.png"
            width={810}
            height={456}
            alt="button"
            className="absolute bottom-[4.5vw] h-auto w-[23vw]"
          />
        </div>

        <div className="relatif z-10 flex flex-row justify-start text-[4vw] font-bold">
          <h1 className="absolute bottom-[12.8vw] left-[24.5vw] aspect-[1/1] w-[7vw] text-center md:bottom-[11vw] md:left-[27.6vw] lg:left-[27.3vw] xl:left-[27.5vw]">
            {days < 10 ? `0${days}` : days}{' '}
          </h1>
          <h1 className="absolute bottom-[12.8vw] left-[39vw] aspect-[1/1] w-[7vw] text-center md:bottom-[11vw] md:left-[39.5vw] lg:left-[39.3vw] xl:left-[39.5vw]">
            {hours < 10 ? `0${hours}` : hours}
          </h1>
          <h1 className="absolute bottom-[12.8vw] right-[39.4vw] aspect-[1/1] w-[7vw] text-center md:bottom-[11vw] md:right-[40.5vw] lg:right-[40.5vw] xl:right-[40vw]">
            {minutes < 10 ? `0${minutes}` : minutes}
          </h1>
          <h1 className="absolute bottom-[12.8vw] right-[24.8vw] aspect-[1/1] w-[7vw] text-center md:bottom-[11vw] md:right-[28.3vw] lg:right-[28.3vw] xl:right-[28vw]">
            {seconds < 10 ? `0${seconds}` : seconds}
          </h1>
        </div>
      </div>
    </>
  );
};
