'use client';

import { agendaData } from '@/modules/data/data';
import '../beranda/Competition/competition.css';
import Image from 'next/image';
import { Car } from '@/components/Element';
import { cn } from '@/lib/utils';

const GrayLine = ({ className }) => {
  return (
    <div
      className={cn(
        'absolute top-[30%] h-[5%] w-[100vw] rotate-[-59.27deg] bg-white/10 lg:w-[60vw]',
        className,
      )}
    />
  );
};

const Gedung = ({ className, flip = false, tengah = false }) => {
  return (
    <div
      className={cn(
        'absolute bottom-[12%] left-0 h-[80px] sm:bottom-[10%] md:bottom-[16%] md:h-[100px] lg:bottom-[18%]',
        tengah ? 'animasi-gedung-2 -mb-[0.2%] w-[102%]' : 'animasi-gedung w-[100%]',
        className,
      )}
    >
      <Image
        alt="gedung"
        src="/assets/beranda/Competition/Union.svg"
        fill
        className={cn('object-contain object-bottom', flip && 'scale-x-[-1]')}
      />
    </div>
  );
};

const Jalan = ({ className, tengah = false }) => {
  return (
    <div
      className={cn(
        'absolute bottom-[-10%] left-0 right-0 aspect-[480/35] sm:bottom-[-5%]',
        tengah ? 'animasi-gedung-2 -mb-[0.2%] w-[102%]' : 'animasi-gedung w-[100.5%]',
        className,
      )}
    >
      <Image
        alt="jalan"
        src="/assets/beranda/Competition/jalan.svg"
        fill
        className="object-cover object-bottom"
      />
    </div>
  );
};

export function Hero({ slug }) {
  const lombaData = agendaData.find((item) => item.slug === slug);

  return (
    <div className="relative z-[10] flex h-[100svh] w-full flex-col items-center justify-center lg:min-h-screen">
      <h1
        data-aos="zoom-in"
        className="z-[12] mb-8 mt-7 font-kodeMono text-[6vw] font-bold md:text-[5.7vw] lg:mt-[7%] lg:text-4xl xl:text-7xl"
      >
        Competitions
      </h1>
      <Image
        data-aos="fade-left"
        alt="Cahaya Nesco"
        src="/assets/competition/cahaya-2.svg"
        width={2000}
        height={2000}
        className="absolute right-0 top-[20%] z-[11] w-[45%] lg:top-[15%]"
      />
      <Image
        data-aos="fade-left"
        data-aos-delay="400"
        alt="Cahaya Nesco"
        src="/assets/competition/cahaya-1.svg"
        width={2000}
        height={2000}
        className="absolute right-0 top-[90%] z-[11] w-[57%] lg:top-[80%]"
      />
      <div
        data-aos="zoom-in"
        data-aos-duration="500"
        className="relative z-[12] flex w-full flex-col items-center"
      >
        <div className="lg-portrait:h-custom flex aspect-[5/4] h-auto max-h-[80vh] w-full max-w-[95vw] items-center justify-center md:aspect-[3/2] lg:max-h-[65vh] lg:w-[60%]">
          <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-white py-4 shadow-lg md:rounded-2xl md:py-5 xl:rounded-[35px]">
            {/* Content */}
            <div className="relative h-full w-[93%] overflow-hidden rounded-xl bg-black px-5 py-5 text-white md:w-[80%] md:rounded-2xl lg:w-[80%] lg:px-6 lg:py-14 xl:rounded-[35px]">
              <div className="fade-transition">
                <h2 className="mb-3 flex items-center justify-center gap-x-2 font-montserrat text-[4vw] font-[800] text-[#EABB37] lg:text-2xl xl:text-3xl">
                  <Image
                    src={lombaData.logo}
                    alt={lombaData.title}
                    width={1}
                    height={1}
                    className="inline w-[2em] xl:w-[2.7em]"
                  />
                  {lombaData.title}
                </h2>

                <p className="text-justify font-montserrat text-[3vw] font-[500] text-white md:text-[2.5vw] lg:text-[16px] lg:leading-snug xl:text-[25px]">
                  {lombaData.description}
                </p>
              </div>

              {/* Garis Abu-Abu dari Kiri ke Kanan*/}
              <div className="animasi-lampu pointer-events-none absolute left-0 top-0 h-full w-full">
                <GrayLine className="left-[-45%]" />
                <GrayLine className="left-[10%]" />
                <GrayLine className="left-[15%]" />
                <GrayLine className="left-[55%]" />
                <GrayLine className="left-[110%]" />
                <GrayLine className="left-[115%]" />
              </div>

              {/* City Position */}
              <div className="absolute bottom-0 left-0 right-0 z-10 h-[40%] overflow-hidden">
                <div className="relative h-full w-full overflow-hidden">
                  <Gedung className="left-0" />
                  <Gedung className="left-[99%]" flip tengah />
                  <Gedung className="left-[200.5%]" />

                  {/* Jalan */}
                  <Jalan tengah />
                  <Jalan className="left-[99%]" tengah />
                  <Jalan className="left-[200.5%]" tengah />

                  {/* Mobil */}
                  <div className="absolute bottom-[4%] left-1/2 z-20 w-[18%] -translate-x-1/2 md:bottom-[5%] md:w-[15%]">
                    <Car variant="blue" right={true} className="w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lingkaran Abu-Abu */}
            <div className="absolute right-[4%] top-[5vh] flex flex-col items-center justify-center gap-y-[1vh] max-md:hidden">
              <div className="rounded-full bg-black p-1">
                <div className="h-[3vw] min-h-[20px] w-[3vw] min-w-[20px] rounded-full bg-gray-600 md:h-[2vw] md:w-[2vw]"></div>
              </div>
              <div className="rounded-full bg-black p-0.5">
                <div className="h-[2.5vw] min-h-[18px] w-[2.5vw] min-w-[18px] rounded-full bg-gray-600 md:h-[1.5vw] md:w-[1.5vw]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
