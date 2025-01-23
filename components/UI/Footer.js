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
            <div className="pl-4 pt-3 transition duration-500 group-hover:scale-110">
              <p className="font-kodeMono text-[8vw] font-bold text-[#FEDF8D] transition duration-500 group-hover:text-white md:text-6xl">
                NESCO
              </p>
              <p className="text-right font-kodeMono text-[3vw] font-bold text-[#FEDF8D] transition duration-500 group-hover:text-white md:text-sm">
                2025
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="flex-[2] px-5 py-3 text-left md:py-0">
          <h3 className="mb-2 font-montserrat text-[3vw] font-bold text-white md:text-xl">
            Quick Links
          </h3>
          <div className="flex flex-col space-y-2 text-[2vw] md:text-sm">
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
        <div className="flex-1 px-5 py-3 text-left md:py-0">
          <h3 className="mb-2 font-montserrat text-[3vw] font-bold text-white md:text-xl">
            Find Us
          </h3>
          <div className="flex flex-col space-y-2 text-[2vw] md:text-sm">
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
        <div className="flex-1 px-5 py-3 pb-20 text-left sm:pb-24 md:py-0">
          <h3 className="mb-2 font-montserrat text-[3vw] font-bold text-white md:text-xl">
            Contact Us
          </h3>
          <Link
            href="mailto:nesco@mail.ugm.ac.id"
            className="font-montserrat text-[2vw] text-[#69C7BF] transition-colors hover:text-white md:text-sm"
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
