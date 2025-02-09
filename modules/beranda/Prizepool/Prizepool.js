import Image from 'next/image';

export const Prizepool = () => {
  return (
    <div className="relative flex min-h-[50dvh] w-full items-start justify-center md:min-h-[57dvh] lg:min-h-screen">
      {/* BINTANG, BULAN, COMET */}
      <div className="absolute flex min-h-screen w-full flex-col items-center justify-center">
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
          className="absolute top-[60vw] z-[50] h-auto w-[75vw] sm:top-[45vw] sm:w-[75vw] md:top-[20vw] md:w-[90vw] lg:top-[18vw] lg:w-[90vw] xl:top-[25vw] xl:w-[90vw] 2xl:top-[25vw] 2xl:w-[90vw]"
        />
        <Image
          src="/prize/prizepoolAwan.png"
          width={810}
          height={456}
          alt="prizepool"
          className="absolute top-[50vw] z-[50] h-auto w-[80vw] sm:top-[45vw] sm:w-[75vw] md:top-[25vw] md:w-[80vw] lg:top-[18vw] lg:w-[70vw] xl:top-[18vw] xl:w-[70vw] 2xl:top-[20vw] 2xl:w-[80vw]"
        />
      </div>
    </div>
  );
};
