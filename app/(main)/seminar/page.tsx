import Image from 'next/image';
import '@/styles/globals.css';
import Link from 'next/link';

export default function Seminar() {
  return (
    <div className="flex min-h-[100svh] w-full items-center justify-center bg-gradient-to-b from-[#61CCC2] to-[#003C43] md:h-[120vh] lg:h-[130svh]">
      <div className="absolute top-[10vw] h-[55vw] w-full md:top-[5vw] lg:h-[25vw] xl:h-[20vw]">
        <Image
          src="/assets/beranda/Galeri/1.webp"
          width={2000}
          height={2000}
          alt="awan"
          className="h-full w-full object-cover"
        />
      </div>
      <Image
        src="/seminar/Awan.png"
        width={810}
        height={456}
        alt="awan"
        className="absolute top-[60vw] block h-auto w-[100vw] md:top-[55vw] lg:top-[25vw] xl:top-[20vw]"
      />
      <Image
        src="/seminar/gunung2.png"
        width={2000}
        height={2000}
        alt="gunung"
        className="absolute bottom-[-7vw] w-full lg:bottom-[-15vw] xl:hidden"
      />
      <Image
        src="/seminar/Gunung.png"
        width={2000}
        height={2000}
        alt="gunung"
        className="absolute bottom-[-10vw] hidden w-full xl:block"
      />
      <div className="absolute flex w-full flex-col items-center justify-center px-[20vw] max-md:mt-[35vw] md:mt-[0vw]">
        <h1 className="mt-6 w-[48vw] text-center font-kodeMono text-[6vw] font-bold text-[#61CCC2] md:gap-[4vw] md:text-[4vw]">
          Seminar
        </h1>
        <p className="text-center font-montserrat text-[3vw] text-[#FFDA1F] md:text-balance md:text-[2vw] xl:text-[1.3vw]">
          Seminar Nasional adalah seminar yang diadakan oleh NESCO tiap tahunnya dengan tema
          ketenagalistrikan untuk menjadi ruang diskusi dan upaya mengenalkan serta mendorong
          perkembangan sistem ketenagalistrikan di kalangan masyarakat umum.
        </p>
        <button
          type="button"
          className="mt-[10px] rounded-2xl bg-[#EABB37] px-3 py-[0.5vw] text-[3vw] font-semibold text-black duration-300 hover:bg-[#FFEDBD] md:text-[1.7vw] xl:bottom-[12vw] xl:text-[1.3vw]"
        >
          <Link href="/seminar/register" className="flex h-full w-full items-center justify-center">
            Register Here
          </Link>
        </button>
      </div>
    </div>
  );
}
