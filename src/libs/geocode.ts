type NominatimAddress = {
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  state?: string;
  region?: string;
  state_district?: string;
};

type NominatimResponse = {
  address?: NominatimAddress;
  display_name?: string;
};

const cache = new Map<string, string>();

let lastRequestAt = 0;
async function throttle() {
  const wait = Math.max(0, lastRequestAt + 1000 - Date.now());
  if (wait > 0) {
    await new Promise(resolve => setTimeout(resolve, wait));
  }
  lastRequestAt = Date.now();
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  await throttle();

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'local-marketplace-app (personal, non-commercial use)',
    },
  });
  if (!response.ok) {
    throw new Error('Reverse geocoding request failed');
  }

  const data: NominatimResponse = await response.json();
  const address = data.address || {};

  const neighbourhood = address.neighbourhood || address.suburb || address.quarter;
  const city = address.city || address.town || address.village || address.municipality;
  const region = address.state || address.region || address.state_district;

  const label = [neighbourhood, city, region].filter(Boolean).join(', ')
    || data.display_name
    || `${lat.toFixed(3)}, ${lng.toFixed(3)}`;

  cache.set(key, label);
  return label;
}
