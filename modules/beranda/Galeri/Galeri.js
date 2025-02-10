import Image from 'next/image';
import GaleriDesktop from './GaleriDesktop';
import GaleriMobile from './GaleriMob';
import { Sun } from '@/components/Element/index';

export const Galeri = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-[6vw] overflow-x-clip p-0 text-center font-kodeMono font-[700] md:p-[4vw] xl:gap-[4vw]">
      <Sun
        rotate
        shadow
        className="absolute left-[-8%] top-[0%] w-[20vw] sm:top-[-5%] md:top-[-4%] xl:top-0"
      />

      {/* AWAN */}
      <Image
        src={'/assets/beranda/Galeri/Union.png'}
        alt="awan1"
        width={1000}
        height={1000}
        className="float-horizontal-3 absolute right-[-20%] top-[-10%] h-auto w-[70%] blur-xl filter md:right-0 md:top-[-5%] md:blur-none lg:right-[-30%]"
      />
      <Image
        src={'/assets/beranda/Galeri/Union.png'}
        alt="awan2"
        width={1000}
        height={1000}
        className="float-horizontal-2 absolute left-[-40%] top-[50%] h-auto w-[85%] blur-lg filter md:top-[25%] md:blur-none lg:left-[-30%] lg:w-[75%]"
      />
      <Image
        src={'/assets/beranda/Galeri/Union.png'}
        alt="awan3"
        width={1000}
        height={1000}
        className="float-horizontal-1 absolute right-[-30%] top-[70%] hidden h-auto w-[40%] w-[80%] md:block"
      />

      <h1 className="z-20 text-[6vw] font-bold xl:text-[5vw]">Gallery</h1>

      <GaleriDesktop className="z-30 hidden md:block" />

      <GaleriMobile className="z-30 md:hidden" />
    </div>
  );
};
