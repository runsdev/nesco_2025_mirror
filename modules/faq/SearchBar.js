'use client';

import debounce from 'lodash.debounce';

export default function SearchBar({ setSearchQuery }) {
  const handleInputChange = debounce(function (event) {
    const { value } = event.target;
    setSearchQuery(value);
  }, 300);

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Cari pertanyaan..."
        onChange={handleInputChange}
        className="w-full rounded-full border border-gray-300 px-4 py-[1.8vw] text-[2.9vw] text-black shadow-md outline-none placeholder:text-blue focus:border-transparent focus:ring-2 focus:ring-blue md:py-[1.3vw] md:text-[16px] lg:py-3"
      />
    </div>
  );
}
