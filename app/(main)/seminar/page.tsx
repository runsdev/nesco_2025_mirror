import Image from 'next/image';
import '@/styles/globals.css';

export default function Seminar() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#61CCC2] to-[#003C43]">
      <div className="absolute top-[10vw] h-[55vw] w-full md:top-[5vw] md:h-[35vw] xl:h-[12vw]">
        <Image
          src="/seminar/foto.png"
          width={810}
          height={456}
          alt="awan"
          className="h-full w-full object-cover"
        />
      </div>
      <Image
        src="/seminar/Awan.png"
        width={810}
        height={456}
        alt="awan"
        className="absolute top-[60vw] block h-auto w-[100vw] md:top-[35vw] xl:top-[12vw]"
      />
      <Image
        src="/seminar/gunung2.png"
        width={810}
        height={456}
        alt="gunung"
        className="absolute bottom-[-7vw] w-full xl:hidden"
      />
      <Image
        src="/seminar/Gunung.png"
        width={810}
        height={456}
        alt="gunung"
        className="absolute bottom-[-10vw] hidden w-full xl:block"
      />
      <div className="absolute mt-[35vw] flex w-full flex-col items-center justify-center px-[20vw] xl:mt-[2vw]">
        <h1 className="w-[48vw] text-center font-kodeMono text-[6vw] font-bold text-[#61CCC2] md:gap-[4vw] md:text-[4vw]">
          Seminar
        </h1>
        <p className="text-justify font-montserrat text-[3.5vw] text-[#FFDA1F] md:text-balance md:text-[2vw] xl:text-[1.3vw]">
          Seminar Nasional adalah seminar yang diadakan oleh NESCO tiap tahunnya dengan tema
          ketenagalistrikan untuk menjadi ruang diskusi dan upaya mengenalkan serta mendorong
          perkembangan sistem ketenagalistrikan di kalangan masyarakat umum.
        </p>
      </div>
      <button
        type="button"
        className="absolute bottom-[25vw] w-[30%] rounded-2xl bg-[#EABB37] py-[0.5vw] text-[3vw] font-semibold text-black duration-300 hover:bg-[#FFEDBD] xl:bottom-[12vw] xl:w-[13%] xl:text-[1.3vw]"
      >
        Register Here
      </button>
    </div>
  );
}
