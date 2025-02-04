import Image from 'next/image';

export const Prizepool = () => {
  return (
    <div className="relative flex w-full items-start justify-center max-lg:min-h-[60dvh] lg:min-h-screen">
      {/* BINTANG, BULAN, COMET */}
      <div className="absolute flex min-h-screen w-full flex-col items-center justify-center">
        <Image
          src="/prize/moon.png"
          width={69}
          height={69}
          alt="moon"
          className="absolute top-[20vw] h-auto w-[15vw] md:top-[15vw] md:w-[10vw] lg:top-[8vw] lg:w-[9vw]"
        />
        <Image
          src="/prize/comets.png"
          width={810}
          height={456}
          alt="comets"
          className="absolute top-[60vw] h-auto w-[75vw] md:top-[35vw] md:w-[100vw] lg:top-[15vw] lg:w-[90vw]"
        />
        <Image
          src="/prize/prizepoolAwan.png"
          width={810}
          height={456}
          alt="prizepool"
          className="absolute top-[60vw] h-auto w-[80vw] md:top-[30vw] md:w-[80vw] lg:top-[18vw] lg:w-[70vw]"
        />
      </div>
    </div>
  );
};
