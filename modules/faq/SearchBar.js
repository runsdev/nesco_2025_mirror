import { useState, useEffect } from 'react';

export default function SearchBar({ setSearchQuery }) {
  const [inputValue, setInputValue] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    
    // Call the setSearchQuery function passed from the parent component
    setSearchQuery(value);
  };

  return (
    <div className="w-full">
      {isClient && (
        <input
          type="text"
          placeholder="Cari pertanyaan..."
          value={inputValue}
          onChange={handleInputChange}
          className="w-full px-4 py-2 shadow-md rounded-full border text-blue border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent placeholder:text-blue text-[2.5vw] md:text-[16px] "
        />
      )}
    </div>
  );
}