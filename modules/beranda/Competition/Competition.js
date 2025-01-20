import { agendaData } from '@/modules/data/data';

export const Competition = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center text-center text-[50px] font-[700]">
      Competition
      <pre id="json" className="w-[50%] text-wrap text-left text-[20px] font-normal">
        {JSON.stringify(agendaData, undefined, 2)}
      </pre>
    </div>
  );
};
