import { dataTimeline } from '@/modules/data/timeline';
import { cn } from '@/lib/utils';

const Garis = ({ end = false }) => {
  return (
    <>
      <div className="absolute left-[2.3vw] top-[4.5vw] h-[0.8vw] w-[0.8vw] rounded-full bg-lightyellow duration-500" />
      {end && (
        <div className="absolute left-[2.6vw] top-[5vw] h-[4.2vw] w-[0.1vw] bg-lightyellow duration-500 md:left-[2.65vw] md:h-[4vw] lg:h-[2.7vw]" />
      )}
      {end && (
        <div className="absolute left-[2.3vw] top-[8.7vw] h-[0.8vw] w-[0.8vw] rounded-full bg-lightyellow duration-500 md:top-[8.5vw] lg:top-[7.7vw]" />
      )}
    </>
  );
};

const Time = ({ kegiatan, start, end, className, t = false, r = false, l = false, b = false }) => {
  return (
    <>
      <div
        className={cn(
          'group absolute m-[1.8vw] aspect-[28.8/11] w-[45%] rounded-sm bg-[#0f776e] text-lightyellow duration-500 hover:scale-[1.025] lg:rounded-md',
          t && 'top-[0%]',
          r && 'right-[0%]',
          b && 'bottom-[0%]',
          l && 'left-[0%]',
          className,
        )}
      >
        <h3 className="translate-x-[1.4vw] translate-y-[1.4vw] text-[2vw] font-bold lg:text-[1.5vw]">
          {kegiatan}
        </h3>
        <Garis end={end ? end : null} />
        <h6 className="translate-x-[4vw] translate-y-[2.6vw] text-[1.5vw] font-bold lg:text-[1.2vw]">
          {start}
        </h6>
        {end && (
          <h6 className="translate-x-[4vw] translate-y-[4.7vw] text-[1.5vw] font-bold lg:text-[1.2vw]">
            {end}
          </h6>
        )}
      </div>
    </>
  );
};

export function Timeline({ slug }) {
  const dataTimelineNow = dataTimeline[slug];
  return (
    <div className="relative flex h-[50svh] w-full flex-col items-center justify-start gap-5 bg-darkyellow pt-[10vw] text-5xl font-[700] md:h-[60svh] lg:h-[80svh] xl:h-screen">
      <h1 className="relative z-[12] font-kodeMono text-[6vw] font-bold md:text-[5.7vw] lg:text-4xl xl:text-7xl">
        Timeline
      </h1>
      <div className="relative z-[12] aspect-[63/27] w-[84vw] translate-y-[0.2vw] items-center justify-center rounded-md bg-[#ffe08d] drop-shadow-offset md:w-[80vw] md:rounded-lg lg:w-[63vw]">
        <Time
          kegiatan={dataTimelineNow[0].kegiatan}
          start={dataTimelineNow[0].start}
          end={dataTimelineNow[0].end}
          t
          l
        />

        <Time
          kegiatan={dataTimelineNow[1].kegiatan}
          start={dataTimelineNow[1].start}
          end={dataTimelineNow[1].end}
          t
          r
        />

        <Time
          kegiatan={dataTimelineNow[2].kegiatan}
          start={dataTimelineNow[2].start}
          end={dataTimelineNow[2].end}
          b
          r
        />

        <Time
          kegiatan={dataTimelineNow[3].kegiatan}
          start={dataTimelineNow[3].start}
          end={dataTimelineNow[3].end}
          b
          l
        />

        {/* Panah */}

        <div
          className="rounded-xs absolute left-[49%] top-[22%] aspect-[1.3/2] w-[1.3vw] bg-[#0f776e]"
          style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%, 30% 50%)' }}
        />
        <div
          className="rounded-xs absolute right-[24%] top-[48%] aspect-[2/1.3] w-[2vw] bg-[#0f776e]"
          style={{ clipPath: 'polygon(0% 0%, 50% 30%, 100% 0%, 50% 100%)' }}
        />
        <div
          className="rounded-xs absolute bottom-[22%] left-[49%] aspect-[1.3/2] w-[1.3vw] bg-[#0f776e]"
          style={{ clipPath: 'polygon(100% 0%, 70% 50%, 100% 100%, 0% 50%)' }}
        />
      </div>
    </div>
  );
}
