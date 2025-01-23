'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

type NescoProps = {
  className?: string;
  shadow?: boolean;
};

export default function LogoNesco({ shadow = false, className = '' }: NescoProps) {
  return (
    <>
      <div className={cn('relative aspect-[1/1] w-[50px]', className)}>
        <div className="absolute bottom-0 left-0 right-0 top-0 z-[12] m-auto aspect-[1/1] w-full">
          <Image
            alt="logo nesco"
            src="/elements/Nesco/logo-nesco.png"
            className={cn(shadow && 'drop-shadow-offset-lg')}
            fill
          />
        </div>
      </div>
    </>
  );
}
