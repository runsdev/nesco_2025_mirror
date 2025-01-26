import Image from 'next/image';
import React from 'react';

interface GaleriMobProps {
  className?: string;
}

const GaleriMobile: React.FC<GaleriMobProps> = ({ className }) => {
  return (
    <section className={`w-full text-center ${className}`}>
      <div className="flex flex-col items-center">
        {/* Kolom 1 */}
        <div className="flex flex-row space-y-0">
          <div className="float-updown-1 relative flex flex-col items-center">
            <Image
              src={'/assets/beranda/Galeri/Drone6.png'}
              width={1000}
              height={1000}
              alt="Drone 6"
              className="absolute z-10 h-auto w-full max-w-[15vw]"
            />
            <div className="mt-[4vw] flex h-auto w-full items-center justify-center overflow-hidden rounded-lg">
              <Image
                src={'/assets/beranda/Galeri/Rectangle 1524.png'}
                width={1000}
                height={1000}
                alt="Pic 1"
                className="h-auto max-w-[70%] object-contain"
              />
            </div>
          </div>
          <div className="float-x relative flex flex-col items-center">
            <Image
              src={'/assets/beranda/Galeri/Drone3.png'}
              width={1000}
              height={1000}
              alt="Drone 6"
              className="absolute z-10 h-auto w-full max-w-[15vw]"
            />
            <div className="mt-[4vw] flex h-auto w-full items-center justify-center overflow-hidden rounded-lg">
              <Image
                src={'/assets/beranda/Galeri/Rectangle 1521.png'}
                width={1000}
                height={1000}
                alt="Pic 1"
                className="h-auto max-w-[70%] object-contain"
              />
            </div>
          </div>
        </div>

        {/* Kolom 2 */}
        <div className="float-horizontal-1 relative flex flex-col items-center space-y-[4vw]">
          <Image
            src={'/assets/beranda/Galeri/Drone4.png'}
            width={1000}
            height={1000}
            alt="Drone 6"
            className="absolute z-10 h-auto w-full max-w-[15vw]"
          />
          <div className="flex h-auto w-full items-center justify-center overflow-hidden rounded-lg">
            <Image
              src={'/assets/beranda/Galeri/Rectangle 1522.png'}
              width={1000}
              height={1000}
              alt="Pic 1"
              className="h-auto max-w-[40%] object-contain"
            />
          </div>
        </div>

        {/* Kolom 3 */}
        <div className="mt-[5vw] flex flex-row">
          <div className="float-zigzag relative flex flex-col items-center">
            <Image
              src={'/assets/beranda/Galeri/Drone3.png'}
              width={1000}
              height={1000}
              alt="Drone 6"
              className="absolute z-10 h-auto w-full max-w-[15vw]"
            />
            <div className="mt-[4vw] flex h-auto w-full items-center justify-center overflow-hidden rounded-lg">
              <Image
                src={'/assets/beranda/Galeri/Rectangle 1521.png'}
                width={1000}
                height={1000}
                alt="Pic 1"
                className="h-auto max-w-[70%] object-contain"
              />
            </div>
          </div>
          <div className="float-downup-1 relative flex flex-col items-center">
            <Image
              src={'/assets/beranda/Galeri/Drone6.png'}
              width={1000}
              height={1000}
              alt="Drone 6"
              className="absolute z-10 h-auto w-full max-w-[15vw] scale-x-[-1]"
            />
            <div className="mt-[4vw] flex h-auto w-full items-center justify-center overflow-hidden rounded-lg">
              <Image
                src={'/assets/beranda/Galeri/Rectangle 1524.png'}
                width={1000}
                height={1000}
                alt="Pic 1"
                className="h-auto max-w-[70%] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GaleriMobile;
