'use client';

import '@/styles/globals.css';
import '@/styles/animasi.css';
import { cn } from '@/lib/utils';
import { DecryptedText } from '@/components/Animation/index';
import { Awan, KincirAngin, Rumput, Sun } from '@/components/Element/index';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface ErrorPageProps {
  pesan: string;
  text1: string;
  text2: string;
  redirect: string;
}

export default function ErrorPageWithCustomRedirect({
  pesan,
  text1,
  text2,
  redirect,
}: ErrorPageProps) {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-y-hidden overflow-x-clip bg-darkblue">
      {/* darkblue wrapper */}
      <div className="absolute z-[11] mt-[-200vw] h-[60vw] w-full bg-darkblue md:mt-[-160vw] lg:mt-[-100vw]" />
      <div className="absolute z-[11] mb-[-200vw] h-[60vw] w-full bg-darkblue md:mb-[-160vw] lg:mb-[-100vw]" />
      {/* Layer 0 */}
      <div className="absolute z-[4] aspect-square w-full bg-lightyellow lg:aspect-[10/6] lg:h-[50%] xl:h-[60%] 2xl:aspect-[5/4]" />
      {/* Layer 1 */}
      <div
        className={cn(
          'absolute z-[6] aspect-[526/376] w-[130%] md:w-[105%] lg:aspect-[1250/493] lg:w-[65%]',
          "bg-[url('/assets/404/l1-m.png')] bg-cover drop-shadow-offset-lg lg:bg-[url('/assets/404/l1-d.png')]",
        )}
      />
      {/* Layer 2 */}
      <div
        className={cn(
          'absolute z-[8] mt-[-11%] aspect-[580/473] w-[140%] md:mt-[-12%] md:w-[115%] lg:mt-[-4%] lg:aspect-[1834/723] lg:w-[95%]',
          "bg-[url('/assets/404/l2-m.png')] bg-cover drop-shadow-offset-lg lg:bg-[url('/assets/404/l2-d.png')]",
        )}
      />
      {/* Layer 3 */}
      <div
        className={cn(
          'absolute z-[9] mt-[-11%] mt-[-21%] aspect-[805/852] w-[192%] md:mt-[-22%] md:w-[160%] lg:mt-[-4%] lg:aspect-[1920/1080] lg:w-[102%]',
          "bg-[url('/assets/404/l3-m.png')] bg-cover drop-shadow-offset-lg lg:bg-[url('/assets/404/l3-d.png')]",
        )}
      />
      {/* 404 */}
      <h1 className="absolute z-[50] font-kodeMono text-[17vw] font-[700] drop-shadow-offset md:text-[14vw] lg:text-[65px] xl:text-[100px] 2xl:text-[130px]">
        <DecryptedText text={pesan} animateOn="view" speed={60} maxIterations={40} />
      </h1>
      {/* Matahari */}
      <Sun
        shadow
        rotate
        className="absolute z-[12] -ml-[49%] -mt-[55%] w-[14%] md:-ml-[43%] md:-mt-[44%] md:w-[12%] lg:-ml-[31%] lg:-mt-[17%] lg:w-[6%]"
      />
      {/* Awan kiri */}
      <Awan
        variant={8}
        className="float-horizontal-1 absolute z-[12] -ml-[30%] -mt-[36%] w-[18%] drop-shadow-offset-lg md:-ml-[25%] md:-mt-[27%] md:w-[17%] lg:-ml-[18%] lg:-mt-[10%] lg:w-[9%]"
      />

      {/* Awan tengah */}
      <Awan
        variant={7}
        className="float-horizontal-1 absolute z-[12] -mr-[17%] -mt-[52%] w-[12%] drop-shadow-offset-lg md:-mr-[12%] md:-mt-[40%] md:w-[10.5%] lg:-ml-[10%] lg:-mt-[17%] lg:w-[5%]"
      />
      {/* Awan kanan */}
      <Awan
        variant={8}
        className="float-horizontal-1 absolute z-[12] -mr-[42%] -mt-[31%] w-[13%] drop-shadow-offset-lg md:-mr-[35%] md:-mt-[26%] md:w-[10%] lg:-ml-[20%] lg:-mt-[10%] lg:w-[5%]"
      />
      {/* Rumput kiri */}
      <Rumput
        variant={2}
        className="absolute z-[5] -mb-[56%] -ml-[80%] w-[15%] drop-shadow-offset-lg md:-mb-[45%] md:-ml-[63%] md:w-[14%] lg:-mb-[14%] lg:-ml-[42%] lg:w-[5%]"
      />
      {/* Rumput kanan */}
      <Rumput
        variant={1}
        className="absolute z-[5] -mb-[63%] -ml-[15%] w-[15%] drop-shadow-offset-lg md:-mb-[48%] md:-ml-[11%] md:w-[14%] lg:-mb-[16%] lg:-ml-[6%] lg:w-[5%]"
      />
      {/* Kincir Angin */}
      <KincirAngin
        on
        variant="blue"
        className="absolute z-[7] -mb-[15%] -mr-[70%] w-[25%] md:-mb-[10%] md:-mr-[58%] lg:-mb-0 lg:-mr-[31%] lg:w-[11%]"
      />
      {/* Paeg not found */}
      <span className="absolute left-0 right-0 z-[18] mx-auto -mb-[110%] gap-0 text-center text-white md:-mb-[80%] lg:-mb-[35%]">
        <p className="text-[3vw] md:text-[2.7vw] lg:text-[20px] 2xl:text-[22px]">{text1}</p>
        <Link
          href={redirect}
          className="top-[20%] text-[2.8vw] text-lightblue duration-500 hover:text-lightyellow md:text-[2.6vw] lg:text-[17px] 2xl:text-[20px]"
        >
          {text2}
        </Link>
      </span>
    </section>
  );
}
