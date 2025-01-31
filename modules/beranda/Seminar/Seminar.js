import { agendaData } from '@/modules/data/data';
import Image from 'next/image';

const GunungAwanPohon = () => {
  return (
    <div className="relative">
      <Image
        src="/seminar/trees kiri.png"
        alt="Tress kiri"
        width={1649}
        height={1917}
        className="absolute z-[10] mt-[-65%] w-[40%] md:mt-[-60%]"
      />
      <Image
        src="/seminar/trees kanan.png"
        alt="Tress kanan"
        width={1649}
        height={1917}
        className="absolute right-0 z-[10] mt-[-65%] w-[40%] md:mt-[-60%]"
      />
      <Image
        src="/seminar/Gunung.png"
        alt="Gunung"
        width={2250}
        height={430}
        className="relative z-[99]"
      />
      <Image
        src="/seminar/Awan.png"
        alt="Awan"
        width={2034}
        height={115}
        className="relative z-[99] mt-[-8%]"
      />
    </div>
  );
};

export const Seminar = () => {
  const seminarData = agendaData.find((data) => data.title === 'Seminar');
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
      <div className="w-[48%]">
        <div className="pb-[5%] text-center font-kodeMono text-[6vw] font-bold md:gap-[4vw] md:text-[5vw]">
          {seminarData.title}
        </div>
        <div className="pb-[5%] text-justify font-montserrat text-[2vw] text-[black] md:text-balance md:text-[1.5vw]">
          {seminarData.description}
        </div>
      </div>
      <GunungAwanPohon />
    </div>
  );
};
