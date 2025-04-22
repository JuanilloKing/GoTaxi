import React, { useState, useEffect } from 'react';
import Header from '@/Components/Header';
import { Map, Marker, ZoomControl } from 'pigeon-maps';
import Footer from '@/Components/Footer';
import { useForm, router } from '@inertiajs/react';  // Asegúrate de importar useForm

// Hook para debounce
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
}

const Create = () => {
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
  const [distancia, setDistancia] = useState(null);
  const [duracion, setDuracion] = useState(null);
  const tarifa_km = 1.26; // €/km
  const tarifa_min = 0.2; // €/min
  const [latOrigen, setLatOrigen] = useState(null);
  const [lonOrigen, setLonOrigen] = useState(null);


  // Usar useForm de Inertia.js
  const { data, setData, post, processing } = useForm({
    origen: search1,
    destino: search2,
    distancia: Number(distancia),
    duracion: Number(duracion),
    precio: Number(((distancia * tarifa_km) + (duracion * tarifa_min)).toFixed(2)),
    minusvalido: false, // Valor por defecto cuando el checkbox no está marcado
    anotaciones: '', // Valor por defecto para las anotaciones
    pasajeros: 0, // Valor por defecto para el número de pasajeros
  });

  // Manejar el envío del formulario con FormData
  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear un objeto FormData y agregar los datos del formulario
    const formData = new FormData();
    formData.append('origen', search1);
    formData.append('lat_origen', latOrigen);  // Latitud de origen
    formData.append('lon_origen', lonOrigen);  // Longitud de origen
    formData.append('destino', search2);
    formData.append('distancia', distancia);
    formData.append('duracion', duracion);
    formData.append('precio', ((distancia * tarifa_km) + (duracion * tarifa_min)).toFixed(2));
    formData.append('anotaciones', data.anotaciones); // Si tienes un campo de anotaciones
    formData.append('minusvalido', data.minusvalido); // Checkbox: verdadero o falso
    formData.append('pasajeros', data.pasajeros); // Número de pasajeros
 
    // Usar post para enviar los datos con FormData
    router.post(route('reservar.store'), formData, {});
  };

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

    const resumen = data.features[0].properties.summary;
    const km = (resumen.distance / 1000).toFixed(2); // metros → km
    const min = Math.ceil(resumen.duration / 60); // segundos → minutos

    setDistancia(km);
    setDuracion(min);
  };

  useEffect(() => {
    if (marker1 && marker2) {
      getRoute(marker1, marker2);
    }
  }, [marker1, marker2]);

  const handleSelect = (place, setMarker, setSearch, setResults, setShowSuggestions, isOrigen) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    const coords = [lat, lon];
    setMarker(coords);
    
    setSearch(place.display_name);
    setResults([]);
    setShowSuggestions(false);
    setCenter(coords);

    if (isOrigen) {
      setLatOrigen(lat);
      setLonOrigen(lon);
    }
  };

  const RutaOverlay = () => {
    if (!mapInstance || routeCoords.length === 0) return null;

    const points = routeCoords  
      .map(([lat, lng]) => {
        const pixel = mapInstance.latLngToPixel({ lat, lng });
        return pixel ? `${pixel.x},${pixel.y}` : null;
      })
      .filter(Boolean)
      .join(' ');

    return (
      <svg
        className="pointer-events-none absolute top-0 left-0"
        width="100%"
        height="500"
        style={{ zIndex: 50 }}
      >
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

  // Función para manejar el cambio del checkbox
  const handleCheckboxChange = (e) => {
    setData('minusvalido', e.target.checked); // Cambia el valor de 'minusvalido'
  };


  return (
    <div>
      <Header />
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Contenedor del mapa */}
        <div style={{ flex: 1, padding: '20px' }}>
          <h1>Elige tu destino</h1>
          <div className="space-y-4 relative ml-auto mr-auto w-[90%]">
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
                  required
                />
                {showSuggestions1 && results1.length > 0 && (
                  <ul className="absolute bg-white border w-64 shadow z-50 mt-1 max-h-60 overflow-y-auto">
                    {results1.map((place, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          handleSelect(place, setMarker1, setSearch1, setResults1, setShowSuggestions1, true)
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
                  required
                />
                {showSuggestions2 && results2.length > 0 && (
                  <ul className="absolute bg-white border w-64 shadow z-50 mt-1 max-h-60 overflow-y-auto">
                    {results2.map((place, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          handleSelect(place, setMarker2, setSearch2, setResults2, setShowSuggestions2, false)
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
                ref={(ref) => {
                  if (ref && !mapInstance) setMapInstance(ref);
                }}
              >
                {marker1 && <Marker anchor={marker1} />}
                {marker2 && <Marker anchor={marker2} />}
                <ZoomControl />
              </Map>
              <RutaOverlay />
            </div>
          </div>
        </div>

        {/* Contenedor del formulario */}
        <div style={{ flex: 1, padding: '10px', backgroundColor: '#f9f9f9', marginTop: '40px', marginLeft: '20px', borderRadius: '8px' }}>
          <h1>Formulario de Reserva</h1>
          {distancia && duracion && (
            <div className="mt-4 text-lg font-semibold text-gray-800 bg-gray-100 p-4 rounded text-center">
              Distancia estimada: {distancia} km <br />
              Duración estimada: {duracion} minutos <br />
              Precio estimado: {((distancia * tarifa_km) + (duracion * tarifa_min)).toFixed(2)} €
            </div>
          )}
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="form-checkbox" 
                  checked={data.minusvalido} 
                  onChange={handleCheckboxChange} 
                />
                <span>Taxi minusválido</span>
              </label>
            </div>
            <div>
              <label className="block mb-2">Número de pasajeros:</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                min="1"
                max="8"
                placeholder="Introduce el número de pasajeros"
                onChange={(e) => setData('pasajeros', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Anotaciones para el taxista:</label>
              <textarea
                className="border p-2 rounded w-full"
                rows="4"
                placeholder="Escribe aquí tus anotaciones..."
                onChange={(e) => setData('anotaciones', e.target.value)}
              ></textarea>
            </div>
            {distancia && duracion && (

              <div className="flex justify-between mt-4">
              <button
                type="submit"
                disabled={processing}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                Reservar taxi ahora
              </button>
            </div>
              )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Create;
