export function haversine(lat1, lon1, lat2, lon2) {
  const EARTH_RADIUS_KM = 6371;
  const deltaLatRadians = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLonRadians = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRadians / 2) * Math.sin(deltaLatRadians / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(deltaLonRadians / 2) *
      Math.sin(deltaLonRadians / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function calculateTravelTime(distanceKm, transportMode) {
  const averageSpeedsKmph = {
    walking: 5,
    motorcycle: 30,
    driving: 25,
  };

  const speed = averageSpeedsKmph[transportMode] || averageSpeedsKmph.driving;
  const timeInHours = distanceKm / speed;
  const timeInMinutes = Math.round(timeInHours * 60);

  if (timeInMinutes < 60) return `${timeInMinutes} menit`;

  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return minutes === 0 ? `${hours} jam` : `${hours} jam ${minutes} menit`;
}

export function createGeoJSONCircle(center, radiusInKm) {
  const numberOfPoints = 64;
  const coords = { latitude: center.lat, longitude: center.lng };

  const distanceX = radiusInKm / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = radiusInKm / 110.574;

  const ringCoordinates = [];
  for (let i = 0; i < numberOfPoints; i++) {
    const theta = (i / numberOfPoints) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    ringCoordinates.push([coords.longitude + x, coords.latitude + y]);
  }
  ringCoordinates.push(ringCoordinates[0]);

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [ringCoordinates],
        },
        properties: {},
      },
    ],
  };
}


