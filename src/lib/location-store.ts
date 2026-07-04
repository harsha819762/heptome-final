const locations = new Map<string, { lat: number; lng: number; timestamp: number }>();

export function setLocation(bookingId: string, lat: number, lng: number) {
  locations.set(bookingId, { lat, lng, timestamp: Date.now() });
}

export function getLocation(bookingId: string) {
  return locations.get(bookingId) || null;
}
