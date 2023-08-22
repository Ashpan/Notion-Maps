'use client'

import React, { useEffect } from 'react';
import LocationMap from './components/LocationMap';
import FilterDrawer from './components/FilterDrawer';
import axios from 'axios';
import { DB_CONFIG_OPTIONS, SERVER_OPTIONS } from './constants';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRefresh } from '@fortawesome/free-solid-svg-icons';



interface FilterOptions {
  type: string[];
  cuisine: string[];
}


function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type: [],
    cuisine: [],
  });

  const [selectedFilters, setSelectedFilters] = useState<{
    type: string[];
    cuisine: string[];
  }>({
    type: [],
    cuisine: [],
  });



  useEffect(() => {
    // Fetch filter options from the API endpoint
    axios.request<FilterOptions>(DB_CONFIG_OPTIONS)
      .then(response => {
        const { cuisine, type } = response.data;
        setFilterOptions({
          type: type,
          cuisine: cuisine,
        });
      })
      .catch(error => {
        console.error('Error fetching filter options:', error);
      });
  }, []);


  return (
    <div className="map-container">
      <div className="map-overlay">
        <button className="hamburger-button" onClick={() => setShowFilters(!showFilters)}>
          <FontAwesomeIcon icon={faBars} /> {/* Hamburger icon */}
        </button>
        <button className='reload-button' onClick={() => {
          axios
          .request(SERVER_OPTIONS)
          .then(function async(response) {
            location.reload();
            console.log(response);
          })
          .catch(function (error) {
            console.error(error);
          });
        }}>
          <FontAwesomeIcon icon={faRefresh} /> {/* Refresh icon */}
        </button>
        {/* Add a hamburger button to open the filters */}
        {/* <button onClick={() => setShowFilters(!showFilters)}>Toggle Filters</button> */}
        {showFilters && <FilterDrawer filters={filterOptions} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />}
      </div>
      <LocationMap selectedFilters={selectedFilters} />
    </div>
  );
}

export default Home;
