import {
  Competition,
  Galeri,
  Hero,
  Prizepool,
  Register,
  Seminar,
  Sponsor,
} from '@/modules/beranda/index';

import ParticlesContainer from '@/components/UI/ParticlesContainer';

export default async function Home() {
  return (
    <>
      <Hero />
      <div className="relative flex w-full flex-col bg-gradient-to-b from-[#003C43] to-[#61CCC2]">
        <ParticlesContainer className="absolute top-0 z-0 h-[93svh] min-h-screen w-full md:h-[97svh] lg:h-[180svh]" />
        <Prizepool />
        <Register />
      </div>
      <div className="flex w-full flex-col bg-gradient-to-b from-[#FFE08D] via-[#6DF0FF] to-[#61CCC2]">
        <Competition />
        <Seminar />
        <Galeri />
      </div>
      {/* <Sponsor /> */}
    </>
  );
}
