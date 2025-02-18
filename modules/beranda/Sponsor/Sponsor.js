import { agendaData } from '@/modules/data/data';
import Image from 'next/image';

export const Sponsor = () => {
  return (
    <div className="relative min-h-screen w-full items-center bg-gradient-to-b from-[#61CCC2] to-[#FFE08D] text-center text-[50px] font-[700]">
      <div className="absolute h-full w-full overflow-x-clip overflow-y-clip">
        {/* Gedung Kiri */}
        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Gedung.png"
          alt="Gedung1"
          width={118}
          height={186}
          className="absolute bottom-[-0.5%] left-[4%] w-[8vw] md:w-[6vw] lg:bottom-[-3.1%] lg:left-[6%]"
        />

        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Gedung.png"
          alt="Gedung2"
          width={118}
          height={186}
          className="absolute bottom-[0.5%] left-[13%] w-[8vw] md:w-[6vw] lg:bottom-[0%]"
        />

        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Gedung.png"
          alt="Gedung3"
          width={118}
          height={186}
          className="absolute bottom-[-1%] left-[22%] w-[8vw] md:w-[6vw] lg:bottom-[-7%] lg:left-[20%]"
        />

        {/* Rumah1 */}
        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Rumah1.png"
          alt="Rumah1"
          width={127.4}
          height={183.69}
          className="absolute bottom-[-1%] left-[39%] w-[9vw] md:w-[6vw] lg:bottom-[-4%] lg:left-[39%]"
        />

        <Image
          data-gsap="right"
          src="/assets/beranda/sponsor/Rumah1.png"
          alt="Rumah2"
          width={182}
          height={262.41}
          className="absolute bottom-[3%] right-[-2%] w-[10vw] md:bottom-[8%] md:w-[8vw] lg:bottom-[11%]"
        />

        {/* Tanah Kiri */}
        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Tanah3.png"
          alt="Tanah1"
          width={1316.5}
          height={456.5}
          className="absolute bottom-[-6.5%] left-[-1%] w-[70vw] md:bottom-[-14%] md:left-[-1.5%] lg:bottom-[-26%] lg:left-[-2%]"
        />

        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Tanah2.png"
          alt="Tanah2"
          width={1316.5}
          height={456.5}
          className="absolute bottom-[-7.5%] left-[-1%] w-[70vw] md:bottom-[-16%] md:left-[-1.5%] md:w-[68vw] lg:bottom-[-30%] lg:left-[-2%]"
        />

        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Tanah1.png"
          alt="Tanah3"
          width={1316.5}
          height={456.5}
          className="absolute bottom-[-8.5%] left-[-1%] w-[70vw] md:bottom-[-18%] md:left-[-1.5%] md:w-[68vw] lg:bottom-[-34%] lg:left-[-2%]"
        />

        {/* Rumah2 */}
        <Image
          data-gsap="right"
          src="/assets/beranda/sponsor/Rumah2.png"
          alt="Rumah3"
          width={229}
          height={152}
          className="absolute bottom-[-2%] right-[20%] w-[16vw] md:bottom-[-3%] md:w-[14vw] lg:bottom-[-5%]"
        />

        {/* Tanah Kanan */}
        <Image
          data-gsap="right"
          src="/assets/beranda/sponsor/Tanah3K.png"
          alt="Tanah Kanan 1"
          width={1369.5}
          height={495}
          className="absolute bottom-[-5%] right-[-43%] w-[80vw] md:bottom-[-8%] md:right-[-37%] md:w-[68vw] lg:bottom-[-15%] lg:right-[-37%]"
        />

        <Image
          data-gsap="right"
          src="/assets/beranda/sponsor/Tanah2K.png"
          alt="Tanah Kanan 2"
          width={1369.5}
          height={495}
          className="absolute bottom-[-7%] right-[-0.8%] w-[38vw] md:bottom-[-10%] md:right-[-0.3%] md:w-[30vw] lg:bottom-[-18%] lg:right-[-1%]"
        />

        <Image
          data-gsap="right"
          src="/assets/beranda/sponsor/Tanah1K.png"
          alt="Tanah Kanan 3"
          width={1369.5}
          height={495}
          className="absolute bottom-[-7%] right-[-43%] w-[73vw] md:bottom-[-13%] md:right-[-40%] md:w-[68vw] lg:bottom-[-23%] lg:right-[-41%]"
        />

        {/* Rumput 2*/}

        <Image
          data-gsap="right"
          src="/assets/beranda/sponsor/Rumput2.png"
          alt="Rumput 2"
          width={467}
          height={151}
          className="absolute bottom-[-2.2%] right-[0%] w-[23vw] md:bottom-[-4%] lg:bottom-[-7%] lg:right-[0%]"
        />
      </div>

      {/* Pohon */}
      <Image
        data-gsap="left"
        src="/assets/beranda/sponsor/Tree.png"
        alt="Tree"
        width={1400}
        height={1197}
        className="absolute bottom-[-2%] left-[-25%] w-[90vw] md:bottom-[-5%] md:w-[69vw] lg:bottom-[-13%] lg:left-[-20%]"
      />

      {/* Rumput 1*/}

      <Image
        data-gsap="left"
        src="/assets/beranda/sponsor/Rumput.png"
        alt="Rumput 1"
        width={467}
        height={151}
        className="absolute bottom-[-1.7%] left-[-1%] w-[23vw] md:bottom-[-4%] md:left-[-1%] lg:bottom-[-7%] lg:left-[-1%]"
      />

      {/* Birds */}

      <Image
        src="/assets/beranda/sponsor/Birds.png"
        alt="Birds"
        width={106}
        height={109}
        className="absolute left-[75%] top-[10%] w-[15vw] md:left-[75%] md:top-[5%] md:w-[10vw]"
      />

      {/* Tulisan dan Gambar */}
      <div className="relative flex h-[400px] w-full items-center justify-center">
        <Image
          data-gsap="up"
          src="/assets/beranda/sponsor/SponsoredBy.png"
          alt="Tulisan"
          width={691}
          height={101}
          className="absolute top-[40%] w-[32vw] md:top-[50%] lg:top-[70%]"
        />

        <Image
          data-gsap="up"
          src="/assets/beranda/sponsor/Kotak.png"
          alt="Kotak"
          width={1535}
          height={275.68}
          className="absolute hidden w-[75vw] md:top-[70%] md:block lg:top-[90%]"
        />

        <Image
          src="/assets/beranda/sponsor/Kotak2.png"
          alt="Kotak"
          width={348}
          height={400}
          className="absolute top-[50%] w-[220px] md:hidden"
        />
      </div>
    </div>
  );
};
