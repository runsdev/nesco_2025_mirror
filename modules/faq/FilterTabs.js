import React from "react";

const FilterTabs = ({ setFilter }) => {
  const categories = ["Semua", "Umum", "Olahraga", "Seni"];

  return (
    <div className="flex space-x-2 overflow-x-auto pb-[2vw] md:pb-[15px]">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setFilter(category)}
          className="rounded-full bg-white font-geist text-[2.5vw] md:text-[16px] px-4 py-[0.5vw] text-black hover:bg-lightyellow duration-300 active:bg-darkyellow focus:outline-none focus:bg-lightyellow"
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;