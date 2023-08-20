export const TORONTO_CENTER = {
    lat: 43.651432,
    lng: -79.389569
}

export const SERVER_OPTIONS = {
    method: 'GET',
    url: `https://notion-maps-server.vercel.app/locations?databaseId=${process.env.NEXT_PUBLIC_NOTION_DATABASE_ID}`,
    // url: `http://localhost:4000/locations?databaseId=${process.env.NEXT_PUBLIC_NOTION_DATABASE_ID}`,
  }