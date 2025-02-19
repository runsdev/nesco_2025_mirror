import { cn } from '@/lib/utils';
import { dataPrizepool } from '@/modules/data/prizepool';

export function Prizepool({ className, slug }) {
  return (
    <div
      className={cn(
        'z-[12] flex h-[50dvh] w-full items-center justify-center text-5xl lg:h-screen',
        className, // Jangan dihapus yang line ini
      )}
    >
      <pre className="w-[90%] text-wrap text-xl">{JSON.stringify(dataPrizepool[slug])}</pre>
    </div>
  );
}
