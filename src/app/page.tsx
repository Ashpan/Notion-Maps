'use client'

import React from 'react';
import LocationMap from './components/LocationMap';
import axios from 'axios';
import { SERVER_OPTIONS } from './constants';

function Home() {

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
      <LocationMap />
    </div>
  );
}

export default Home;
