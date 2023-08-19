import { use, useEffect, useState } from 'react';
import axios from 'axios';
// import { Map } from '@googlemaps/react-wrapper'
// import { Marker } from '@googlemaps/react-wrapper'
import GoogleMapReact from 'google-map-react';
import Pin from '../../../public/location-pin.png'
import Image from 'next/image'
import { TORONTO_CENTER } from '../constants';



interface MapProps {
  text: string;
  lat: number;
  lng: number;
}


const LocationMap: React.FC = () => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getServerOptions = {
    method: 'GET',
    url: `https://notion-maps-server-a5idnyhud-ashpan.vercel.app/locations?databaseId=${process.env.NEXT_PUBLIC_NOTION_DATABASE_ID}`,
    // url: `http://localhost:4000/locations?databaseId=${process.env.NEXT_PUBLIC_NOTION_DATABASE_ID}`,
  }

  useEffect(() => {
    // Fetch location data from Notion API
    axios
      .request(getServerOptions)
      .then(function async (response) {
        setLocations(response.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      {!isLoading &&
      <GoogleMapReact
        bootstrapURLKeys={{ key: `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}` }}
        defaultCenter={TORONTO_CENTER}
        defaultZoom={13}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps, locations)}

      />}
    </div>
  );
}

const handleApiLoaded = (map: any, maps: any, locations: any[]) => {
  const markers = [];
  const infowindows = [];

  locations.forEach((location) => {
    const marker = new maps.Marker({
      position: {
        lat: location.lat,
        lng: location.long
      },
      map,
    });

    const infowindow = new maps.InfoWindow({
      content: getInfoWindowString(location),
    });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });

    markers.push(marker);
    infowindows.push(infowindow);
  });
}

const getInfoWindowString = (place: any): string => `
    <div>
      <div style="font-size: 16px; color: black;">
        <a href="${place.url}" target="_blank"><u>${place.name}</u></a>
      </div>
      <div style="font-size: 14px; color: grey;">
        ${place.type.join(' • ')}
      </div>
      <div style="font-size: 14px; color: grey;">
      ${place.notes}
    </div>
    </div>`;


export default LocationMap;
