'use client';

import { useState } from 'react';
import Link from 'next/link';
import nesco from '@/public/nesco.png';
import Image from 'next/image';
import { IoIosArrowDown } from 'react-icons/io';
import { motion } from 'framer-motion';

const routes = [
  {
    name: 'COMPETITION',
    href: '/competition',
    child: [
      {
        name: 'Debate Competition',
        href: '/competition/debate',
      },
      {
        name: 'Electricity Innovation Competition',
        href: '/competition/electricity',
      },
      {
        name: 'Paper Competition',
        href: '/competition/paper',
      },
      {
        name: 'Poster Competition',
        href: '/competition/poster',
      },
    ],
  },
  {
    name: 'SEMINAR',
    href: '/seminar',
  },
  {
    name: 'FAQ',
    href: '/faq',
  },
];

/* Navbar Desktop */
const DesktopMenu = ({ openDropdown, toggleMainDropdown }) => (
  <ul className="items-center space-x-[4vw] text-[1.7vw] font-bold text-darkblue md:flex 2xl:text-[1.1vw]">
    {routes.map((route, index) => (
      <li
        key={index}
        className="group relative leading-[4vw]"
        onBlur={() => toggleMainDropdown(null)}
      >
        {route.child ? (
          <>
            <button
              className={`flex w-full items-center gap-1 capitalize transition duration-200 ease-in-out focus:outline-none ${openDropdown === index ? 'text-lightblue' : 'text-normal'}`}
              onClick={() => toggleMainDropdown(openDropdown === index ? null : index)}
              onMouseEnter={() => toggleMainDropdown(index)}
            >
              {route.name}
              <IoIosArrowDown
                style={{
                  transform: openDropdown === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.4s ease-in-out',
                }}
              />
            </button>

            {/* Dropdown Menu */}
            <motion.div
              className={`absolute left-[-70%] z-10 mt-2 w-fit overflow-hidden rounded-lg bg-lightyellow px-4 py-2 shadow-md ${openDropdown === index ? 'visibility-visible opacity-100' : 'opacity-0'}`}
              initial={{ height: 0 }}
              animate={{
                height: openDropdown === index ? 'auto' : 0,
                opacity: openDropdown === index ? 1 : 0,
              }}
              transition={{ ease: 'linear', duration: 0.4 }}
            >
              <ul>
                <div className="my-[0.6vw] h-[0.8vw] border-b-[0.3vw] border-t-[0.3vw] border-chart-2" />
                {route.child.map((child, childIndex) => (
                  <li
                    key={childIndex}
                    className="text-nowrap py-[0.5vw] !font-montserrat text-[1.7vw] !leading-none opacity-70 duration-200 ease-in-out hover:opacity-100 2xl:text-[1.1vw]"
                  >
                    <Link href={child.href} className="block">
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        ) : (
          <Link
            href={route.href}
            className="transition duration-300 ease-in-out hover:text-lightblue"
          >
            {route.name}
          </Link>
        )}
      </li>
    ))}
  </ul>
);

/* Navbar Mobile  */
const MobileMenu = ({ openDropdown, toggleMainDropdown, openChild, toggleChildDropdown }) => (
  <div className="md:hidden">
    <div className="relative mx-auto flex items-center justify-between px-6 py-2">
      <div className="flex flex-row items-center gap-[1vw] text-[5vw] font-bold text-darkblue">
        <Image src={nesco} alt="NESCO" width={100} height={100} className="h-auto w-[6vw]" />
        NESCO
      </div>
      <div>
        <button onClick={() => toggleMainDropdown(!openDropdown)}>
          <IoIosArrowDown
            className={`text-[4.2vw] transition-transform duration-500 ease-in-out ${openDropdown ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </div>

    {/* Dropdown Menu */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: openDropdown ? 1 : 0, y: openDropdown ? 0 : -20 }}
      transition={{ ease: 'linear', duration: 0.3 }}
    >
      {openDropdown && (
        <ul className="absolute left-0 top-full z-10 flex w-full flex-row items-center justify-between border-b-2 border-white bg-lightyellow px-6 pb-2 text-[2.8vw] font-bold text-darkblue">
          {routes.map((route, index) => (
            <li key={index} className="group relative">
              {route.child ? (
                <>
                  {/* Parent Dropdown */}
                  <button
                    onClick={() => toggleChildDropdown(openChild === index ? null : index)}
                    onBlur={() => toggleChildDropdown(null)}
                    className={`flex items-center gap-1 transition duration-200 ease-in-out hover:text-lightblue focus:outline-none ${openChild === index ? 'text-lightblue' : 'text-normal'}`}
                  >
                    {route.name}
                    <IoIosArrowDown
                      className={`transition-transform duration-500 ease-in-out ${openChild === index ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Child Dropdown */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: openChild === index ? 'auto' : 0,
                      opacity: openChild === index ? 1 : 0,
                    }}
                    transition={{ ease: 'linear', duration: 0.4 }}
                  >
                    {openChild === index && (
                      <ul className="absolute top-[170%] z-10 mt-2 w-fit rounded-lg bg-lightyellow px-[1.6vw] py-[1.6vw] shadow-lg sm:top-[150%]">
                        <div className="my-[0.5vw] h-[1.5vw] border-b-[0.5vw] border-t-[0.5vw] border-blue" />
                        {route.child.map((child, childIndex) => (
                          <li
                            key={childIndex}
                            className="text-nowrap pt-[0.6vw] !font-montserrat text-[2vw] text-darkblue duration-200 ease-in-out hover:text-lightblue"
                          >
                            <Link href={child.href} className="block">
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                </>
              ) : (
                <Link
                  href={route.href}
                  className="transition duration-200 ease-in-out hover:text-lightblue focus:outline-none"
                >
                  {route.name}
                </Link>
              )}
            </li>
          ))}
          <Link href="/">
            <button className="rounded-sm bg-lightblue px-2 py-1 font-bold text-black transition duration-200 ease-in-out hover:bg-blue active:bg-darkyellow">
              Sign In
            </button>
          </Link>
        </ul>
      )}
    </motion.div>
  </div>
);

export const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openChild, setopenChild] = useState(null);

  const toggleMainDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? false : index);
    setopenChild(null);
  };
  const toggleChildDropdown = (index) => setopenChild(openChild === index ? null : index);

  return (
    <nav className="relative left-0 top-0 z-50 w-full border-b-2 border-white bg-lightyellow font-kodeMono">
      <div>
        {/* Logo */}
        <div className="relative mx-auto hidden items-center justify-between px-6 md:flex">
          <div className="my-[0.3vw] flex flex-row items-center gap-[1vw] text-[2.3vw] font-bold text-darkblue">
            <Image
              src={nesco}
              alt="NESCO"
              width={100}
              height={100}
              className="h-auto w-[3.3vw] md:w-[2.8vw]"
            />
            NESCO
          </div>

          {/* Desktop Menu */}
          <DesktopMenu openDropdown={openDropdown} toggleMainDropdown={toggleMainDropdown} />

          <Link href="/">
            <button className="rounded-sm bg-lightblue px-2 py-[0.3vw] text-[1.8vw] font-bold text-black transition duration-500 ease-in-out hover:bg-blue active:bg-darkyellow 2xl:text-[1.2vw]">
              Sign In
            </button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          openDropdown={openDropdown}
          toggleMainDropdown={toggleMainDropdown}
          openChild={openChild}
          toggleChildDropdown={toggleChildDropdown}
        />
      </div>
    </nav>
  );
};
