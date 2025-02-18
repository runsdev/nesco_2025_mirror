import { agendaData } from '@/modules/data/data';
import Image from 'next/image';

export const Sponsor = () => {

  return (

    <div className="relative min-h-screen w-full items-center bg-gradient-to-b from-[#61CCC2] to-[#FFE08D] text-center text-[50px] font-[700]">
      <div className="absolute overflow-x-clip overflow-y-clip w-full h-full">
        {/* Gedung Kiri */}
        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Gedung.png"
          alt="Gedung1"
          width={118}
          height={186}
          className="absolute w-[8vw] bottom-[-0.5%] left-[4%] md:w-[6vw] lg:bottom-[-3.1%] lg:left-[6%] "
        />

        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Gedung.png"
          alt="Gedung2"
          width={118}
          height={186}
          className="absolute w-[8vw] bottom-[0.5%] left-[13%] md:w-[6vw] lg:bottom-[0%]"
        />

        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Gedung.png"
          alt="Gedung3"
          width={118}
          height={186}
          className="absolute w-[8vw] md:w-[6vw] bottom-[-1%] left-[22%] lg:bottom-[-7%] lg:left-[20%]"
        />

        {/* Rumah1 */}
        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Rumah1.png"
          alt="Rumah1"
          width={127.4}
          height={183.69}
          className="absolute w-[9vw] bottom-[-1%] left-[39%] md:w-[6vw] lg:bottom-[-4%] lg:left-[39%]"
        />

        <Image
          data-gsap="right"
          src="/assets/beranda/sponsor/Rumah1.png"
          alt="Rumah2"
          width={182}
          height={262.41}
          className="absolute w-[10vw] bottom-[3%] right-[-2%] md:w-[8vw] md:bottom-[8%] lg:bottom-[11%]"
        />

        {/* Tanah Kiri */}
        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Tanah3.png"
          alt="Tanah1"
          width={1316.5}
          height={456.5}
          className="absolute w-[70vw] bottom-[-6.5%] left-[-1%] md:bottom-[-14%] md:left-[-1.5%] lg:bottom-[-26%] lg:left-[-2%]"
        />

        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Tanah2.png"
          alt="Tanah2"
          width={1316.5}
          height={456.5}
          className="absolute w-[70vw] bottom-[-7.5%] left-[-1%] md:w-[68vw] md:bottom-[-16%] md:left-[-1.5%] lg:bottom-[-30%] lg:left-[-2%]"
        />

        <Image
          data-gsap="left"
          src="/assets/beranda/sponsor/Tanah1.png"
          alt="Tanah3"
          width={1316.5}
          height={456.5}
          className="absolute w-[70vw] bottom-[-8.5%] left-[-1%] md:w-[68vw] md:bottom-[-18%] md:left-[-1.5%] lg:bottom-[-34%] lg:left-[-2%]"
        />

        {/* Rumah2 */}
        <Image
          data-gsap="right"
          src="/assets/beranda/sponsor/Rumah2.png"
          alt="Rumah3"
          width={229}
          height={152}
          className="absolute w-[16vw] bottom-[-2%] md:w-[14vw] md:bottom-[-3%] lg:bottom-[-5%] right-[20%]"
        />

        {/* Tanah Kanan */}
        <Image
          data-gsap="right"
          src="/assets/beranda/sponsor/Tanah3K.png"
          alt="Tanah Kanan 1"
          width={1369.5}
          height={495}
          className="absolute w-[80vw] bottom-[-5%] right-[-43%] md:w-[68vw] md:bottom-[-8%] md:right-[-37%] lg:bottom-[-15%] lg:right-[-37%]"
        />

        <Image
          data-gsap="right"
          src="/assets/beranda/sponsor/Tanah2K.png"
          alt="Tanah Kanan 2"
          width={1369.5}
          height={495}
          className="absolute w-[38vw] bottom-[-7%] right-[-0.8%] md:w-[30vw] md:bottom-[-10%] md:right-[-0.3%] lg:bottom-[-18%] lg:right-[-1%]"
        />

        <Image
          data-gsap="right"
          src="/assets/beranda/sponsor/Tanah1K.png"
          alt="Tanah Kanan 3"
          width={1369.5}
          height={495}
          className="absolute w-[73vw] bottom-[-7%] right-[-43%] md:w-[68vw] md:bottom-[-13%] md:right-[-40%] lg:bottom-[-23%] lg:right-[-41%]"
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
        className="absolute  w-[90vw] bottom-[-2%] left-[-25%] md:w-[69vw] md:bottom-[-5%] lg:bottom-[-13%] lg:left-[-20%]"
      />


      {/* Rumput 1*/}


      <Image
        data-gsap="left"
        src="/assets/beranda/sponsor/Rumput.png"
        alt="Rumput 1"
        width={467}
        height={151}
        className="absolute bottom-[-1.7%] left-[-1%] w-[23vw] md:bottom-[-4%] md:left-[-1%] lg:bottom-[-7%] lg:left-[-1%] "
      />


      {/* Birds */}

      <Image
        src="/assets/beranda/sponsor/Birds.png"
        alt="Birds"
        width={106}
        height={109}
        className="absolute w-[15vw] top-[10%] left-[75%] md:top-[5%] md:left-[75%] md:w-[10vw]"
      />

      {/* Tulisan dan Gambar */}
      <div className="relative w-full h-[400px] flex items-center justify-center">
        <Image
          data-gsap="up"
          src="/assets/beranda/sponsor/SponsoredBy.png"
          alt="Tulisan"
          width={691}
          height={101}
          className="absolute top-[40%] md:top-[50%] lg:top-[70%] w-[32vw]"
        />

        <Image
          data-gsap="up"
          src="/assets/beranda/sponsor/Kotak.png"
          alt="Kotak"
          width={1535}
          height={275.68}
          className="absolute hidden md:block md:top-[70%] lg:top-[90%] w-[75vw]"
        />

        <Image
          src="/assets/beranda/sponsor/Kotak2.png"
          alt="Kotak"
          width={348}
          height={400}
          className="absolute top-[50%] md:hidden w-[220px]"
        />
      </div>
    </div>
  );
};
