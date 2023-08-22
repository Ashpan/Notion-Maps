import React, { useState } from 'react';

interface FilterProps {
  filters: {
    type: string[];
    cuisine: string[];
  };
  selectedFilters: {
    type: string[];
    cuisine: string[];
  };
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<{
      type: string[];
      cuisine: string[];
    }>
  >;
}

const FilterDrawer: React.FC<FilterProps> = ({ filters, selectedFilters, setSelectedFilters }) => {

  const handleTypeFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (value === 'all') {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        type: checked ? filters.type.map(option => option) : [],
      }));
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        type: checked
          ? [...prevFilters.type, value]
          : prevFilters.type.filter(option => option !== value),
      }));
    }
  };

  const handleCuisineFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (value === 'all') {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        cuisine: checked ? filters.cuisine.map(option => option) : [],
      }));
    } else {
      setSelectedFilters(prevFilters => ({
        ...prevFilters,
        cuisine: checked
          ? [...prevFilters.cuisine, value]
          : prevFilters.cuisine.filter(option => option !== value),
      }));
    }
  };


  return (
    <div className="filter-drawer fixed inset-y-0 right-0 w-1/6 bg-white border-l border-gray-300 shadow-lg">
      <div className="mb-4">
        <h3 className="text-sm font-medium">Type</h3>
        <label className="block mt-1">
          <input
            type="checkbox"
            value="all"
            checked={selectedFilters.type.length === filters.type.length}
            onChange={handleTypeFilterChange}
          />
          <strong>Select All</strong>
        </label>
        {filters.type.map(option => (
          <label key={option} className="block mt-1">
            <input
              type="checkbox"
              value={option}
              checked={selectedFilters.type.includes(option)}
              onChange={handleTypeFilterChange}
            />
            {option}
          </label>
        ))}
      </div>
      {/* Cuisine Filter */}
      <div>
        <h3 className="text-sm font-medium">Cuisine</h3>
        <label className="block mt-1">
          <input
            type="checkbox"
            value="all"
            checked={selectedFilters.cuisine.length === filters.cuisine.length}
            onChange={handleCuisineFilterChange}
          />
          <strong>Select All</strong>
        </label>
        {filters.cuisine.map(option => (
          <label key={option} className="block mt-1">
            <input
              type="checkbox"
              value={option}
              checked={selectedFilters.cuisine.includes(option)}
              onChange={handleCuisineFilterChange}
              key={option}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );

};

export default FilterDrawer;
