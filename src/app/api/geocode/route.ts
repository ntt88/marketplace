import {reverseGeocode} from "@/libs/geocode";

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  if (isNaN(lat) || isNaN(lng)) {
    return Response.json({error: 'Invalid coordinates'}, {status: 400});
  }

  try {
    const label = await reverseGeocode(lat, lng);
    return Response.json({label});
  } catch (err) {
    console.error(err);
    return Response.json({error: 'Failed to resolve location'}, {status: 500});
  }
}
