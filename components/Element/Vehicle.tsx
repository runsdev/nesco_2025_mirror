'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

type VehicleProps = {
  className?: string;
  variant: 'yellow' | 'blue';
  right?: boolean;
};

export function Car({ right = false, variant = 'yellow', className = '' }: VehicleProps) {
  return (
    <>
      <div className={cn('relative aspect-[111/62] w-[50px]', className)}>
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 top-0 z-[12] m-auto aspect-[111/62] w-full',
            right && 'scale-x-[-1] transform',
          )}
        >
          <Image alt="mobil nesco" src={`/elements/Vehicle/car-${variant}.png`} fill />
        </div>
      </div>
    </>
  );
}

export function Train({ right = false, className = '' }: VehicleProps) {
  return (
    <>
      <div className={cn('relative aspect-[517/51] w-[50px]', className)}>
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 top-0 z-[12] m-auto aspect-[517/51] w-full',
            right && 'scale-x-[-1] transform',
          )}
        >
          <Image alt="kereta kencanku nesco" src="/elements/Vehicle/train.png" fill />
        </div>
      </div>
    </>
  );
}
