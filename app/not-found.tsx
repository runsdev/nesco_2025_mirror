'use client';

import '../styles/globals.css';
import '../styles/animasi.css';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import DecryptedText from '@/components/Animation/DecryptedText';
import { KincirAngin } from '@/components/Element/KincirAngin';

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-y-hidden overflow-x-clip bg-darkblue">
      {/* darkblue wrapper */}
      <div className="absolute z-[11] mt-[-200vw] h-[60vw] w-full bg-darkblue md:mt-[-160vw] lg:mt-[-100vw]" />
      <div className="absolute z-[11] mb-[-200vw] h-[60vw] w-full bg-darkblue md:mb-[-160vw] lg:mb-[-100vw]" />
      {/* Layer 0 */}
      <div className="absolute z-[5] h-[60%] w-full bg-lightyellow sm:h-[80%] md:h-[70%] lg:h-[50%] xl:h-[60%]" />
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
      <h1 className="absolute z-[50] font-kodeMono text-[17vw] font-[700] drop-shadow-offset md:text-[14vw] lg:text-[65px] xl:text-[100px] 2xl:text-[120px]">
        <DecryptedText text="404" animateOn="view" speed={60} maxIterations={20} />
      </h1>

      {/* Kincir Angin */}
      <KincirAngin
        on
        variant="blue"
        className="absolute z-[7] -mb-[15%] -mr-[70%] w-[25%] md:-mb-[10%] md:-mr-[58%] lg:-mb-0 lg:-mr-[31%] lg:w-[11%]"
      />
    </section>
  );
}
