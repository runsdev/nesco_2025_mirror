import { agendaData } from '@/modules/data/data';
import Image from 'next/image';

export const Sponsor = () => {
  return (
    <div className="relative min-h-screen w-full  bg-gradient-to-b from-[#61CCC2] to-[#FFE08D] text-center text-[50px] font-[700]">

      <div className="absolute overflow-x-clip overflow-y-clip w-full h-full">
        <Image
          data-gsap="left"
          src="/assets/beranda/Sponsor/Kiri.png"
          alt="Kiri"
          width={1301}
          height={528}
          className="absolute w-[70vw] bottom-[-8%] md:bottom-[-17%] lg:bottom-[-24%] xl:bottom-[-33%] left-[0%] "
        />

        <Image
          data-gsap="right"
          src="/assets/beranda/Sponsor/Kanan.png"
          alt="Kanan"
          width={623}
          height={612}
          className="absolute w-[35vw] bottom-[-8%] md:bottom-[-17%] lg:bottom-[-24%] xl:bottom-[-30%] right-[0%] "
        />


        <Image
          data-gsap="right"
          src="/assets/beranda/Sponsor/RumputKanan.png"
          alt="RumputKanan"
          width={455}
          height={151}
          className="absolute w-[26vw] bottom-[-2%] md:bottom-[-4%] lg:bottom-[-6%] xl:bottom-[-7%] right-[0%] "
        />

      </div>

      <Image
        data-gsap="left"
        src="/assets/beranda/Sponsor/Tree.png"
        alt="Tree"
        width={1420}
        height={1217}
        className="absolute w-[70vw] bottom-[-3%] md:bottom-[-4%] lg:bottom-[-6%] xl:bottom-[-10%] left-[-19%] "
      />

      <Image
        data-gsap="left"
        src="/assets/beranda/Sponsor/RumputKiri.png"
        alt="RumputKiri"
        width={467}
        height={151}
        className="absolute w-[28vw] bottom-[-2%] md:bottom-[-4%] lg:bottom-[-6%] xl:bottom-[-8%] left-[-2%] "
      />

      <Image
        data-gsap="up"
        src="/assets/beranda/sponsor/Birds.png"
        alt="Birds"
        width={106}
        height={109}
        className="absolute w-[15vw] top-[10%] left-[75%] md:top-[15%] md:left-[80%] md:w-[8vw]"
      />


      <div data-gsap="up" className="relative w-full h-[400px] flex items-center justify-center">


        <h1 className="absolute font-bold text-[6vw] md:text-{5vw] lg:text-[4vw] font-kodeMono translate-y-[-10vw] md:translate-y-[12vw] lg:translate-y-[10vw] xl:translate-y-[1vw]">
          Sponsored By
        </h1>

        <Image
          src="/assets/beranda/Sponsor/Kotak.png"
          alt="Kotak"
          width={1535}
          height={275.68}
          className="absolute hidden md:block md:top-[90%] lg:top-[90%] xl:top-[80%] w-[75vw]"
        />

        <Image
          src="/assets/beranda/Sponsor/Kotak1.png"
          alt="Kotak"
          width={348}
          height={400}
          className="absolute top-[50%] md:hidden w-[220px]"
        />
      </div>


    </div >
  );
};
