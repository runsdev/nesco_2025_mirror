import Image from 'next/image';

import { details } from '@/modules/data/details';

export function Details({ slug }) {
  return (
    <div className="relative z-[12] flex h-[50dvh] w-full flex-col items-center justify-center text-5xl text-lightyellow md:h-[60dvh] lg:min-h-screen">
      {/* Ini detail komponen detail */}
      <div className="relative flex w-[80%]">
        <div className="relative z-[14] flex h-[60vh] w-full items-center justify-center bg-[#61CCC2] p-2">
          <pre className="w-[90%] text-wrap text-xl">{JSON.stringify(details[slug])}</pre>
        </div>
        <div className="absolute left-0 right-0 z-[13] mx-auto aspect-[300/48] w-[80%] xl:bottom-[-150px] 2xl:bottom-[-180px]">
          <Image
            alt="kaki nesco"
            src="/assets/competition/details/kaki.png"
            className="w-full"
            fill
          />
        </div>
      </div>
    </div>
  );
}
