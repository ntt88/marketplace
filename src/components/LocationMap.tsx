import {HTMLAttributes} from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  location: number[];
};

export default function LocationMap({location, ...divProps}:Props) {
  const [lng, lat] = location;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`;
  return (
    <div {...divProps}>
      <p className="text-sm">Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}</p>
      <a
        href={osmUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline text-sm">
        View on map
      </a>
    </div>
  );
}
