import React, { useState, useEffect } from 'react';
import { Map, Marker, ZoomControl } from 'pigeon-maps';

// Hook para debounce
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
}

const Mapa = () => {
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [results1, setResults1] = useState([]);
  const [results2, setResults2] = useState([]);
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  const [marker1, setMarker1] = useState(null);
  const [marker2, setMarker2] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [center, setCenter] = useState([36.5, -6.0]);

  const ORS_API_KEY = '5b3ce3597851110001cf624878a88a9cc2d446f2a7c8e36785ec54df';

  const debouncedSearch1 = useDebounce(search1);
  const debouncedSearch2 = useDebounce(search2);

  const buscar = async (texto, setResults) => {
    const res = await fetch(
      `https://corsproxy.io/?https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&addressdetails=1&limit=5&countrycodes=es,pt,ad,fr`
    );
    const data = await res.json();
    setResults(data);
  };

  useEffect(() => {
    if (debouncedSearch1.length >= 2) {
      buscar(debouncedSearch1, setResults1);
      setShowSuggestions1(true);
    } else {
      setResults1([]);
      setShowSuggestions1(false);
    }
  }, [debouncedSearch1]);

  useEffect(() => {
    if (debouncedSearch2.length >= 2) {
      buscar(debouncedSearch2, setResults2);
      setShowSuggestions2(true);
    } else {
      setResults2([]);
      setShowSuggestions2(false);
    }
  }, [debouncedSearch2]);

  const getRoute = async (from, to) => {
    const body = {
      coordinates: [
        [from[1], from[0]],
        [to[1], to[0]],
      ],
    };

    const res = await fetch(
      'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
      {
        method: 'POST',
        headers: {
          Authorization: ORS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    const coords = data.features[0].geometry.coordinates.map(([lng, lat]) => [
      lat,
      lng,
    ]);
    setRouteCoords(coords);
  };

  useEffect(() => {
    if (marker1 && marker2) {
      getRoute(marker1, marker2);
    }
  }, [marker1, marker2]);

  const handleSelect = (place, setMarker, setSearch, setResults, setShowSuggestions) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const coords = [lat, lon];
    setMarker(coords);
    setSearch(place.display_name);
    setResults([]);
    setShowSuggestions(false);
    setCenter(coords);
  };

  const RutaOverlay = () => {
    if (!mapInstance || routeCoords.length === 0) return null;
    const points = routeCoords
      .map(([lat, lng]) => {
        const { x, y } = mapInstance.latLngToPixel({ lat, lng });
        return `${x},${y}`;
      })
      .join(' ');
    return (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <polyline
          points={points}
          fill="none"
          stroke="#2c3e50"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex gap-4">
        {/* Origen */}
        <div className="relative">
          <input
            type="text"
            value={search1}
            onChange={(e) => setSearch1(e.target.value)}
            onFocus={() => {
              if (results1.length > 0) setShowSuggestions1(true);
            }}
            placeholder="Origen..."
            className="border p-2 rounded w-64"
          />
          {showSuggestions1 && results1.length > 0 && (
            <ul className="absolute bg-white border w-64 shadow z-50 mt-1 max-h-60 overflow-y-auto">
              {results1.map((place, index) => (
                <li
                  key={index}
                  onClick={() =>
                    handleSelect(place, setMarker1, setSearch1, setResults1, setShowSuggestions1)
                  }
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Destino */}
        <div className="relative">
          <input
            type="text"
            value={search2}
            onChange={(e) => setSearch2(e.target.value)}
            onFocus={() => {
              if (results2.length > 0) setShowSuggestions2(true);
            }}
            placeholder="Destino..."
            className="border p-2 rounded w-64"
          />
          {showSuggestions2 && results2.length > 0 && (
            <ul className="absolute bg-white border w-64 shadow z-50 mt-1 max-h-60 overflow-y-auto">
              {results2.map((place, index) => (
                <li
                  key={index}
                  onClick={() =>
                    handleSelect(place, setMarker2, setSearch2, setResults2, setShowSuggestions2)
                  }
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Mapa */}
      <div className="relative h-[500px] w-full">
        <Map
          center={center}
          zoom={6}
          height={500}
          width={800}
          ref={setMapInstance}
        >
          {marker1 && <Marker anchor={marker1} />}
          {marker2 && <Marker anchor={marker2} />}
          <ZoomControl />
        </Map>
        <RutaOverlay />
      </div>
    </div>
  );
};

export default Mapa;
