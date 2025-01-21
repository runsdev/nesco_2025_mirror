import Nesco from '@/components/Element/Nesco';
import Sun from '@/components/Element/Sun';
import { Train, Car } from '@/components/Element/Vehicle';

export const Hero = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#61CCC1] to-[#FDDF8D] text-center text-[50px] font-[700]">
      Hero
      {/* <Sun plain shadow rotate horizontalfloat={3} className="absolute top-[20%] w-[10%]" />
      <Sun shadow className="absolute top-[40%] w-[10%]" updownfloat={1} rotate /> */}
      {/* <Sun /> */}
      <Nesco shadow className="float-updown-2 rotasi absolute top-[10%] w-[20%]" />
      {/* <Car variant="yellow" right className="w-[20%]" /> */}
      <Train variant="yellow" right className="w-[20%]" />
    </div>
  );
};
