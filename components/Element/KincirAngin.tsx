'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

type VehicleProps = {
  className?: string;
  variant?: 'yellow' | 'blue';
  on?: boolean;
  rotateRight?: boolean;
};

export function KincirAngin({
  variant = 'yellow',
  on = false,
  rotateRight = false,
  className = '',
}: VehicleProps) {
  return (
    <>
      <div
        className={cn(
          'relative aspect-[109/161] w-[50px]',
          className,
          rotateRight && 'scale-x-[-1] transform',
        )}
      >
        <div className={cn('absolute bottom-0 left-[46.6%] aspect-[10/105] w-[9.17%]')}>
          <Image
            alt="matahari nesco"
            src={`/elements/KincirAngin/batang-${variant}.png`}
            className="drop-shadow-offset"
            fill
            sizes="50vw"
          />
        </div>
        <div
          className={cn(
            'absolute left-0 right-0 top-0 mx-auto aspect-square w-full',
            on && 'rotasi',
          )}
        >
          <Image
            alt="matahari nesco"
            src={`/elements/KincirAngin/turbine-${variant}.png`}
            className="drop-shadow-offset-lg"
            sizes="50vw"
            fill
          />
        </div>
      </div>
    </>
  );
}
