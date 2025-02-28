import Image from 'next/image';
import Link from 'next/link';

import { details } from '@/modules/data/details';

const KotakBanyak = ({ totalKotak = 24 }) => {
  const semuaKotak = [...Array(totalKotak)];
  return (
    <div className="grid w-full grid-cols-12 gap-[1vw] overflow-x-auto md:gap-[1vw]">
      {semuaKotak.map((_, index) => (
        <div
          key={`kotak-${index}`}
          className="relative aspect-square w-[1vw] bg-[#0E5B54] md:w-full"
        ></div>
      ))}
    </div>
  );
};

const KotakTulisan = ({ alt, src, kategori, size = 32 }) => {
  return (
    <div className="relative flex flex-row">
      <div className="relative w-[5%] rounded-l-sm bg-[#0E5B54]"></div>
      <div className="relative flex w-[95%] flex-row items-center space-x-[14%] rounded-r-sm bg-[#0F776E] p-[3.5%]">
        <div className="absolute aspect-square w-[2vw] items-center">
          <Image src={src} alt={alt} fill />
        </div>
        <p className="ml-[3vw] text-[2vw] text-white md:text-lg">{kategori}</p>
      </div>
    </div>
  );
};

export function Details() {
  const detailsDebate = details.debate;
  return (
    <div className="relative z-[12] mt-[7%] flex h-[50dvh] w-full flex-col items-center justify-center text-5xl text-lightyellow md:h-[60dvh] lg:min-h-screen">
      {/* Ini detail komponen detail */}
      <div className="relative flex w-[80%] flex-col">
        <div className="relative z-[14] flex w-full items-center justify-center rounded-lg bg-[#61CCC2] p-[1vw] drop-shadow-md md:p-[2%]">
          <div className="relative flex w-full space-x-[2%] p-[1.3%]">
            {/* Paper Competition Section */}
            <div className="hidden flex-[2] flex-col gap-y-[4%] lg:flex">
              <div className="gap-xp-[5%] relative flex flex-row items-center justify-center rounded-sm bg-[#0E5B54] p-[5%] text-center">
                <div className="relative aspect-square w-[3vw]">
                  <Image src="/competition/Competitions.png" alt="Logo competitions" fill />
                </div>
                <h1 className="text-[3vw] font-bold text-[#EABB37] md:text-2xl">
                  {detailsDebate.title}
                </h1>
              </div>
              <div className="h-full rounded-sm bg-[#0E5B54] p-[7%]">
                <p className="text-justify text-[2vw] text-white md:text-lg">
                  {detailsDebate.description}
                </p>
              </div>
            </div>
            {/* Kategori Peserta & Biaya Pendaftaran */}
            <div className="flex flex-[2] flex-col space-y-[4%]">
              <div className="rounded-sm bg-[#0E5B54] px-[4%] py-[6.3%]">
                <h1 className="text-[3vw] font-bold text-[#EABB37] md:text-2xl">
                  Kategori Peserta
                </h1>
              </div>
              <div className="flex flex-col space-y-[5%]">
                <KotakTulisan
                  src="/competition/Vector.png"
                  alt="Logo mahasiswa"
                  kategori={detailsDebate.kategori.jenis}
                />
                <KotakTulisan
                  src="/competition/Group 5952.png"
                  alt="Logo perorangan"
                  kategori={detailsDebate.kategori.tim}
                />
                <KotakTulisan
                  src="/competition/Group 50.png"
                  alt="Logo jumlah"
                  kategori={detailsDebate.kategori.jumlah}
                />
              </div>
              <KotakBanyak />
              <div className="rounded-sm bg-[#0E5B54] px-[4%] py-[6.3%]">
                <h1 className="text-[3vw] font-bold text-[#EABB37] md:text-2xl">
                  Biaya Pendaftaran
                </h1>
              </div>
              <KotakTulisan
                src="/competition/VectorPendaftaran.png"
                alt="Logo biaya"
                kategori={detailsDebate.biaya}
              />
            </div>
            {/* Contact Person & Guidebook */}
            <div className="flex flex-[1] flex-col space-y-[4%]">
              <div className="space-y-[4%] rounded-sm bg-[#0E5B54]">
                <div className="px-[4%] py-[6.3%] text-center">
                  <h1 className="text-[3vw] font-bold text-[#EABB37] md:text-2xl">
                    Contact Person
                  </h1>
                </div>
                <div className="flex flex-col space-y-[4%] p-4">
                  <div className="flex flex-row items-center space-x-[4%]">
                    <div className="relative flex aspect-square w-[2vw] items-center justify-center">
                      <div className="h-[1vw] w-[1vw] bg-[#D9D9D9]"></div>
                    </div>
                    <p className="text-[2vw] text-white md:text-sm">
                      {detailsDebate.contactPerson.line}
                    </p>
                  </div>
                  <div className="flex flex-row items-center space-x-[4%]">
                    <div className="relative flex aspect-square w-[2vw] items-center justify-center">
                      <div className="h-[1vw] w-[1vw] bg-[#D9D9D9]"></div>
                    </div>
                    <p className="text-[2vw] text-white md:text-sm">
                      {detailsDebate.contactPerson.wa}
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative flex h-full flex-row">
                <div className="flex w-[85%] items-center justify-center rounded-l-sm bg-[#0E5B54] p-[10%] text-center">
                  <Link
                    href={detailsDebate.guidebook}
                    className="text-[3vw] font-bold text-[#EABB37] md:text-2xl"
                  >
                    Guide Book
                  </Link>
                </div>
                <div className="ml-[-2%] w-[5%] rounded-l-sm bg-[#61CCC2]"></div>
                <div className="w-[5%] rounded-l-sm bg-[#0F776E]"></div>
                <div className="w-[10%] bg-[#0E5B53]"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative left-0 right-0 z-[13] mx-auto aspect-[300/48] w-[80%]">
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
