import React from 'react';

const FilterDrawer = ({ filters, selectedFilters, setSelectedFilters }) => {
  const handleFilterChange = (category, option, checked) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [category]: checked
        ? [...prevFilters[category], option]
        : prevFilters[category].filter(item => item !== option),
    }));
  };
  return (
    <div className="filter-drawer fixed inset-y-0 right-0 w-1/3 bg-white border-l border-gray-300 shadow-lg">
      {Object.entries(filters).map(([category, options]) => (
        <div key={category} className="mb-4">
          <h3 className="text-sm font-medium">{category}</h3>
          <label className="block mt-1">
            <input
              type="checkbox"
              value="all"
              checked={selectedFilters[category].length === options.length}
              onChange={e => handleFilterChange(category, 'all', e.target.checked)}
            />
            <strong>Select All</strong>
          </label>
          {options.map(option => (
            <label key={option} className="block mt-1">
              <input
                type="checkbox"
                value={option}
                checked={selectedFilters[category].includes(option)}
                onChange={e => handleFilterChange(category, option, e.target.checked)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FilterDrawer;
