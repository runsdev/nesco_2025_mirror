'use client';

import Image from 'next/image';
import Link from 'next/link';

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

export const Footer = () => {
  return (
    <footer className="relative w-full bg-[#003C43]">
      <div className="container mx-auto flex max-w-screen-2xl flex-col justify-between px-8 py-10 md:flex-row">
        {/* Logo dan Nesco*/}
        <div className="flex-[3] px-5 py-3 md:py-0">
          <Link href="/" className="group flex flex-row items-center">
            <div>
              <Image
                src="/apple-touch-icon.png"
                alt="Logo NESCO"
                height={90}
                width={90}
                className="transition duration-500 group-hover:scale-110"
              />
            </div>
            <div className="pl-4 pt-[3vw] transition duration-500 group-hover:scale-110 sm:pt-[2vw] md:pt-[1.5vw] lg:pt-[1vw]">
              <p className="font-kodeMono text-[6vw] font-bold text-[#FEDF8D] transition duration-500 group-hover:text-white sm:text-[4.5vw] md:text-[3vw] lg:text-[2vw]">
                NESCO
              </p>
              <p className="text-right font-kodeMono text-[3vw] font-bold text-[#FEDF8D] transition duration-500 group-hover:text-white sm:text-[2.5vw] md:text-[2vw] lg:text-[1.2vw]">
                2025
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="flex-[2] px-5 py-3 text-left md:py-0">
          <h3 className="mb-2 font-montserrat text-[5vw] font-bold text-white sm:text-[4vw] md:text-[2.8vw] lg:text-[1.8vw]">
            Quick Links
          </h3>
          <div className="flex flex-col space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-montserrat text-[4vw] text-[#69C7BF] transition-colors hover:text-white sm:text-[3vw] md:text-[2.5vw] lg:text-[1.5vw]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Find Us */}
        <div className="flex-1 px-5 py-3 text-left md:py-0">
          <h3 className="mb-2 font-montserrat text-[5vw] font-bold text-white sm:text-[4vw] md:text-[2.8vw] lg:text-[1.8vw]">
            Find Us
          </h3>
          <div className="flex flex-col space-y-2">
            {socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-montserrat text-[4vw] text-[#69C7BF] transition-colors hover:text-white sm:text-[3vw] md:text-[2.5vw] lg:text-[1.5vw]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Us */}
        <div className="flex-1 px-5 py-3 text-left md:py-0">
          <h3 className="mb-2 font-montserrat text-[5vw] font-bold text-white sm:text-[4vw] md:text-[2.8vw] lg:text-[1.8vw]">
            Contact Us
          </h3>
          <Link
            href="mailto:nesco@mail.ugm.ac.id"
            className="font-montserrat text-[4vw] text-[#69C7BF] transition-colors hover:text-white sm:text-[3vw] md:text-[2.5vw] lg:text-[1.5vw]"
          >
            nesco@mail.ugm.ac.id
          </Link>
        </div>
      </div>
      {/* Kota */}
      <div className="absolute bottom-0 left-0 w-full justify-start md:w-[40%]">
        <Image
          src="/Union.png"
          alt="Kota"
          width={760}
          height={101}
          className="w-full object-cover"
        />
      </div>
    </footer>
  );
};
