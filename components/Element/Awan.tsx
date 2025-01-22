import Image from 'next/image';
import { cn } from '@/lib/utils';

type Awan = {
  className: string;
  flip?: boolean;
  variant: 1 | 2 | 3 | 4 | 5 | 6;
};

const ratio = [
  'aspect-[524/173]',
  'aspect-[476/174]',
  'aspect-[427/174]',
  'aspect-[614/216]',
  'aspect-[278/126]',
  'aspect-[424/173]',
];

export default function Awan({ className = '', flip = false, variant = 1 }: Awan) {
  return (
    <div className={cn('w-[50px]', ratio[variant - 1], className)}>
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 top-0 z-[12] m-auto w-full',
          flip && 'scale-x-[-1] transform',
          ratio[variant - 1],
        )}
      >
        <Image alt={`awan ${variant}`} src={`/elements/Awan/awan-${variant}.png`} fill />
      </div>
    </div>
  );
}
