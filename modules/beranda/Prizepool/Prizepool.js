'use client';

import { CountUp, DecryptedText } from '@/components/Animation/index';
import Image from 'next/image';

export const Prizepool = () => {
  return (
    <div className="relative flex h-[50svh] w-full items-start justify-center lg:h-[80svh]">
      {/* BINTANG, BULAN, COMET */}
      <div className="absolute flex h-full w-full flex-col items-center justify-center">
        <Image
          src="/prize/moon.png"
          width={69}
          height={69}
          alt="moon"
          className="absolute top-[20vw] z-[50] h-auto w-[15vw] sm:top-[20vw] sm:w-[15vw] md:top-[10vw] md:w-[13vw] lg:top-[5vw] lg:w-[9vw] xl:w-[9vw] 2xl:w-[9vw]"
        />
        <Image
          src="/prize/comets.png"
          width={810}
          height={456}
          alt="comets"
          className="absolute top-[60%] z-[50] h-auto w-[75vw] sm:top-[45vw] sm:w-[75vw] md:top-[20vw] md:w-[90vw] lg:top-[18vw] lg:w-[90vw] xl:top-[25vw] xl:w-[90vw] 2xl:top-[25vw] 2xl:w-[90vw]"
        />
        <div
          data-aos="zoom-in"
          data-aos-duration="1000"
          className="absolute top-[68%] z-[51] aspect-[1304.7/384.54] w-[80%] md:top-[65%] md:w-[80%] lg:top-[64%] lg:w-[68%]"
        >
          <Image
            src="/prize/prizepoolAwan.png"
            alt="prizepool"
            sizes="50vw"
            className="absolute bottom-0 left-0 right-0 top-0 aspect-[1304.7/384.54] w-full"
            fill
          />
          <div className="absolute right-[12.5%] aspect-[355.5/329] w-[27.2%] font-kodeMono font-[700] text-lightyellow">
            <h2 className="leading-0 absolute top-[-35.2%] aspect-[355.4/236] w-full text-[19.6vw] lg:text-[16.5vw]">
              <CountUp from={0} to={30} duration={2.3} startWhen={true} />
            </h2>
            <h5 className="absolute bottom-[-10%] left-[4%] text-[5.2vw] lg:text-[4.35vw]">
              <DecryptedText
                text="Million"
                animateOn="view"
                speed={60}
                maxIterations={40}
                revealDirection={'start'}
              />
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};
