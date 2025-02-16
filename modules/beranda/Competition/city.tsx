'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Car } from '@/components/Element';
import Image from 'next/image';

const variants: Variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  animate: { x: 0, opacity: 1 },
};

const City = ({ direction }: { direction: number }) => {
  return (
    <div className="relative w-full h-[200px] mt-4"> {/* Reduced height */}
      {/* Jalan */}
      <motion.div
        custom={direction}
        initial="initial"
        animate="animate"
        variants={variants}
        transition={{ duration: 0.4 }}
        className="absolute bottom-0 left-0 right-0 h-[100px]"
      >
        <div className="relative w-full h-full">
          <Image
            alt="jalan"
            src="/assets/beranda/Competition/jalan.svg"
            fill
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* Gedung */}
      <motion.div
        custom={direction}
        initial="initial"
        animate="animate"
        variants={variants}
        transition={{ duration: 0.4 }}
        className="absolute bottom-[40px] left-0 right-0 h-[150px]"
      >
        <div className="relative w-full h-full">
          <Image
            alt="gedung 1"
            src="/assets/beranda/Competition/gedung.svg"
            fill
            className="object-contain"
          />
        </div>
      </motion.div>

      {/* Mobil */}
      <motion.div
        custom={direction}
        initial="initial"
        animate="animate"
        variants={variants}
        transition={{ duration: 0.4 }}
        className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-[120px]"
      >
        <Car variant="blue" right={true} className="w-full" />
      </motion.div>
    </div>
  );
};

export default City;