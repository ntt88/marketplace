import {Location} from "@/components/LocationPicker";
import {useEffect, useState} from "react";

export default function DistancePicker({
  onChange,
  defaultRadius,
}:{
  onChange:({radius,center}:{radius:number;center:Location;}) => void;
  defaultRadius:number;
}) {
  const [radius, setRadius] = useState(defaultRadius);
  const [center, setCenter] = useState<Location|null>(null);
  const [geoError, setGeoError] = useState('');

  useEffect(() => {
    if (window.localStorage && window.localStorage.getItem('center')) {
      try {
        setCenter(JSON.parse(window.localStorage.getItem('center') as string));
      } catch {}
    }
    navigator.geolocation.getCurrentPosition(ev => {
      const newCenter = {lat: ev.coords.latitude, lng: ev.coords.longitude};
      setCenter(newCenter);
      window.localStorage?.setItem('center', JSON.stringify(newCenter));
    }, err => setGeoError(err.message));
  }, []);

  useEffect(() => {
    if (center && radius) {
      onChange({center, radius});
    }
  }, [radius, center]);

  function handleCenterChange(key: 'lat'|'lng', value: string) {
    const num = parseFloat(value);
    if (isNaN(num) || !center) return;
    const newCenter = {...center, [key]: num};
    setCenter(newCenter);
    window.localStorage?.setItem('center', JSON.stringify(newCenter));
  }

  return (
    <div className="flex flex-col gap-2">
      <label>Where</label>
      {!center && (
        <div className="text-gray-400 text-sm bg-gray-200 rounded p-4">
          {geoError ? `Location error: ${geoError}` : 'Detecting your location...'}
        </div>
      )}
      {center && (
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            step="any"
            value={center.lat}
            onChange={ev => handleCenterChange('lat', ev.target.value)}
            className="border rounded p-2 text-sm"
            placeholder="Latitude"
          />
          <input
            type="number"
            step="any"
            value={center.lng}
            onChange={ev => handleCenterChange('lng', ev.target.value)}
            className="border rounded p-2 text-sm"
            placeholder="Longitude"
          />
        </div>
      )}
      <label>Distance: {Math.round(radius / 1000)} km</label>
      <input
        type="range"
        min={1000}
        max={200000}
        step={1000}
        value={radius}
        onChange={ev => setRadius(parseInt(ev.target.value))}
      />
    </div>
  );
}
