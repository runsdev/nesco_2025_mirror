import Image from 'next/image';
import TanahAtas from './TanahAtas';
import TanahBawah from './TanahBawah';
import LogoNesco from '@/components/Element/LogoNesco';
import Link from 'next/link';
import Sun from '@/components/Element/Sun';

export const Hero = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-x-clip bg-gradient-to-b from-[#61CCC1] to-[#FDDF8D] text-center text-[50px] font-[700]">
      {/* Matahari */}
      <Sun
        plain
        className="absolute top-[15%] top-[44%] w-[16%] sm:top-[49%] sm:w-[12%] md:top-[42%] lg:top-[15%] lg:w-[10%] lg:w-[7.6%]"
      />
      {/* Tulisan dan Logo NEsco */}
      <div className="absolute left-0 right-0 z-[10] mx-auto aspect-[354/250] w-[90%] max-lg:top-[7%] sm:w-[80%] md:w-[52%] lg:top-[30%] lg:aspect-[1380/374] lg:w-[71.8%]">
        <div className="absolute left-0 aspect-[967/185] w-full max-lg:bottom-0 lg:top-[25%] lg:w-[70%]">
          <Image
            alt="NESCO 2025 NATIONAL ELECTRICAL POWER SYSTEM COMPETITION 2025"
            src="/assets/beranda/Hero/nesco2025.png"
            fill
          />
        </div>
        <LogoNesco
          shadow
          className="float-updown-1 absolute right-0 w-[44%] max-lg:left-0 max-lg:top-[6%] max-lg:mx-auto lg:w-[27%]"
        />
      </div>
      <button
        type="button"
        className="absolute top-[69%] z-[20] w-[47%] overflow-clip rounded-3xl bg-gradient-to-r from-[#003C43] via-[#0F776E] to-[#61CCC2] bg-[length:200%_200%] bg-[position:top_left] text-xl text-lightyellow transition-all duration-700 hover:bg-[position:bottom_right] hover:text-white sm:w-[37%] md:top-[61%] md:w-[32%] lg:top-[59%] lg:w-[250px] lg:rounded-3xl"
      >
        <Link
          href="/"
          className="relative h-full w-full py-[3vw] font-montserrat text-[4.5vw] font-[600] sm:text-[3.2vw] md:text-[2.8vw] lg:py-[1px] lg:text-2xl"
        >
          <p className="relative py-[2%] lg:py-[3%]">Register Here</p>
        </Link>
      </button>

      {/* Gunung kiri */}
      <div className="absolute bottom-[8vw] left-[-14%] z-[8] aspect-[1194/1450] w-[58%] md:left-[-13%] md:w-[55%] lg:left-[-8%] lg:w-[29.5%]">
        <Image alt="gunung nesco kiri" src="/assets/beranda/Hero/gunung-kiri.png" fill />
      </div>
      <div className="absolute bottom-[4vw] right-[-25%] z-[8] aspect-[631/728] w-[68%] md:right-[-24%] md:w-[70%] lg:right-[-8%] lg:w-[34%]">
        <Image alt="gunung nesco kanan" src="/assets/beranda/Hero/gunung-kanan.png" fill />
      </div>
      {/* Gunung kanan */}
      <div className="absolute bottom-[14vw] w-full lg:bottom-[5vw]">
        <TanahAtas />
      </div>
      <div className="absolute bottom-0 w-full">
        <TanahBawah />
      </div>
    </section>
  );
};
