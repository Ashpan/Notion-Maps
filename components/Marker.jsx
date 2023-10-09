const markerDimensions = (maps) => new maps.Size(18, 29)

export const RedMarkerIcon = (maps) => {
  return {
    url: "https://i.imgur.com/lDKPNAG.png",
    scaledSize: markerDimensions(maps),
  };
};

export const BlueMarkerIcon = (maps) => {
  return {
    url: "https://i.imgur.com/lfbTjc4.png",
    scaledSize: markerDimensions(maps),
  };
};

export const GreenMarkerIcon = (maps) => {
  return {
    url: "https://i.imgur.com/fZGs5iS.png",
    scaledSize: markerDimensions(maps),
  };
};

export const PinkMarkerIcon = (maps) => {
  return {
    url: "https://i.imgur.com/uo70KeT.png",
    scaledSize: markerDimensions(maps),
  };
};

export const PurpleMarkerIcon = (maps) => {
  return {
    url: "https://i.imgur.com/paPLyn2.png",
    scaledSize: markerDimensions(maps),
  };
};

export const CurrentLocationMarkerIcon = (maps) => {
  return {
    url: "https://i.imgur.com/axdTzJh.png",
    scaledSize: new maps.Size(30, 30),
  }
};