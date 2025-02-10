'use client';

import { Car } from '@/components/Element/index';
import Image from 'next/image';
import './vehicle.css';

export default function TanahBawah() {
  return (
    <div className="relative aspect-[796/270] w-full overflow-x-clip lg:aspect-[3838/992]">
      <div className="absolute bottom-0 z-[8] aspect-[25/5] w-full bg-lightyellow lg:hidden" />
      <div className="absolute bottom-0 left-0 right-0 top-0 z-[12] m-auto aspect-[796/270] w-full lg:aspect-[3838/992]">
        <Image
          alt="land nesco"
          src="/assets/beranda/Hero/land-down-m.png"
          className="aspect-[796/270] w-full lg:hidden lg:aspect-[3838/992]"
          fill
        />
        <Image
          alt="land nesco"
          src="/assets/beranda/Hero/land-down-d.png"
          className="aspect-[796/270] w-full max-lg:hidden lg:aspect-[3838/992]"
          fill
        />
      </div>
      <Car
        variant="yellow"
        right
        className="animate-yellow-car absolute bottom-[11%] left-[-12%] z-[14] w-[7%] lg:bottom-[9%] lg:w-[3.6%]"
      />
      <Car
        variant="blue"
        className="animate-blue-car absolute bottom-[3%] right-[-12%] z-[14] w-[7%] lg:bottom-[2%] lg:w-[3.6%]"
      />
    </div>
  );
}
