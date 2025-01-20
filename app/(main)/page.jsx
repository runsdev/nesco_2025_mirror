import {
  Competition,
  Galeri,
  Hero,
  Prizepool,
  Register,
  Seminar,
  Sponsor,
} from '@/modules/beranda/index';

export default async function Home() {
  return (
    <>
      <Hero />
      <div className="flex w-full flex-col bg-gradient-to-b from-[#003C43] to-[#61CCC2]">
        <Prizepool />
        <Register />
      </div>
      <Competition />
      <Seminar />
      <Galeri />
      <Sponsor />
    </>
  );
}
