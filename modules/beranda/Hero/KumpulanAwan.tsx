import { Awan } from '@/components/Element/index';
import './awan.css';

export default function KumpulanAwan() {
  return (
    <>
      {/* Ga dipake di mobile */}
      <Awan
        variant={2}
        className="animate-awan-sedang absolute -left-[76vw] top-[18%] z-[7] w-[13vw]"
      />
      <Awan
        variant={2}
        className="animate-awan-sedang absolute left-[24vw] top-[18%] z-[7] w-[13vw]"
      />
      {/* {/* 1 kelompok */}
      <Awan
        variant={3}
        className="animate-awan-sedang absolute left-[63vw] top-[22%] z-[7] w-[20%] lg:w-[10%]"
      />
      <Awan
        variant={3}
        className="animate-awan-sedang absolute -left-[37vw] top-[22%] z-[7] w-[20%] lg:w-[10%]"
      />

      {/* 1 kelompok */}
      <Awan
        variant={1}
        className="animate-awan-lambat absolute left-[7vw] top-[57%] z-[7] w-[24%] md:top-[36%] lg:w-[13%] xl:hidden 2xl:top-[25%]"
      />
      <Awan
        variant={1}
        className="animate-awan-lambat absolute -left-[93vw] top-[57%] z-[7] w-[24%] md:top-[36%] lg:w-[13%] xl:hidden 2xl:top-[25%]"
      />

      {/* 1 kelompok */}
      <Awan
        variant={4}
        className="animate-awan-lambat absolute left-[76vw] top-[56%] z-[7] w-[22%] md:top-[38%] lg:left-[82vw] lg:w-[16%] 2xl:top-[25%]"
      />
      <Awan
        variant={4}
        className="animate-awan-lambat absolute -left-[24vw] top-[56%] z-[7] w-[22%] md:top-[38%] lg:-left-[18vw] lg:w-[16%] 2xl:top-[25%]"
      />

      {/* 1 kelompok */}
      {/* <Awan
        variant={5}
        className="animate-awan-cepat absolute left-[81vw] top-[60%] z-[10] w-[12%] sm:top-[52%] md:top-[46%] lg:left-[86vw] lg:top-[50%] lg:w-[7%] 2xl:top-[32%]"
      />
      <Awan
        variant={5}
        className="animate-awan-cepat absolute -left-[19vw] top-[60%] z-[10] w-[12%] sm:top-[52%] md:top-[46%] lg:-left-[14vw] lg:top-[50%] lg:w-[7%] 2xl:top-[32%]"
      /> */}

      {/* 1 kelompok */}
      <Awan
        variant={5}
        className="animate-awan-cepat absolute left-[5vw] top-[62%] z-[10] w-[13%] sm:top-[54%] md:top-[52%] lg:top-[48%] lg:w-[5.5%] 2xl:top-[30%]"
      />
      <Awan
        variant={5}
        className="animate-awan-cepat absolute -left-[95vw] top-[62%] z-[10] w-[13%] sm:top-[54%] md:top-[52%] lg:top-[48%] lg:w-[5.5%] 2xl:top-[30%]"
      />
    </>
  );
}
