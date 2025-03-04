'use server';

import { agendaData } from '@/modules/data/data';
import { notFound } from 'next/navigation';
import { Details, Hero, Prizepool, Timeline } from '@/modules/competition';
import Image from 'next/image';

export default async function Page({ params }: { params: Promise<{ competition: string }> }) {
  const { competition: slug } = await params;
  const slugList = agendaData.map((agenda) => agenda.slug);
  if (slug === 'seminar') {
    return notFound();
  }
  if (!slugList.includes(slug)) {
    return notFound();
  }
  return (
    <div className="w-full overflow-clip bg-gradient-to-b from-[#61CCC1] via-[#FDDF8D]/50 to-[#FDDF8D]">
      <Hero slug={slug} />
      <div className="relative flex h-auto w-full justify-center overflow-x-clip overflow-y-visible md:h-[60svh] lg:h-fit 2xl:h-[120vh]">
        <div className="absolute z-[7] mr-[2%] aspect-[1500/1129.18] w-[145vw] max-lg:ml-[-5vw] md:w-[149vw] lg:w-[122vw] 2xl:w-[122vw]">
          <Image
            alt="background"
            src="/assets/competition/bg.webp"
            sizes="100vw"
            fill
            className="absolute w-full"
          />
        </div>
        <Details slug={slug} />
      </div>

      <div className="relative flex w-full flex-col items-center overflow-x-clip overflow-y-visible lg:justify-center lg:pt-[5%]">
        <div className="absolute top-[-22vw] z-[7] mr-[2%] aspect-[1500/1676.35] w-[132vw] sm:top-[-20vw] md:top-[-8vw] lg:top-[-6vw] xl:top-[5vw]">
          <Image
            alt="background"
            src="/assets/competition/bg-2.webp"
            sizes="100vw"
            fill
            className="absolute w-full"
          />
        </div>
        <Prizepool slug={slug} className="pt-[12%]" />
        <Timeline slug={slug} />
      </div>
    </div>
  );
}
