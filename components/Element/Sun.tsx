'use client';

import Image from 'next/image';
import RenderIf from '../UI/RenderIf';
import { cn } from '@/lib/utils';
import { getHorizontalFloatAnimation, getUpDownFloatAnimation } from '@/utils/animation';

type SunProps = {
  className?: string;
  plain?: boolean;
  shadow?: boolean;
  rotate?: boolean;
  updownfloat: number;
  horizontalfloat: number;
};

export default function Sun({
  plain = false,
  shadow = false,
  rotate = false,
  className = '',
  updownfloat = 0,
  horizontalfloat = 0,
}: SunProps) {
  return (
    <>
      <div
        className={cn(
          'relative aspect-[1/1] w-[50px]',
          className,
          updownfloat && getUpDownFloatAnimation(updownfloat),
          horizontalfloat && getHorizontalFloatAnimation(horizontalfloat),
        )}
      >
        <RenderIf when={plain}>
          <div className={cn('absolute bottom-0 left-0 right-0 top-0 m-auto aspect-[1/1] w-full')}>
            <Image
              alt="matahari nesco"
              src="/elements/sun/sun-plain.png"
              className={cn(shadow && 'drop-shadow-offset-lg')}
              fill
            />
          </div>
        </RenderIf>
        <RenderIf when={!plain}>
          <div className="absolute bottom-0 left-0 right-0 top-0 z-[12] m-auto aspect-[1/1] w-[62%]">
            <Image
              alt="matahari nesco"
              src="/elements/sun/sun-pale.png"
              className={cn(shadow && 'drop-shadow-offset-lg')}
              fill
            />
          </div>
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 top-0 m-auto aspect-[1/1] w-full',
              rotate && 'rotasi',
            )}
          >
            <Image
              alt="matahari nesco"
              src="/elements/sun/sinar-pale.png"
              className={cn(shadow && 'drop-shadow-offset')}
              fill
            />
          </div>
        </RenderIf>
      </div>
    </>
  );
}
