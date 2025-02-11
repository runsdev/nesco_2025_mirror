import { agendaData } from '@/modules/data/data';
import Image from 'next/image';

const GunungAwanPohon = () => {
  return (
    <div className="relative w-full">
      <div className="relative overflow-x-clip">
        <Image
          src="/seminar/trees kiri.png"
          alt="Tress kiri"
          width={1649}
          height={1917}
          className="absolute z-[10] ml-[-6%] mt-[-68%] w-[40%] scale-[155%] md:ml-[-6%] md:mt-[-55%] md:scale-105"
        />
        <Image
          src="/seminar/trees kanan.png"
          alt="Tress kanan"
          width={1649}
          height={1917}
          className="absolute right-0 z-[10] mr-[-6%] mt-[-68%] w-[40%] scale-[155%] md:mr-[-6%] md:mt-[-55%] md:scale-105"
        />
      </div>

      <Image
        src="/seminar/Gunung.png"
        alt="Gunung"
        width={2250}
        height={430}
        className="relative z-[99] mt-[2%] w-full md:mt-[4%]"
      />
      <Image
        src="/seminar/Awan.png"
        alt="Awan"
        width={2034}
        height={115}
        className="relative z-[99] mt-[-8%] w-full"
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
        <div className="pb-[5%] text-justify font-montserrat text-[2.5vw] text-[black] md:text-balance md:text-[1.5vw]">
          {seminarData.description}
        </div>
      </div>
      <GunungAwanPohon className="mt-[-5%]" />
    </div>
  );
};
