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
      <Prizepool />
      <Register />
      <Competition />
      <Seminar />
      <Galeri />
      <Sponsor />
    </>
  );
}
