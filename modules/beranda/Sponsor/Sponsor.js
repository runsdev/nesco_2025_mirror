import Image from 'next/image';

export const Sponsor = () => {
  // Top row sponsors (2 main)
  const topRowSponsors = [
    { id: 'pln', size: 'huge' },
    { id: 'paiton', size: 'huge' },
  ];

  // Bottom row - first sponsor
  const bottomMainSponsor = { id: 'pln-mobile', size: 'small' };

  // Triangle sponsors (for bottom row)
  const triangleSponsors = [
    { id: 'petrokimia', size: 'small' },
    { id: 'metafora', size: 'small' },
    { id: 'ourwear', size: 'small' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#61CCC2] to-[#FFE08D] text-center text-[50px] font-[700]">
      {/* Background elements */}
      <div className="absolute h-full w-full overflow-x-clip overflow-y-clip">
        <Image
          data-aos="fade-right"
          src="/assets/beranda/sponsor/Kiri.webp"
          alt="Kiri"
          width={1301}
          height={528}
          className="absolute bottom-[-14vw] left-[0%] w-[70vw] md:bottom-[-15vw] lg:bottom-[-20%] xl:bottom-[-22%] 2xl:bottom-[-33%]"
        />
        <Image
          data-aos="fade-left"
          src="/assets/beranda/sponsor/Kanan.webp"
          alt="Kanan"
          width={623}
          height={612}
          className="absolute bottom-[-14vw] right-[0%] w-[35vw] md:bottom-[-15vw] lg:bottom-[-20%] xl:bottom-[-22%] 2xl:bottom-[-30%]"
        />
        <Image
          src="/assets/beranda/sponsor/RumputKanan.webp"
          alt="RumputKanan"
          width={455}
          height={151}
          className="absolute bottom-[-2%] right-[0%] w-[26vw] md:bottom-[-7%] lg:bottom-[-6%] xl:bottom-[-7%]"
        />
      </div>

      {/* Pohon */}
      <Image
        data-aos="fade-right"
        src="/assets/beranda/sponsor/Tree.svg"
        alt="Tree"
        width={1420}
        height={1217}
        className="absolute bottom-[-1%] left-[-19%] w-[70vw] sm:bottom-[-3%] md:bottom-[-3%] lg:bottom-[-6%] xl:bottom-[-8%] 2xl:bottom-[-10%]"
      />

      <Image
        src="/assets/beranda/sponsor/RumputKiri.webp"
        alt="RumputKiri"
        width={467}
        height={151}
        className="absolute bottom-[-2%] left-[-2%] w-[28vw] md:bottom-[-6%] lg:bottom-[-6%] xl:bottom-[-8%]"
      />

      <Image
        data-aos="zoom-in-up"
        data-aos-duration="1000"
        src="/assets/beranda/sponsor/Birds.png"
        alt="Birds"
        width={106}
        height={109}
        className="absolute left-[75%] top-[10%] w-[15vw] md:left-[80%] md:top-[15%] md:w-[8vw]"
      />

      <div className="relative flex w-full flex-col items-center justify-center gap-[5vw] py-20 lg:pt-[10vw] 2xl:pt-[5vw]">
        <h1 className="relative font-kodeMono text-[6vw] font-bold drop-shadow-lg lg:text-[4vw]">
          Sponsored By
        </h1>

        <div className="flex w-[90%] flex-col items-center justify-center space-y-8 rounded-xl backdrop-blur-xl lg:w-[80%]">
          {/* Top row - 2 main sponsors */}
          <div className="flex flex-row items-center justify-center space-x-8 md:space-x-16 lg:space-x-24">
            {topRowSponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="flex h-[100px] w-[160px] items-center justify-center md:h-[120px] md:w-[200px] lg:h-[140px] lg:w-[240px]"
              >
                <Image
                  alt={sponsor.id}
                  src={`/sponsor/${sponsor.id}.png`}
                  width={240}
                  height={140}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>

          {/* Bottom row - 1 main sponsor + triangle */}
          <div className="flex flex-row items-center justify-center space-x-8 md:space-x-16 lg:space-x-24">
            {/* Bottom row main sponsor */}
            <div className="flex h-[60px] w-[100px] items-center justify-center md:h-[80px] md:w-[120px] lg:h-[100px] lg:w-[140px]">
              <Image
                alt={bottomMainSponsor.id}
                src={`/sponsor/${bottomMainSponsor.id}.png`}
                width={140}
                height={100}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Triangle sponsors */}
            <div className="flex flex-col items-center justify-center">
              {/* Top of triangle */}
              <div className="mb-2 flex h-[50px] w-[80px] items-center justify-center md:h-[60px] md:w-[100px] lg:h-[70px] lg:w-[120px]">
                <Image
                  alt={triangleSponsors[0].id}
                  src={`/sponsor/${triangleSponsors[0].id}.png`}
                  width={120}
                  height={70}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Bottom of triangle (2 side-by-side) */}
              <div className="flex flex-row items-center justify-center space-x-2 md:space-x-4">
                {triangleSponsors.slice(1).map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="flex h-[50px] w-[80px] items-center justify-center md:h-[60px] md:w-[100px] lg:h-[70px] lg:w-[120px]"
                  >
                    <Image
                      alt={sponsor.id}
                      src={`/sponsor/${sponsor.id}.png`}
                      width={120}
                      height={70}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
