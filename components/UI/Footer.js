'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LogoNesco } from '@/components/Element/index';

const quickLinks = [
  { href: '/competition/debate', label: 'Debate Competition' },
  { href: '/competition/electricity', label: 'Electricity Innovation Competition' },
  { href: '/competition/paper', label: 'Paper Competition' },
  { href: '/competition/poster', label: 'Poster Competition' },
  { href: '/seminar', label: 'National Seminar' },
];

const socialLinks = [
  { href: 'https://instagram.com/nesco', label: 'Instagram' },
  { href: 'https://tiktok.com/@nesco', label: 'Tiktok' },
  { href: 'https://youtube.com/@nesco', label: 'Youtube' },
  { href: 'https://twitter.com/nesco', label: 'Twitter' },
  { href: 'https://linkedin.com/company/nesco', label: 'LinkedIn' },
];

const TulisanNesco = () => {
  return (
    <Link
      href="/"
      className="group relative flex aspect-[288/98] flex-row overflow-clip md:w-[30%]"
    >
      <LogoNesco className="relative bottom-0 left-0 top-0 my-auto w-[31.25%] transition duration-500 group-hover:scale-110" />
      <div className="relative w-[70%]">
        <h2 className="absolute right-0 top-[-6%] my-auto mt-[4%] font-kodeMono text-[9.5vw] font-bold text-lightyellow transition duration-500 group-hover:text-white md:text-[2.82vw]">
          NESCO
        </h2>
        <h3 className="absolute bottom-[1%] right-0 font-kodeMono text-[2.8vw] font-bold text-lightyellow transition duration-500 group-hover:text-white md:text-[0.9vw]">
          2025
        </h3>
      </div>
    </Link>
  );
};

export const Footer = () => {
  return (
    <>
      <footer className="relative flex w-full flex-row items-center justify-center bg-darkblue md:h-[13dvh] lg:h-[24.5dvh] xl:h-[27dvh]">
        <div className="mb-[20%] flex w-[90%] flex-col justify-between space-x-0 space-y-[5%] py-[1%] md:mb-[0.5%] md:flex-row md:space-x-[1%] md:space-y-0">
          {/* Logo dan Nesco*/}
          <div className="w-[50%] max-md:mt-[5%]">
            <TulisanNesco />
          </div>
          <div className="flex w-full flex-col justify-between max-md:pl-[2%] md:w-[50%] md:flex-row">
            {/* Quick Links */}
            <div className="flex-[2] py-[1%] text-left max-md:mt-[5%] md:px-[1%] md:py-0">
              <h3 className="mb-[3%] font-montserrat text-[5vw] font-bold text-white md:text-[1.2vw]">
                Quick Links
              </h3>
              <div className="flex flex-col space-y-[3%] text-[4vw] md:text-[0.9vw]">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-montserrat text-[#69C7BF] transition-colors hover:text-white"
                  >
                    <p>{link.label}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Find Us */}
            <div className="flex-[1] py-[1%] text-left max-md:mt-[8%] md:px-[1%] md:py-0">
              <h3 className="mb-[3%] font-montserrat text-[5vw] font-bold text-white md:text-[1.2vw]">
                Find Us
              </h3>
              <div className="flex flex-col space-y-[3%] text-[4vw] md:text-[0.9vw]">
                {socialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-montserrat text-[#69C7BF] transition-colors hover:text-white"
                  >
                    <p>{link.label}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Us */}
            <div className="flex-[1] py-[1%] text-left max-md:mt-[8%] md:px-[1%] md:py-0">
              <h3 className="mb-[3%] font-montserrat text-[5vw] font-bold text-white md:text-[1.2vw]">
                Contact Us
              </h3>
              <div className="flex flex-col space-y-[3%] text-[4vw] md:text-[0.9vw]">
                <Link
                  href="mailto:nesco@mail.ugm.ac.id"
                  className="font-montserrat text-[4vw] text-[#69C7BF] transition-colors hover:text-white md:text-[0.9vw]"
                >
                  <p>nesco@mail.ugm.ac.id</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Kota */}
        <div className="absolute bottom-0 left-0 w-full justify-start md:w-[40%]">
          <Image
            src="/Union.png"
            alt="Cityscape"
            width={760}
            height={101}
            className="w-full object-cover drop-shadow-offset-lg"
          />
        </div>
      </footer>
      <h5 className="w-full self-center bg-[#002327] py-3 text-center font-montserrat text-[11.5px] font-[600] text-white lg:text-[13px]">
        Nesco 2025. All Right Reserved.
      </h5>
    </>
  );
};
