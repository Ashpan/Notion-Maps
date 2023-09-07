import axios from 'axios';
import GoogleMapReact from 'google-map-react';
import { useEffect, useState } from 'react';
import { SERVER_OPTIONS, TORONTO_CENTER } from '../constants';

interface Location {
  lat: number;
  long: number;
  type: string[];
  cuisine: string[];
}

interface MapProps {
  text: string;
  lat: number;
  lng: number;
}

interface FilterOptions {
  type: string[];
  cuisine: string[];
}

let markers: any = [];
let infowindows: any = [];


const LocationMap: React.FC<{ selectedFilters: { type: string[]; cuisine: string[] }, userId: string }> = ({ selectedFilters, userId }) => {
  console.log({userId})
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCenter, setCurrentCenter] = useState(TORONTO_CENTER); // Default center
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentCenter({ lat, lng });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };


  const axiosInstance = axios.create({
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
  useEffect(() => {
    // Fetch location data from Notion API
    axiosInstance
      .request(SERVER_OPTIONS(userId))
      .then(function async(response) {
        setLocations(response.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Filter locations based on selected filters
  const filteredLocations = locations.filter(location => {
    if (
      selectedFilters.type.length === 0 ||
      selectedFilters.type.some(selectedType => location.type.includes(selectedType))
    ) {
      if (
        selectedFilters.cuisine.length === 0 ||
        selectedFilters.cuisine.some(selectedCuisine => location.cuisine.includes(selectedCuisine))
      ) {
        return true;
      }
    }
    return false;
  });

  // when the filtered locations change, update the map
  useEffect(() => {
    if (!isLoading && map && maps) {
      console.log(maps);
      handleApiLoaded(map, maps, filteredLocations);
    }
  }, [filteredLocations, isLoading, map, maps]);

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      {/* <button onClick={getCurrentLocation}>Current Location</button> */}
      {!isLoading && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}` }}
          center={currentCenter}
          defaultZoom={13}
          yesIWantToUseGoogleMapApiInternals
          options={{ gestureHandling: "greedy"}}  // Allow map panning on mobile
          onGoogleApiLoaded={({ map: loadedMap, maps: loadedMaps }) => {
            setMap(loadedMap);
            setMaps(loadedMaps);
            // handleApiLoaded(loadedMap, loadedMaps, filteredLocations)
          }}
        />
      )}
      <button className="current-location-button" onClick={getCurrentLocation}>
        &#8982; {/* Unicode crosshair symbol */}
      </button>
    </div>
  );
}

const handleApiLoaded = (map: any, maps: any, locations: Location[]) => {
  console.log(locations)

  // Reset markers and infowindows
  markers.forEach((marker: { setMap: (arg0: null) => any; }) => marker.setMap(null));
  infowindows.forEach((infowindow: { close: () => any; }) => infowindow.close());

  markers = [];
  infowindows = [];
  let currentInfoWindow: any = null;

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
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }

      infowindow.open(map, marker);
      currentInfoWindow = infowindow;
    });

    markers.push(marker);
    infowindows.push(infowindow);
  });
}


// format the info window that contains the name of the place, the type of place, any notes, the rating out of 5, and how many dollar signs it is
const getInfoWindowString = (place: any): string => `
    <div>
      <div style="font-size: 16px; color: black;">
        <a href="${place.url}" target="_blank"><u>${place.name}</u></a>
      </div>
      <div style="font-size: 14px; color: grey;">
        ${place.type.join(' • ')}
      </div>
      <div style="font-size: 14px; color: grey;">
        ${place.rating} ⭐️ • ${'$'.repeat(place.price)}
      </div>
      <div style="font-size: 14px; color: grey;">
        ${place.cuisine.join(' • ')}
      <div style="font-size: 14px; color: grey;">
      </hr>
      ${place.notes}
    </div>

    </div>`;


export default LocationMap;
