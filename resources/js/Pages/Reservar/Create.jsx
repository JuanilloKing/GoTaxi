import React, { useState, useRef } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { useForm, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import FlashMessage from '@/Components/FlashMensaje';

const centerDefault = { lat: 36.5, lng: -6.0 };

const Create = () => {
  const [map, setMap] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  const [distancia, setDistancia] = useState(null);
  const [duracion, setDuracion] = useState(null);
  const [tarifa, setTarifa] = useState({ precio_km: 0, precio_hora: 0 });

  const { flash } = usePage().props;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('origen', origin);
    formData.append('destino', destination);
    formData.append('distancia', distancia);
    formData.append('duracion', duracion);
    formData.append('precio', data.precio);
    formData.append('minusvalido', data.minusvalido);
    formData.append('anotaciones', data.anotaciones);
    formData.append('pasajeros', data.pasajeros);
    formData.append('lat_origen', data.lat_origen);
    formData.append('lon_origen', data.lon_origen);

    router.post(route('reservar.store'), formData);
  };

  const calculateRoute = async () => {
    if (!originRef.current.value || !destinationRef.current.value) return;

    if (originRef.current.value === destinationRef.current.value) {
      alert('El origen y el destino son iguales.');
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    try {
      const results = await new Promise((resolve, reject) => {
        directionsService.route(
          {
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === 'OK') {
              resolve(result);
            } else {
              reject(status); // Captura errores como ZERO_RESULTS
            }
          }
        );
      });

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

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: originLatLng }, async (geocodeResults, status) => {
        if (status === "OK" && geocodeResults[0]) {
          const components = geocodeResults[0].address_components;
          const provinciaOrigen = components.find(c => c.types.includes("administrative_area_level_2"))?.long_name;

          if (provinciaOrigen) {
            try {
              const response = await fetch(`/api/tarifas/${encodeURIComponent(provinciaOrigen)}`);
              const data = await response.json();

              if (data.precio_km && data.precio_hora) {
                setTarifa({ precio_km: data.precio_km, precio_hora: data.precio_hora });

                const precioCalculado = (km * data.precio_km + min * (data.precio_hora / 60)).toFixed(2);
                setData('precio', precioCalculado);
              }
            } catch (error) {
              console.error("Error al obtener tarifa:", error);
            }
          }
        }
      });
    } catch (errorStatus) {
      console.error('Error al calcular ruta:', errorStatus);

      // 🔔 Aquí defines qué hacer en cada error
      if (errorStatus === 'ZERO_RESULTS') {
        alert('No se pudo encontrar una ruta entre el origen y destino.');
      } else {
        alert(`Error al calcular la ruta: ${errorStatus}`);
      }
    }
  };


  const clearRoute = () => {
  setDirections(null);
  originRef.current.value = '';
  destinationRef.current.value = '';
  setOrigin('');
  setDestination('');
  setDistancia(null);
  setDuracion(null);
  setData({
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
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <FlashMessage message={flash.success} type="success" />
      <FlashMessage message={flash.error} type="error" />

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Mapa y dirección */}
        <div className="w-full md:w-1/2 p-4">
          <h1 className="text-xl font-bold mb-4">Elige tu destino</h1>
          <div className="space-y-4">
          <div className="flex flex-col lg:flex-row flex-wrap gap-4">
            <Autocomplete className="w-full lg:w-[250px]">
              <input
                type="text"
                placeholder="Origen..."
                ref={originRef}
                className="border p-2 rounded w-full"
              />
            </Autocomplete>
            <Autocomplete className="w-full lg:w-[250px]">
              <input
                type="text"
                placeholder="Destino..."
                ref={destinationRef}
                className="border p-2 rounded w-full"
              />
            </Autocomplete>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <button
                className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto"
                onClick={calculateRoute}
              >
                Mostrar Ruta
              </button>
              <button
                className="bg-gray-400 text-white p-2 rounded w-full sm:w-auto"
                onClick={clearRoute}
              >
                Limpiar
              </button>
            </div>
          </div>
            <div className="relative w-full h-72 md:h-[500px]">
              <GoogleMap
                center={centerDefault}
                zoom={6}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                onLoad={(map) => setMap(map)}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
              >
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 p-4 bg-gray-100 mt-6 md:mt-10 rounded">
          <h1 className="text-xl font-bold mb-4">Formulario de Reserva</h1>
          {distancia && duracion && (
            <div className="text-lg font-semibold text-gray-800 bg-white p-4 rounded text-center shadow">
              Distancia: {distancia} km <br />
              Duración: {duracion} min <br />
              Precio: {data.precio} €
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
      className="border p-2 rounded w-3/4 md:w-1/2"
      min="1"
      max="8"
      onChange={(e) => setData('pasajeros', e.target.value)}
      required
    />
  </div>
  <div>
    <label className="block mb-2">Anotaciones para el taxista:</label>
    <textarea
      className="border p-2 rounded w-3/4 md:w-1/2"
      rows="4"
      onChange={(e) => setData('anotaciones', e.target.value)}
    ></textarea>
  </div>
  {distancia && duracion && (
    <div className="flex flex-col sm:flex-row gap-4 justify-between mt-4">
      <button
        type="submit"
        disabled={processing}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
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
