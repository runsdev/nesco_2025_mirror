import Image from 'next/image';
import { cn } from '@/lib/utils';

type RumputProps = {
  className: string;
  flip?: boolean;
  variant: 1 | 2;
};

export function Rumput({ className = '', flip = false, variant = 1 }: RumputProps) {
  return (
    <div className={cn('aspect-[100.5/58] w-[50px]', className)}>
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 top-0 z-[12] m-auto aspect-[100.5/58] w-full',
          flip && 'scale-x-[-1] transform',
        )}
      >
        <Image alt={`awan ${variant}`} src={`/elements/Rumput/rumput-${variant}.png`} fill />
      </div>
    </div>
  );
}
