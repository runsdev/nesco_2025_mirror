import React from 'react';
import { cn } from '@/lib/utils';

const FilterTabs = ({ filter, setFilter }) => {
  const categories = ['General', 'Paper', 'Innovation', 'Poster', 'Scientific Debate'];

  return (
    <div className="flex space-x-2 overflow-x-auto pb-[2vw] md:pb-[15px]">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setFilter(category)}
          className={cn(
            'rounded-full bg-white px-4 py-[0.3vw] font-geist text-[2.5vw] text-black outline-none duration-300 hover:bg-lightyellow active:bg-darkyellow md:py-[0.5vw] md:text-[16px]',
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
