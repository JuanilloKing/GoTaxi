import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import Principal from '@/Layouts/Principal'
import { useForm, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

const centerDefault = { lat: 36.5, lng: -6.0 };

const Create = () => {
  const [localFlash, setLocalFlash] = useState({ message: null, type: null });
  const [map, setMap] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  const [distancia, setDistancia] = useState(null);
  const [duracion, setDuracion] = useState(null);
  const tarifa_km = 1.26;
  const tarifa_min = 0.2;

  const { auth, flash } = usePage().props;
  const errorMessage = flash?.error;

  const originRef = useRef();
  const destinationRef = useRef();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_APY_KEY,
    libraries: ['places'],
  });

  const { data, setData, post, processing } = useForm({
    origen: '',
    destino: '',
    distancia: 0,
    duracion: 0,
    precio: 0,
    minusvalido: false,
    anotaciones: '',
    pasajeros: 0,
    lat_origen: 0,
    lon_origen: 0,
  });

  useEffect(() => {
    if (localFlash.message) {
      const timer = setTimeout(() => {
        setLocalFlash({ message: null, type: null });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [localFlash]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('origen', origin);
    formData.append('destino', destination);
    formData.append('distancia', distancia);
    formData.append('duracion', duracion);
    formData.append('precio', ((distancia * tarifa_km) + (duracion * tarifa_min)).toFixed(2));
    formData.append('minusvalido', data.minusvalido);
    formData.append('anotaciones', data.anotaciones);
    formData.append('pasajeros', data.pasajeros);
    formData.append('lat_origen', data.lat_origen);
    formData.append('lon_origen', data.lon_origen);

    router.post(route('reservar.store'), formData);
  };

  const calculateRoute = async () => {
    if (!originRef.current.value || !destinationRef.current.value) return;
  
    const directionsService = new google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (results, status) => {
        if (status === 'OK') {
          setDirections(results);
          setOrigin(originRef.current.value);
          setDestination(destinationRef.current.value);
  
          const km = (results.routes[0].legs[0].distance.value / 1000).toFixed(2);
          const min = Math.ceil(results.routes[0].legs[0].duration.value / 60);
          setDistancia(km);
          setDuracion(min);
  
          const originLatLng = results.routes[0].legs[0].start_location;
          setData('lat_origen', originLatLng.lat());
          setData('lon_origen', originLatLng.lng());
  
        } else if (status === 'ZERO_RESULTS') {
          setLocalFlash({
            message: 'No se pudo encontrar una ruta entre el origen y el destino.',
            type: 'error'
          });
          setDirections(null); // Limpiar si había uno anterior
        } else {
          setLocalFlash({
            message: 'Error al calcular la ruta. Inténtalo de nuevo.',
            type: 'error'
          });
        }
      }
    );
  };
  
  
  const clearRoute = () => {
    setDirections(null);
    originRef.current.value = '';
    destinationRef.current.value = '';
    setOrigin('');
    setDestination('');
  };
  
  if (!isLoaded) return <div>Cargando...</div>;

  return (
    <div>
      <Principal auth={auth} flash={flash}>
      {localFlash.message && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50 text-white transition-all duration-300 flex items-center justify-between min-w-[250px] ${
            localFlash.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <span>{localFlash.message}</span>
          <button
            onClick={() => setLocalFlash({ message: null, type: null })}
            className="ml-4 font-bold hover:text-gray-200 text-lg leading-none"
          >
            x
          </button>
        </div>
      )}
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: 1, padding: '20px' }}>
          <h1>Elige tu destino</h1>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Autocomplete>
                <input
                  type="text"
                  placeholder="Origen..."
                  ref={originRef}
                  className="border p-2 rounded w-64"
                />
              </Autocomplete>
              <Autocomplete>
                <input
                  type="text"
                  placeholder="Destino..."
                  ref={destinationRef}
                  className="border p-2 rounded w-64"
                />
              </Autocomplete>
              <button className="bg-blue-500 text-white p-2 rounded" onClick={calculateRoute}>
                Mostrar Ruta
              </button>
              <button className="bg-gray-400 text-white p-2 rounded" onClick={clearRoute}>
                Limpiar
              </button>
            </div>

            <div className="relative h-[500px] w-full">
              <GoogleMap
                center={centerDefault}
                zoom={6}
                mapContainerStyle={{ width: '100%', height: '500px' }}
                onLoad={(map) => setMap(map)}
                options={
                  {
                    disableDefaultUI: true,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }
                }
              >
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9', marginTop: '40px', marginLeft: '20px', borderRadius: '8px' }}>
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
                  onChange={(e) => setData('minusvalido', e.target.checked)} 
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
                onChange={(e) => setData('pasajeros', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2">Anotaciones para el taxista:</label>
              <textarea
                className="border p-2 rounded w-full"
                rows="4"
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
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Programar fecha y hora
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      </Principal>
    </div>
  );
};

export default Create;
