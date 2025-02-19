import { dataTimeline } from '@/modules/data/timeline';

export function Timeline({ slug }) {
  return (
    <div className="z-[12] flex h-[50dvh] w-full items-center justify-center text-5xl font-[700] lg:h-screen">
      <pre className="w-[90%] text-wrap text-xl">{JSON.stringify(dataTimeline[slug])}</pre>
    </div>
  );
}
