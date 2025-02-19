// src/components/SearchBox.tsx
import React from 'react';

interface SearchBoxProps {
  searchTerm: string;
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ searchTerm, onSearch }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleChange}
      className="p-2 border rounded w-full"
      placeholder="Search for episodes..."
    />
  );
};

export default SearchBox;
