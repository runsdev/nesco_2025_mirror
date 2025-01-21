import { KincirAngin } from '@/components/Element/KincirAngin';
import LogoNesco from '@/components/Element/LogoNesco';
import Sun from '@/components/Element/Sun';
import { Train, Car } from '@/components/Element/Vehicle';
import TanahAtas from './TanahAtas';
import TanahBawah from './TanahBawah';

export const Hero = () => {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#61CCC1] to-[#FDDF8D] text-center text-[50px] font-[700]">
      <div className="absolute bottom-[12vw] w-full lg:bottom-[5vw]">
        <TanahAtas />
      </div>
      <div className="absolute bottom-0 w-full">
        <TanahBawah />
      </div>
    </section>
  );
};
