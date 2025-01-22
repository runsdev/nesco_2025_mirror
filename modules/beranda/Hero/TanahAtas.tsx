'use client';

import { Train } from '@/components/Element/Vehicle';
import Image from 'next/image';
import './vehicle.css';
import { ThreeKincirAngin } from '@/components/Element/ThreeKincirAngin';

export default function TanahAtas() {
  return (
    <div className="relative aspect-[785/166] w-full overflow-x-clip lg:aspect-[3839/571]">
      <div className="absolute bottom-0 left-0 right-0 top-0 z-[12] m-auto aspect-[785/166] w-full lg:aspect-[3839/571]">
        <Image
          alt="land nesco"
          src="/assets/beranda/Hero/land-up-m.png"
          className="aspect-[785/166] w-full lg:hidden lg:aspect-[3839/571]"
          fill
        />
        <Image
          alt="land nesco"
          src="/assets/beranda/Hero/land-up-d.png"
          className="aspect-[785/166] w-full max-lg:hidden lg:aspect-[3839/571]"
          fill
        />
      </div>
      <ThreeKincirAngin
        left
        right
        className="absolute bottom-[30%] left-[25%] z-[9] w-[50%] lg:bottom-[30%] lg:left-[21%] lg:w-[17%]"
      />
      <ThreeKincirAngin
        left
        className="absolute bottom-[30%] right-[18.5%] w-[17%] max-lg:hidden"
      />
      <Train className="animate-train absolute bottom-[46%] left-[78%] z-[12] w-[35.87%] lg:bottom-[40%] lg:w-[26.9%]" />
    </div>
  );
}
