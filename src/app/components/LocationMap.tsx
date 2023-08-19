import { use, useEffect, useState } from 'react';
import axios from 'axios';
// import { Map } from '@googlemaps/react-wrapper'
// import { Marker } from '@googlemaps/react-wrapper'
import GoogleMapReact from 'google-map-react';
import Pin from '../../../public/location-pin.png'
import Image from 'next/image'
import { TORONTO_CENTER } from '../constants';


const TEMP_LOCATIONS = [
  {
    lat: 43.6441878,
    long: -79.4001593,
    name: "Ruby Soho",
    type: ["Bar"]
  },
  {
    lat: 43.6765655,
    long: -79.35631579999999,
    name: "Z80 Arcade Bar",
    type: ["Bar"]
  },
  {
    lat: 43.64869220000001,
    long: -79.3914291,
    name: "MARKED Restaurant",
    type: ["Restaurant"]
  },
  {
    lat: 43.6573547,
    long: -79.399399,
    name: "Bitter Melon",
    type: ["Restaurant"]
  },
  {
    lat: 43.6558299,
    long: -79.38445329999999,
    name: "Butter Baker",
    type: ["Cafe"]
  },
  {
    lat: 43.6445933,
    long: -79.3998668,
    name: "Anejo Restaurant",
    type: ["Restaurant", "Bar"]
  },
  {
    lat: 43.6543632,
    long: -79.4018301,
    name: "Gus Tacos",
    type: ["Restaurant"]
  },
  {
    lat: 43.63999039999999,
    long: -79.44053389999999,
    name: "Gold Standard",
    type: ["Restaurant"]
  },
  {
    lat: 43.646254,
    long: -79.40939209999999,
    name: "Cafe23",
    type: ["Cafe"]
  },
  {
    lat: 43.659257,
    long: -79.38282559999999,
    name: "Le Genie",
    type: ["Cafe"]
  }
]

interface MapProps {
  text: string;
  lat: number;
  lng: number;
}
const AnyReactComponent: React.FC<MapProps> = () =>
  <div>
    <Image
      src={Pin}
      alt='pin'
      width={30}
      height={30}
    />
  </div>;

interface LocationInterface {
  lat: number;
  long: number;
  name: string;
  type: string[];
  notes: string;
  url: string;
}

const LocationMap: React.FC = () => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getDatabaseOptions = {
    method: 'POST',
    url: 'https://cors-anywhere.herokuapp.com/https://thingproxy.freeboard.io/fetch/https://api.notion.com/v1/databases/7eef035b-dfa2-4cc0-9131-734e8dc8414d/query',
    headers: {
      accept: 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'content-type': 'application/json'
    },
  };

  const getMapOptions = (address: String) => ({
    method: 'GET',
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  })

  const patchDatabaseOptions = (pageId: String, lat: number, long: number) => ({
    method: 'PATCH',
    url: `https://api.notion.com/v1/pages/${pageId}`,
    headers: {
      accept: 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'content-type': 'application/json',
      'X-Requested-With': "XMLHttpRequest"

    },
    data: {
      "properties": {
        "Latitude": lat,
        "Longitude": long
      }
    }
  });

  useEffect(() => {
    const unfinishedLocations: any[] = [];
    // Fetch location data from Notion API
    axios
      .request(getDatabaseOptions)
      .then(function async (response) {
        for (const location of response.data.results) {
          // Add location to unfinishedLocations if it doesn't have a latitude or longitude
          if (location.properties.Latitude.number === null || location.properties.Longitude.number === null) {
            console.log(location)
            unfinishedLocations.push(location);
            continue;
          }

          let notes;
          try {
            notes = location.properties.Notes.rich_text[0].text.content;
          } catch (error) {
            notes = '-';
          }
          const locationMetadata:LocationInterface = {
            lat: parseFloat(location.properties.Latitude.number),
            long: parseFloat(location.properties.Longitude.number),
            name: location.properties.Name.title[0].text.content,
            type: location.properties.Type.multi_select.map((type: any) => type.name),
            notes: notes,
            url: location.properties["Maps Link"].url
          }
          console.log(locationMetadata)
          // console.log([...locations, locationMetadata]);
          // @ts-ignore
          setLocations(prevLocations => [...prevLocations, locationMetadata]);
        }

        for (const location of unfinishedLocations) {
          axios.request(getMapOptions(location.properties.Name.title[0].plain_text + ", " + location.properties.Address.rich_text[0].text.content))
          .then(function (response) {
            const { lat, lng } = response.data.results[0].geometry.location;
            const numOfResults = response.data.results.length;
            const relevantResult = response.data.results[numOfResults - 1];
            const pageId = location.id;
            console.log(location)
            let url: string;
            let notes: string;
            try{
              url = `https://www.google.com/maps/place/?q=place_id:${relevantResult.place_id}`
            } catch (error) {
              url = `https://www.google.com/maps?q=${lat},${lng}`
            }
            try {
              notes = location.properties.Notes.rich_text[0].text.content;
            } catch (error) {
              notes = '-';
            }
            axios.request(patchDatabaseOptions(pageId, lat, lng))
            .then(function (response) {
              console.log(response.data);
              const locationMetadata:LocationInterface = {
                lat: lat,
                long: lng,
                name: location.properties.Name.title[0].plain_text,
                type: location.properties.Type.multi_select.map((type: any) => type.name),
                notes: notes,
                url: url
              }
              // @ts-ignore
              setLocations(prevLocations => [...prevLocations, locationMetadata]);
            }).catch(function (error) {
              console.error(error);
            });
            console.log(url);
            console.log(relevantResult)

          }).catch(function (error) {
            console.error(error);
          });
        }

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
