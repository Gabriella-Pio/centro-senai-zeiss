type LocationLinks = {
  googleMaps: string;
  waze: string;
};

export function getLocationLinks(query: string): LocationLinks {
  const encoded = encodeURIComponent(query);

  return {
    googleMaps: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
    waze: `https://www.waze.com/ul?q=${encoded}&navigate=yes`,
  };
}

export function getGoogleMapsEmbedUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://maps.google.com/maps?q=${encoded}&z=15&ie=UTF8&iwloc=&output=embed`;
}
