import Image from 'next/image';

export const Prizepool = () => {
  return (
    <div className="relative flex w-full items-start justify-center max-lg:min-h-[50dvh] lg:min-h-screen">
      {/* BINTANG, BULAN, COMET */}
      <div className="absolute flex h-full w-full flex-col items-center justify-center">
        <Image
          src="/prize/moon.png"
          width={69}
          height={69}
          alt="moon"
          className="absolute mt-[-20vw] h-auto w-[15vw] md:mt-[-50vw] md:h-auto md:w-[10vw] lg:mt-[-50vw] lg:h-auto lg:w-[9vw]"
        />
        <Image
          src="/prize/comets.png"
          width={810}
          height={456}
          alt="comets"
          className="absolute h-auto w-[75vw] md:h-auto md:w-[100vw] lg:h-auto lg:w-[100vw]"
        />
        <Image
          src="/prize/prizepoolAwan.png"
          width={810}
          height={456}
          alt="prizepool"
          className="absolute bottom-[20vw] h-auto w-[80vw] md:bottom-[42vw] md:h-auto md:w-[70vw] lg:bottom-[42vw] lg:h-auto lg:w-[70vw]"
        />
      </div>
    </div>
  );
};
