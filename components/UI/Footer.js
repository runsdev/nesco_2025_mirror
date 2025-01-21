'use client';

import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#003C43]">
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
                className="transition-transform group-hover:scale-105"
              />
            </div>
            <div className="pl-3">
              <p className="font-kodeMono text-4xl font-bold text-[#FEDF8D]">NESCO</p>
              <p className="text-right font-kodeMono text-sm font-bold text-[#FEDF8D]">2025</p>
            </div>
          </Link>
        </div>
        {/* Quick Links */}
        <div className="flex-[2] px-5 py-3 text-left md:py-0">
          <h3 className="mb-2 font-montserrat text-xl font-bold text-white">Quick Links</h3>
          <div className="flex flex-col space-y-2">
            <Link
              href="/competition/debate"
              className="font-montserrat text-[#69C7BF] transition-colors hover:text-[#8ED8D1]"
            >
              Debate Competition
            </Link>
            <Link
              href="/competition/electricity"
              className="font-montserrat text-[#69C7BF] transition-colors hover:text-[#8ED8D1]"
            >
              Electricity Innovation Competition
            </Link>
            <Link
              href="/competition/paper"
              className="font-montserrat text-[#69C7BF] transition-colors hover:text-[#8ED8D1]"
            >
              Paper Competition
            </Link>
            <Link
              href="/competition/poster"
              className="font-montserrat text-[#69C7BF] transition-colors hover:text-[#8ED8D1]"
            >
              Poster Competition
            </Link>
            <Link
              href="/seminar"
              className="font-montserrat text-[#69C7BF] transition-colors hover:text-[#8ED8D1]"
            >
              National Seminar
            </Link>
          </div>
        </div>
        {/* Find Us */}
        <div className="flex-1 px-5 py-3 text-left md:py-0">
          <h3 className="mb-2 font-montserrat text-xl font-bold text-white">Find Us</h3>
          <div className="flex flex-col space-y-2">
            <Link
              href="https://instagram.com/nesco"
              target="_blank"
              rel="noopener noreferrer"
              className="font-montserrat text-[#69C7BF] transition-colors hover:text-[#8ED8D1]"
            >
              Instagram
            </Link>
            <Link
              href="https://tiktok.com/@nesco"
              target="_blank"
              rel="noopener noreferrer"
              className="font-montserrat text-[#69C7BF] transition-colors hover:text-[#8ED8D1]"
            >
              Tiktok
            </Link>
            <Link
              href="https://youtube.com/@nesco"
              target="_blank"
              rel="noopener noreferrer"
              className="font-montserrat text-[#69C7BF] transition-colors hover:text-[#8ED8D1]"
            >
              Youtube
            </Link>
            <Link
              href="https://twitter.com/nesco"
              target="_blank"
              rel="noopener noreferrer"
              className="font-montserrat text-[#69C7BF] transition-colors hover:text-[#8ED8D1]"
            >
              Twitter
            </Link>
            <Link
              href="https://linkedin.com/company/nesco"
              target="_blank"
              rel="noopener noreferrer"
              className="font-montserrat text-[#69C7BF] transition-colors hover:text-[#8ED8D1]"
            >
              LinkedIn
            </Link>
          </div>
        </div>

        {/* Contact Us */}
        <div className="flex-1 px-5 py-3 text-left md:py-0">
          <h3 className="mb-2 font-montserrat text-xl font-bold text-white">Contact Us</h3>
          <Link
            href="mailto:nesco@mail.ugm.ac.id"
            className="font-montserrat text-[#69C7BF] transition-colors hover:text-[#8ED8D1]"
          >
            nesco@mail.ugm.ac.id
          </Link>
        </div>
      </div>
      {/* Kota */}
      <div className="flex w-full justify-start">
        <Image
          src="/Union.png"
          alt="Kota"
          width={760}
          height={101}
          className="w-full object-cover md:hidden"
        />
      </div>
    </footer>
  );
};
