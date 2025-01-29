'use client';

import Image from 'next/image';
import Link from 'next/link';
import LogoNesco from '../Element/LogoNesco';

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
    <div className="group relative aspect-[163/71] w-[50%] overflow-clip">
      <LogoNesco className="absolute bottom-0 left-0 top-0 my-auto w-[31.9%] transition duration-500 group-hover:scale-110" />
      <div className="absolute bottom-0 right-0 top-0 my-auto mt-[4%] font-kodeMono text-[9.5vw] font-bold text-lightyellow transition duration-500 group-hover:text-white md:text-[3.5vw]">
        NESCO
      </div>
      <div className="absolute bottom-0 right-0 top-0 mt-[27%] font-kodeMono text-[2.8vw] font-bold text-lightyellow transition duration-500 group-hover:text-white md:mt-[25%] md:text-[1.4vw]">
        2025
      </div>
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="relative flex w-full flex-row items-center justify-center bg-[#003C43]">
      <div className="mb-[20%] flex w-[90%] flex-col justify-between space-x-0 space-y-[3%] py-[1%] md:mb-[0.5%] md:flex-row md:space-x-[1%] md:space-y-0">
        {/* Logo dan Nesco*/}
        <div className="flex-[3]">
          <TulisanNesco />
        </div>

        {/* Quick Links */}
        <div className="flex-[2] py-[1%] text-left md:px-[1%] md:py-0">
          <h3 className="mb-[3%] font-montserrat text-[5vw] font-bold text-white md:text-[1.2vw]">
            Quick Links
          </h3>
          <div className="flex flex-col space-y-[3%] text-[4vw] md:space-y-[1%] md:text-[0.9vw]">
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
        <div className="flex-[1] py-[1%] text-left md:px-[1%] md:py-0">
          <h3 className="mb-[3%] font-montserrat text-[5vw] font-bold text-white md:text-[1.2vw]">
            Find Us
          </h3>
          <div className="flex flex-col space-y-[3%] text-[4vw] md:space-y-[1%] md:text-[0.9vw]">
            {socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-montserrat text-[#69C7BF] transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Us */}
        <div className="flex-[1] py-[1%] text-left md:px-[1%] md:py-0">
          <h3 className="mb-[3%] font-montserrat text-[5vw] font-bold text-white md:text-[1.2vw]">
            Contact Us
          </h3>
          <Link
            href="mailto:nesco@mail.ugm.ac.id"
            className="font-montserrat text-[4vw] text-[#69C7BF] transition-colors hover:text-white md:text-[0.9vw]"
          >
            nesco@mail.ugm.ac.id
          </Link>
        </div>
      </div>
      {/* Kota */}
      <div className="absolute bottom-0 left-0 w-full justify-start md:w-[40%]">
        <Image
          src="/Union.png"
          alt="Cityscape"
          width={760}
          height={101}
          className="w-full object-cover"
        />
      </div>
    </footer>
  );
};
