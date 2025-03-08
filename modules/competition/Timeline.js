import { dataTimeline } from '@/modules/data/timeline';

const Garis = () => {
  return (
    <>
      <div className="absolute w-[0.8vw] h-[0.8vw] top-[4.5vw] left-[2.3vw] rounded-full bg-[#EABB37]"></div>
      <div className="absolute left-[2.65vw] w-[0.1vw] h-[2.7vw] top-[5vw] bg-[#EABB37]"></div>
      <div className="absolute w-[0.8vw] h-[0.8vw] top-[7.7vw] left-[2.3vw] rounded-full bg-[#EABB37]"></div>
    </>);
};

const Time = ({ kegiatan, start, end }) => {
  return (
    <>
      <h1 className="translate-x-[1.4vw] translate-y-[1.4vw] text-[1.7vw] font-bold text-[#EABB37]">
        {kegiatan}
      </h1>
      <Garis />
      <h1 className="translate-x-[4vw] translate-y-[2.6vw] text-[1.2vw] font-bold text-[#EABB37]">
        {start}
      </h1>
      <h1 className="translate-x-[4vw] translate-y-[4.7vw] text-[1.2vw] font-bold text-[#EABB37]">
        {end}
      </h1>
    </>
  );
};

export function Timeline({ slug }) {
  const dataTimelineNow = dataTimeline[slug];
  return (
    <div className="relative z-[12] flex h-[50dvh] w-full items-center justify-center text-5xl font-[700] lg:h-screen">

      <h1 className="font-kodeMono text-[4vw] font-bold translate-y-[-17vw]">Timeline</h1>

      <div className="translate-y-[0.4vw] translate-x-[-0.2vw] opacity-[20%] absolute w-[63vw] h-[27vw] bg-[black] rounded-lg"> </div>
      <div className="translate-y-[0.2vw] absolute w-[63vw] h-[27vw] bg-[#ffe08d] rounded-lg items-center justify-center">
        <div className="bg-[#0f776e] absolute w-[28.8vw] h-[10.8vw] top-[0%] left-[0%] m-[1.8vw] rounded-md">
          <Time
            kegiatan={dataTimelineNow[0].kegiatan}
            start={dataTimelineNow[0].start}
            end={dataTimelineNow[0].end}
          />
        </div>



        <div className="bg-[#0f776e] absolute w-[28.8vw] h-[10.8vw] top-[0%] right-[0%] m-[1.8vw] rounded-md">
          <Time
            kegiatan={dataTimelineNow[1].kegiatan}
            start={dataTimelineNow[1].start}
            end={dataTimelineNow[1].end}
          />
        </div>

        <div className="bg-[#0f776e] absolute w-[28.8vw] h-[10.8vw] bottom-[0%] right-[0%] m-[1.8vw] rounded-md">
          <Time
            kegiatan={dataTimelineNow[2].kegiatan}
            start={dataTimelineNow[2].start}
            end={dataTimelineNow[2].end}
          />
        </div>

        <div className="bg-[#0f776e] absolute w-[28.8vw] h-[10.8vw] bottom-[0%] left-[0%] m-[1.8vw] rounded-md">
          <Time
            kegiatan={dataTimelineNow[3].kegiatan}
            start={dataTimelineNow[3].start}
            end={dataTimelineNow[3].end}
          />
        </div>

        {/* Panah */}

        <div className="w-[1.3vw] h-[2vw] bg-[#0f776e] rounded-xs absolute left-[30.85vw] top-[6.7vw]" style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%, 30% 50%)' }}></div>
        <div className="w-[2vw] h-[1.3vw] bg-[#0f776e] rounded-xs absolute right-[15.2vw] top-[12.85vw]" style={{ clipPath: 'polygon(0% 0%, 50% 30%, 100% 0%, 50% 100%)' }}></div>
        <div className="w-[1.3vw] h-[2vw] bg-[#0f776e] rounded-xs absolute left-[30.85vw] bottom-[6.7vw]" style={{ clipPath: 'polygon(100% 0%, 70% 50%, 100% 100%, 0% 50%)' }}></div>

      </div>
    </div>
  );
}