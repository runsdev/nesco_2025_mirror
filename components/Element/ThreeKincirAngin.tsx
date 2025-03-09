import Image from 'next/image';
import { cn } from '@/lib/utils';
import { KincirAngin } from './KincirAngin';

type ThreeKincirAnginProps = {
  className?: string;
  left?: boolean;
  right?: boolean;
};

export function ThreeKincirAngin({
  className = '',
  left = false,
  right = false,
}: ThreeKincirAnginProps) {
  return (
    <div className={cn('relative aspect-[523/277] w-[36.6%]', className)}>
      {left && <KincirAngin on className="absolute bottom-0 left-[8%] w-[25%]" />}
      <KincirAngin on className="absolute bottom-0 right-[30%] w-[35.7%]" />
      {right && <KincirAngin on className="absolute bottom-0 right-[7%] w-[21%]" />}
      <div className="absolute bottom-0 aspect-[523/60] w-full">
        <Image
          alt="tanah"
          src="/elements/KincirAngin/TanahKincir.png"
          className="aspect-[523/60] w-full"
          fill
          sizes="50vw"
        />
      </div>
    </div>
  );
}
