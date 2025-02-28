import React from 'react';
import { cn } from '@/lib/utils';

const FilterTabs = ({ filter, setFilter }) => {
  const categories = ['General', 'Paper', 'Innovation', 'Poster', 'Debate'];

  return (
    <div className="flex space-x-2 overflow-x-auto pb-[2vw] md:pb-[15px]">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setFilter(category)}
          className={cn(
            'rounded-full bg-white px-4 py-[1.8vw] font-montserrat text-[2.5vw] font-[600] text-black outline-none duration-300 hover:bg-lightyellow active:bg-darkyellow md:py-[1vw] md:text-[16px] lg:py-2',
            category === filter && 'bg-lightyellow',
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
