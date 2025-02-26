import { agendaData } from '@/modules/data/data';
import Image from 'next/image';

export const Sponsor = () => {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#61CCC2] to-[#FFE08D] text-center text-[50px] font-[700]">
      <div className="absolute h-full w-full overflow-x-clip overflow-y-clip">
        <Image
          data-gsap="right"
          src="/assets/beranda/sponsor/Kiri.webp"
          alt="Kiri"
          width={1301}
          height={528}
          className="absolute bottom-[-14vw] left-[0%] w-[70vw] md:bottom-[-15vw] lg:bottom-[-20%] xl:bottom-[-22%] 2xl:bottom-[-33%]"
        />

        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Kanan.webp"
          alt="Kanan"
          width={623}
          height={612}
          className="absolute bottom-[-14vw] right-[0%] w-[35vw] md:bottom-[-15vw] lg:bottom-[-20%] xl:bottom-[-22%] 2xl:bottom-[-30%]"
        />

        <Image
          // data-gsap="left"
          src="/assets/beranda/sponsor/RumputKanan.webp"
          alt="RumputKanan"
          width={455}
          height={151}
          className="absolute bottom-[-2%] right-[0%] w-[26vw] md:bottom-[-7%] lg:bottom-[-6%] xl:bottom-[-7%]"
        />
      </div>

      {/* Pohon */}
      <Image
        data-gsap="right"
        src="/assets/beranda/sponsor/Tree.webp"
        alt="Tree"
        width={1420}
        height={1217}
        className="absolute bottom-[-1%] left-[-19%] w-[70vw] sm:bottom-[-3%] md:bottom-[-3%] lg:bottom-[-6%] xl:bottom-[-8%] 2xl:bottom-[-10%]"
      />

      <Image
        // data-gsap="right"
        src="/assets/beranda/sponsor/RumputKiri.webp"
        alt="RumputKiri"
        width={467}
        height={151}
        className="absolute bottom-[-2%] left-[-2%] w-[28vw] md:bottom-[-6%] lg:bottom-[-6%] xl:bottom-[-8%]"
      />

      <Image
        data-gsap="up"
        src="/assets/beranda/sponsor/Birds.png"
        alt="Birds"
        width={106}
        height={109}
        className="absolute left-[75%] top-[10%] w-[15vw] md:left-[80%] md:top-[15%] md:w-[8vw]"
      />

      <div data-gsap="up" className="relative flex h-[400px] w-full items-center justify-center">
        <h1 className="md:text-{5vw] absolute translate-y-[-10vw] font-kodeMono text-[6vw] font-bold md:translate-y-[12vw] lg:translate-y-[10vw] lg:text-[4vw] xl:translate-y-[1vw]">
          Sponsored By
        </h1>

        <Image
          src="/assets/beranda/sponsor/Kotak.png"
          alt="Kotak"
          width={1535}
          height={275.68}
          className="absolute hidden w-[75vw] md:top-[90%] md:block lg:top-[90%] xl:top-[80%]"
        />

        <Image
          src="/assets/beranda/sponsor/Kotak1.webp"
          alt="Kotak"
          width={348}
          height={400}
          className="absolute top-[50%] w-[220px] md:hidden"
        />
      </div>
    </div>
  );
};
