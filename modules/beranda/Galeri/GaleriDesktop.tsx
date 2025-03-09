import Image from 'next/image';
import React from 'react';

interface GaleriDesktopProps {
  className?: string;
}

const GaleriDesktop: React.FC<GaleriDesktopProps> = ({ className }) => {
  return (
    <section className={`w-[75%] space-y-8 text-center ${className}`}>
      <div className="grid grid-cols-3 items-center gap-[5vw]">
        {/* Kolom 1 */}
        <div className="flex flex-col gap-[14vw] md:gap-[14vw] xl:gap-y-[6vw]">
          <div className="float-zigzag flex flex-col items-center">
            <Image
              src={'/assets/beranda/Galeri/Drone4.png'}
              width={1000}
              height={1000}
              alt="Drone 6"
              className="h-auto w-full max-w-[15vw]"
            />
            <div className="flex aspect-[3/2] h-auto w-full items-center justify-center overflow-hidden rounded-lg drop-shadow-offset-lg">
              <Image
                src={'/assets/beranda/Galeri/1.webp'}
                alt="Pic 1"
                fill
                objectFit="cover"
                className="absolute"
              />
            </div>
          </div>
          <div className="float-updown-1 relative flex flex-col items-center">
            <Image
              src={'/assets/beranda/Galeri/Drone6.png'}
              width={1000}
              height={1000}
              alt="Drone 6"
              className="absolute z-10 h-auto w-full max-w-[15vw]"
            />
            <div className="mt-[4vw] flex aspect-[5/6] h-auto w-full items-center justify-center overflow-hidden rounded-lg drop-shadow-lg drop-shadow-offset-lg">
              <Image
                src={'/assets/beranda/Galeri/2.webp'}
                alt="Pic 2"
                fill
                objectFit="cover"
                className="absolute"
              />
            </div>
          </div>
        </div>

        {/* Kolom 2 */}
        <div className="float-x flex flex-col items-center">
          <Image
            src={'/assets/beranda/Galeri/Drone3.png'}
            width={1000}
            height={1000}
            alt="Drone 6"
            className="h-auto w-full max-w-[15vw]"
          />
          <div className="flex aspect-square h-auto w-full items-center justify-center overflow-hidden rounded-lg drop-shadow-lg drop-shadow-offset-lg">
            <Image
              src={'/assets/beranda/Galeri/3.webp'}
              alt="Pic 3"
              fill
              objectFit="cover"
              className="absolute"
            />
          </div>
        </div>

        {/* Kolom 3 */}
        <div className="flex flex-col space-y-[7vw]">
          <div className="float-downup-1 relative mt-[6vw] flex flex-col items-center">
            <Image
              src={'/assets/beranda/Galeri/Drone6.png'}
              width={1000}
              height={1000}
              alt="Drone 6"
              className="absolute z-10 h-auto w-full max-w-[15vw] scale-x-[-1]"
            />
            <div className="mt-[4vw] flex aspect-[5/6] h-auto w-full items-center justify-center overflow-hidden rounded-lg drop-shadow-lg drop-shadow-offset-lg">
              <Image
                src={'/assets/beranda/Galeri/4.webp'}
                alt="Pic 4"
                fill
                objectFit="cover"
                className="absolute"
              />
            </div>
          </div>
          <div className="float-horizontal-1 flex flex-col items-center">
            <Image
              src={'/assets/beranda/Galeri/Drone3.png'}
              width={1000}
              height={1000}
              alt="Drone 6"
              className="h-auto w-full max-w-[15vw]"
            />
            <div className="flex aspect-[3/2] h-auto w-full items-center justify-center overflow-hidden rounded-lg drop-shadow-lg drop-shadow-offset-lg">
              <Image
                src={'/assets/beranda/Galeri/5.webp'}
                alt="Pic 5"
                fill
                objectFit="cover"
                className="absolute"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GaleriDesktop;
