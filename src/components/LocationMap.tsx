import {reverseGeocode} from "@/libs/geocode";
import {HTMLAttributes} from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  location: number[];
};

export default async function LocationMap({location, ...divProps}:Props) {
  const [lng, lat] = location;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`;
  const label = await reverseGeocode(lat, lng).catch(() => `${lat.toFixed(3)}, ${lng.toFixed(3)}`);
  return (
    <div {...divProps}>
      <p className="text-sm">{label}</p>
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
