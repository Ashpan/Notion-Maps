export const TORONTO_CENTER = {
  lat: 43.651432,
  lng: -79.389569,
};

export const SERVER_OPTIONS = (userId) => {
  return {
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_ENDPOINT}/locations?userId=${userId}`,
  };
};

export const DB_CONFIG_OPTIONS = (userId) => {
  return {
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_ENDPOINT}/filters?userId=${userId}`,
  };
};
