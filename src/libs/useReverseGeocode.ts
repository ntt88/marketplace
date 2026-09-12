'use client';
import {useEffect, useState} from "react";

export function useReverseGeocode(lat?: number, lng?: number) {
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      fetch(`/api/geocode?lat=${lat}&lng=${lng}`)
        .then(res => res.json())
        .then(data => setLabel(data.label || ''))
        .catch(() => setLabel(''))
        .finally(() => setLoading(false));
    }, 800);
    return () => clearTimeout(timeout);
  }, [lat, lng]);

  return {label, loading};
}
