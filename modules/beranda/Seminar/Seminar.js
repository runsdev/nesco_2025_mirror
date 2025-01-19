import { agendaData } from '@/modules/data/data';

export const Seminar = () => {
  const seminarData = agendaData.find((data) => data.title === 'Seminar');
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center text-center text-[50px] font-[700]">
      Seminar
      <pre id="json" className="w-[50%] text-wrap text-left text-[20px] font-normal">
        {JSON.stringify(seminarData, undefined, 2)}
      </pre>
    </div>
  );
};
