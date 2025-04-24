'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoIosArrowDown } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoNesco } from '@/components/Element/index';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

const routes = [
  {
    name: 'COMPETITION',
    href: '/competition',
    child: [
      // {
      //   name: 'Scientific Debate',
      //   href: '/competition/debate',
      // },
      {
        name: 'Innovation Challenge',
        href: '/competition/innovation',
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

const userChild = [
  { name: 'Dashboard', href: '/dashboard', isButton: false },
  { name: 'Logout', href: null, isButton: true },
];

/* Navbar Desktop */
const DesktopMenu = ({ openDropdown, toggleMainDropdown }) => (
  <ul className="items-center space-x-[4vw] text-[1.8vw] font-bold text-darkblue md:flex xl:text-[1.2vw]">
    {routes.map((route, index) => (
      <li
        key={index}
        className="group relative leading-[7.3vw] xl:leading-[5.3vw]"
        onMouseEnter={() => toggleMainDropdown(openDropdown === index ? null : index)}
        onMouseLeave={() => toggleMainDropdown(openDropdown === index ? null : index)}
      >
        {route.child ? (
          <>
            <div
              className={`flex w-full items-center gap-1 capitalize transition duration-200 ease-in-out hover:text-lightblue focus:outline-none ${openDropdown === index ? 'text-lightblue' : 'text-normal'}`}
            >
              {route.name}
              <IoIosArrowDown
                style={{
                  transform: openDropdown === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.4s ease-in-out',
                }}
              />
            </div>

            {/* Dropdown Menu */}
            <motion.div
              className={`absolute left-[-30%] z-10 mt-2 w-fit overflow-hidden rounded-lg bg-lightyellow px-4 py-2 text-center shadow-md ${openDropdown === index ? 'visibility-visible opacity-100' : 'opacity-0'}`}
              initial={{ height: 0 }}
              animate={{
                height: openDropdown === index ? 'auto' : 0,
                opacity: openDropdown === index ? 1 : 0,
              }}
              transition={{ ease: 'linear', duration: 0.27 }}
            >
              <ul>
                {route.child.map((child, childIndex) => (
                  <li
                    key={childIndex}
                    className="text-nowrap py-[0.5vw] !font-montserrat text-[1.6vw] !leading-none opacity-70 duration-500 ease-in-out hover:text-lightblue hover:opacity-100 xl:text-[1.1vw]"
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
const MobileMenu = ({
  openDropdown,
  toggleMainDropdown,
  openChild,
  toggleChildDropdown,
  toggleLoginDropdown,
  loginOpenDropdown,
  user,
}) => (
  <div className="z-[100] md:hidden">
    <div className="relative z-[100] mx-auto flex items-center justify-between px-6 py-2">
      <Link href="/" className="group flex cursor-pointer items-center space-x-2">
        <LogoNesco className="w-[7vw] transition-transform duration-500 group-hover:scale-[1.05]" />
        <span className="text-[5vw] font-bold text-darkblue transition-colors duration-500 group-hover:text-blue">
          NESCO
        </span>
      </Link>

      <button onClick={() => toggleMainDropdown(!openDropdown)}>
        <IoIosArrowDown
          className={`text-[4.2vw] transition-transform duration-500 ease-in-out ${openDropdown ? 'rotate-180' : ''}`}
        />
      </button>
    </div>

    {/* Dropdown Menu */}
    <AnimatePresence>
      {openDropdown && (
        <motion.div
          // key="main-dropdown"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ ease: 'linear', duration: 0.3 }}
          className="absolute left-0 top-full z-[97] w-full bg-lightyellow"
        >
          <ul className="z-[97] flex flex-row items-center justify-between px-6 pb-[2vw] text-[2.8vw] font-bold text-darkblue">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex w-[23vw] items-center justify-center space-x-2 rounded-md bg-lightblue py-1 font-bold text-darkblue transition duration-500 ease-in-out hover:bg-blue hover:text-lightyellow active:bg-darkyellow"
                  onClick={() => toggleLoginDropdown()}
                  onBlur={() => toggleLoginDropdown()}
                >
                  <Image
                    src={user?.user_metadata?.avatar_url || ''}
                    alt="User Avatar"
                    width={500}
                    height={500}
                    className="h-auto w-[5vw] rounded-full"
                  />
                  <IoIosArrowDown
                    className={`transition-transform duration-500 ease-in-out ${loginOpenDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                <motion.div
                  className={`absolute left-0 right-0 z-10 mt-[3vw] w-[23vw] overflow-hidden rounded-lg bg-lightyellow p-[0.5vw] text-center shadow-md transition-opacity duration-500 ${
                    loginOpenDropdown ? 'visible opacity-100' : 'invisible opacity-0'
                  }`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: loginOpenDropdown ? 'auto' : 0,
                    opacity: loginOpenDropdown ? 1 : 0,
                  }}
                >
                  {userChild.map((item, index) =>
                    item.isButton ? (
                      <button
                        key={index}
                        type="button"
                        className="block w-full text-nowrap px-4 pb-3 text-left !font-montserrat text-[2.2vw] font-bold !leading-none text-darkblue opacity-70 transition-all duration-200 ease-in-out hover:text-lightblue hover:opacity-100"
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setUser(null);
                        }}
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        key={index}
                        href={item.href}
                        className="block w-full text-nowrap px-4 py-3 text-left !font-montserrat text-[2.2vw] font-bold !leading-none text-darkblue opacity-70 transition-all duration-200 ease-in-out hover:text-lightblue hover:opacity-100"
                      >
                        {item.name}
                      </Link>
                    ),
                  )}
                </motion.div>
              </div>
            ) : (
              <button
                type="button"
                className="rounded-md bg-lightblue px-[2.5vw] py-1 font-bold text-darkblue transition duration-500 ease-in-out hover:bg-blue hover:text-lightyellow active:bg-darkyellow"
              >
                <Link href="/auth/sign-in">
                  <p>SIGN IN</p>
                </Link>
              </button>
            )}
            {routes.map((route, index) => (
              <li key={index} className="group relative">
                {route.child ? (
                  <>
                    {/* Parent Dropdown */}
                    <button
                      onClick={() => toggleChildDropdown(openChild === index ? null : index)}
                      onBlur={() => toggleChildDropdown(null)}
                      className={`flex items-center gap-1 transition duration-500 ease-in-out hover:text-lightblue focus:outline-none ${openChild === index ? 'text-lightblue' : 'text-normal'}`}
                    >
                      {route.name}
                      <IoIosArrowDown
                        className={`transition-transform duration-500 ease-in-out ${openChild === index ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Child Dropdown */}
                    <AnimatePresence>
                      {openChild === index && (
                        <motion.div
                          className="absolute left-[-20%] top-[170%] z-10 mt-2 w-fit overflow-hidden rounded-lg bg-lightyellow px-[1.6vw] py-[1.6vw] text-center shadow-lg sm:top-[150%]"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ ease: 'linear', duration: 0.4 }}
                        >
                          <ul>
                            {route.child.map((child, childIndex) => (
                              <li
                                key={childIndex}
                                className="text-nowrap py-[1.2vw] !font-montserrat text-[2.2vw] text-darkblue duration-200 ease-in-out hover:text-lightblue"
                              >
                                <Link href={child.href} className="block">
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={route.href}
                    className="transition duration-500 ease-in-out hover:text-lightblue focus:outline-none"
                  >
                    {route.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const Navbar = () => {
  const [loginOpenDropdown, setLoginOpenDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openChild, setopenChild] = useState(null);
  const [user, setUser] = useState(null);

  const toggleMainDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? false : index);
    setopenChild(null);
  };

  const toggleChildDropdown = (index) => setopenChild(openChild === index ? null : index);
  const toggleLoginDropdown = () => setLoginOpenDropdown(!loginOpenDropdown);

  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }

    fetchUser();
  }, [supabase.auth]);

  return (
    <nav className="fixed left-0 top-0 z-[100] w-full bg-lightyellow font-kodeMono drop-shadow-offset">
      <div className="z-[100]">
        {/* Logo */}
        <div className="relative z-[999] mx-auto hidden items-center justify-between px-[4vw] md:flex">
          <Link
            href="/"
            className="group relative flex cursor-pointer items-center space-x-3 2xl:space-x-4"
          >
            <LogoNesco className="relative w-[4.5vw] transition-transform duration-500 group-hover:scale-[1.1] xl:w-[3.8vw]" />
            <span className="text-[3.5vw] font-bold text-darkblue transition-colors duration-500 group-hover:text-blue xl:text-[2.5vw]">
              NESCO
            </span>
          </Link>

          {/* Desktop Menu */}
          <DesktopMenu openDropdown={openDropdown} toggleMainDropdown={toggleMainDropdown} />

          {user ? (
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 rounded-md bg-lightblue px-[2.7vw] py-[0.5vw] text-[1.6vw] font-bold text-darkblue transition duration-500 ease-in-out hover:bg-blue hover:text-lightyellow hover:shadow-2xl active:bg-darkyellow xl:text-[1.1vw]"
                onClick={() => toggleLoginDropdown()}
              >
                <Image
                  src={user?.user_metadata?.avatar_url || ''}
                  width={500}
                  height={500}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full"
                />
                <IoIosArrowDown
                  className={`transition-transform duration-500 ease-in-out ${openDropdown ? 'rotate-180' : ''}`}
                />
              </button>
              <motion.div
                className={`absolute left-0 right-0 z-10 mt-[3vw] w-fit overflow-hidden rounded-lg bg-lightyellow px-[1.5vw] py-2 text-center shadow-md transition-opacity duration-500 ease-in-out xl:mt-[2vw] xl:px-[22px] ${
                  loginOpenDropdown ? 'visible opacity-100' : 'invisible·opacity-0'
                }`}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: loginOpenDropdown ? 'auto' : 0,
                  opacity: loginOpenDropdown ? 1 : 0,
                }}
              >
                {userChild.map((item, index) =>
                  item.isButton ? (
                    <button
                      key={index}
                      type="button"
                      className="block w-full text-nowrap py-3 text-left !font-montserrat text-[1.5vw] font-bold !leading-none text-darkblue opacity-70 transition-all duration-200 ease-in-out hover:text-lightblue hover:opacity-100 xl:text-[1.1vw]"
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setUser(null);
                      }}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={index}
                      href={item.href}
                      className="block w-full text-nowrap py-3 text-left !font-montserrat text-[1.5vw] font-bold !leading-none text-darkblue opacity-70 transition-all duration-200 ease-in-out hover:text-lightblue hover:opacity-100 xl:text-[1.1vw]"
                    >
                      {item.name}
                    </Link>
                  ),
                )}
              </motion.div>
            </div>
          ) : (
            <button
              type="button"
              className="rounded-md bg-lightblue px-[2.7vw] py-[0.5vw] text-[1.6vw] font-bold text-darkblue transition-all duration-500 ease-in-out hover:bg-blue hover:text-lightyellow hover:shadow-2xl active:bg-darkyellow xl:text-[1.1vw]"
            >
              <Link href="/auth/sign-in">
                <p className="transition-all duration-500 ease-in-out hover:scale-105">SIGN IN</p>
              </Link>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          openDropdown={openDropdown}
          toggleMainDropdown={toggleMainDropdown}
          openChild={openChild}
          toggleChildDropdown={toggleChildDropdown}
          toggleLoginDropdown={toggleLoginDropdown}
          loginOpenDropdown={loginOpenDropdown}
          user={user}
        />
      </div>
    </nav>
  );
};
