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
        className="w-full rounded-full border border-gray-300 px-4 py-2 text-[2.5vw] text-blue shadow-md outline-none placeholder:text-blue focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue md:text-[16px]"
      />
    </div>
  );
}
