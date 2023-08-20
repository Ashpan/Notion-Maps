'use client'

import React from 'react';
import LocationMap from './components/LocationMap';
import axios from 'axios';
import { SERVER_OPTIONS } from './constants';
import { useState } from 'react';
// import SelectMenu from './components/SelectMenu';

function Home() {

  // const [selectedCuisines, setSelectedCuisines] = useState([]);

  // const handleCuisineChange = (event) => {
  //   const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
  //   setSelectedCuisines(selectedOptions);
  // };


  return (
    <div>
      <button onClick={() => {
        axios
          .request(SERVER_OPTIONS)
          .then(function async(response) {
            location.reload();
            console.log(response);
          })
          .catch(function (error) {
            console.error(error);
          });
      }}>Reload</button>
      {/* <SelectMenu /> */}
      {/* Add a multi select to choose what cuisine should be shown and pass that in as props to the LocationMap */}
      {/* <select multiple value={selectedCuisines} onChange={handleCuisineChange}>
        <option value="italian">Italian</option>
        <option value="mexican">Mexican</option>
        <option value="indian">Indian</option>
      </select> */}
        {/* /* Add more cuisine options as needed */}
      <LocationMap />
    </div>
  );
}

export default Home;
