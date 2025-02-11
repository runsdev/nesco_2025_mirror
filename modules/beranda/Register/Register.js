'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
      <div className="relative flex h-[43dvh] w-full items-center justify-center md:h-[47dvh] lg:h-screen">
        <div className="flex min-h-screen w-full flex-col items-center justify-center">
          <Image
            src="/register/road1.png"
            width={810}
            height={456}
            alt="road"
            className="absolute bottom-[0vw] z-[52] block h-auto w-[100vw] md:hidden"
          />
          <Image
            src="/register/road2.png"
            width={2000}
            height={456}
            alt="road"
            className="absolute bottom-[0vw] z-[52] hidden h-auto w-[100vw] md:block"
          />
          <Image
            src="/register/gedung1.png"
            width={810}
            height={456}
            alt="gedung"
            className="absolute bottom-[1vw] z-[52] block h-auto w-[100vw] md:hidden"
          />
          <Image
            src="/register/gedung2.png"
            width={2000}
            height={456}
            alt="gedung"
            className="absolute bottom-[0vw] z-[52] hidden h-auto w-[100vw] md:block"
          />
          <Image
            src="/register/registerBefore.png"
            width={2000}
            height={456}
            alt="register before"
            className="absolute bottom-[27vw] z-[53] block h-auto w-[30vw] md:hidden"
          />
          <Image
            src="/register/train1.png"
            width={810}
            height={456}
            alt="train"
            className="absolute bottom-[0vw] z-[53] block h-auto w-[90vw] md:hidden"
          />
          <Image
            src="/register/train2.png"
            width={2000}
            height={456}
            alt="train"
            className="absolute bottom-[0vw] z-[53] hidden h-auto w-[100vw] md:block"
          />
        </div>

        <div className="relatif z-[55] flex flex-row justify-start font-kodeMono text-[4vw] font-bold">
          <h4 className="absolute bottom-[12.8vw] left-[24.5vw] aspect-[1/1] w-[7vw] text-center md:bottom-[11vw] md:left-[27.6vw]">
            {days < 10 ? `0${days}` : days}{' '}
          </h4>
          <h4 className="absolute bottom-[12.8vw] left-[39vw] aspect-[1/1] w-[7vw] text-center md:bottom-[11vw] md:left-[40vw]">
            {hours < 10 ? `0${hours}` : hours}
          </h4>
          <h4 className="absolute bottom-[12.8vw] right-[39.4vw] aspect-[1/1] w-[7vw] text-center md:bottom-[11vw] md:right-[40.7vw]">
            {minutes < 10 ? `0${minutes}` : minutes}
          </h4>
          <h4 className="absolute bottom-[12.8vw] right-[24.8vw] aspect-[1/1] w-[7vw] text-center md:bottom-[11vw] md:right-[28.5vw]">
            {seconds < 10 ? `0${seconds}` : seconds}
          </h4>
        </div>
        <div className="relatif z-[55] flex flex-row justify-start font-kodeMono text-[1.6vw] font-bold">
          <p className="absolute bottom-[5.4vw] left-[24.5vw] aspect-[1/1] w-[7vw] text-center md:bottom-[4.8vw] md:left-[27.6vw]">
            Days
          </p>
          <p className="absolute bottom-[5.4vw] left-[39vw] aspect-[1/1] w-[7vw] text-center md:bottom-[4.8vw] md:left-[40vw]">
            Hours
          </p>
          <p className="absolute bottom-[5.4vw] right-[39.4vw] aspect-[1/1] w-[7vw] text-center md:bottom-[4.8vw] md:right-[40.7vw]">
            Minutes
          </p>
          <p className="absolute bottom-[5.4vw] right-[24.8vw] aspect-[1/1] w-[7vw] text-center md:bottom-[4.8vw] md:right-[28.5vw]">
            Seconds
          </p>
        </div>
        <button
          type="button"
          className="absolute bottom-[4.7vw] z-[57] w-[23%] overflow-clip rounded-sm bg-darkyellow py-[0.2vw] font-kodeMono text-[2.05vw] font-[600] text-white duration-300 hover:bg-lightyellow lg:rounded-xl"
        >
          <Link href="/register" className="h-full w-full">
            Register Now
          </Link>
        </button>
      </div>
    </>
  );
};
