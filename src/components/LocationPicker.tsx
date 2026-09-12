'use client';
import {useReverseGeocode} from "@/libs/useReverseGeocode";
import {useEffect, useState} from "react";

export type Location = {
  lat: number;
  lng: number;
}

export default function LocationPicker({
  defaultLocation,
  onChange,
  gpsCoords,
}:{
  defaultLocation: Location;
  onChange: (location: Location) => void;
  gpsCoords: Location|null;
}) {
  const [location, setLocation] = useState<Location>(defaultLocation);
  const {label, loading} = useReverseGeocode(location.lat, location.lng);

  useEffect(() => {
    if (gpsCoords) {
      setLocation(gpsCoords);
    }
  }, [gpsCoords]);

  function handleChange(key: 'lat'|'lng', value: string) {
    const num = parseFloat(value);
    const newLocation = {...location, [key]: isNaN(num) ? 0 : num};
    setLocation(newLocation);
    onChange(newLocation);
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            value={location.lat}
            onChange={ev => handleChange('lat', ev.target.value)}
            className="border rounded p-2 w-full text-gray-800"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            value={location.lng}
            onChange={ev => handleChange('lng', ev.target.value)}
            className="border rounded p-2 w-full text-gray-800"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {loading ? 'Resolving location...' : label}
      </p>
    </div>
  );
}
