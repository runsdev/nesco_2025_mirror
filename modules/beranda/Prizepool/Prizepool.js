import Image from 'next/image';

export const Prizepool = () => {
  return (
    <div className="relative flex w-full items-start justify-center max-lg:min-h-[50dvh] lg:min-h-screen">
      {/* BINTANG, BULAN, METEOR */}
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/prize/bintang.png"
          width={810}
          height={456}
          alt="bintang"
          className="h-auto w-[100vw] md:h-auto md:w-[100vw] lg:h-auto lg:w-[100vw]"
        />

        <Image
          src="/prize/moon.png"
          width={69}
          height={69}
          alt="moon"
          className="mt-[-20vw] h-auto w-[15vw] md:mt-[-40vw] md:h-auto md:w-[12vw] lg:mt-[-40vw] lg:h-auto lg:w-[12vw]"
        />
        <Image
          src="/prize/comets.png"
          width={810}
          height={456}
          alt="comets"
          className="h-auto w-[75vw] md:h-auto md:w-[100vw] lg:h-auto lg:w-[100vw]"
        />
        <Image
          src="/prize/prizepoolAwan.png"
          width={810}
          height={456}
          alt="prizepool"
          className="mt-[-20vw] h-auto w-[75vw] md:mt-[-30vw] md:h-auto md:w-[70vw] lg:mt-[-30vw] lg:h-auto lg:w-[70vw]"
        />
      </div>
    </div>
  );
};
