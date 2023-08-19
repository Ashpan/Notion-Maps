'use client'

import React from 'react';
import LocationMap from './components/LocationMap';
import axios from 'axios';

function Home() {
  return (
    <div>
      <button onClick={() => {
        axios
          .request({
            method: 'GET',
            url: `https://notion-maps-server.vercel.app/locations?databaseId=${process.env.NEXT_PUBLIC_NOTION_DATABASE_ID}`,
          })
          .then(function async(response) {
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
