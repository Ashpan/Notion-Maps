export const TORONTO_CENTER = {
    lat: 43.651432,
    lng: -79.389569
}

export const SERVER_OPTIONS = {
    method: 'GET',
    url: `${process.env.NEXT_PUBLIC_ENDPOINT}/locations?databaseId=${process.env.NEXT_PUBLIC_NOTION_DATABASE_ID}`,
  }

export const DB_CONFIG_OPTIONS = {
    method: 'GET',
    url: `${process.env.NEXT_PUBLIC_ENDPOINT}/filters?databaseId=${process.env.NEXT_PUBLIC_NOTION_DATABASE_ID}`,
}