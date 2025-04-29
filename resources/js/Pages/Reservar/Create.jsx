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
  const tarifa_km = 1.26;
  const tarifa_min = 0.2;

  const { flash } = usePage().props;
  const errorMessage = flash?.error;
  const successMessage = flash?.success;
  


  const originRef = useRef();
  const destinationRef = useRef();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyC2cXA_P-UnM8oELlSjZt08m_rMXWYTo-c',
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
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirections(results);
    setOrigin(originRef.current.value);
    setDestination(destinationRef.current.value);

    const km = (results.routes[0].legs[0].distance.value / 1000).toFixed(2);
    const min = Math.ceil(results.routes[0].legs[0].duration.value / 60);
    setDistancia(km);
    setDuracion(min);

    // Obtener latitud y longitud de los puntos de origen y destino
    const originLatLng = results.routes[0].legs[0].start_location;
    const destinationLatLng = results.routes[0].legs[0].end_location;
    
    // Enviar las coordenadas junto con los demás datos del formulario
    setData('lat_origen', originLatLng.lat());
    setData('lon_origen', originLatLng.lng());
  };
  
  const clearRoute = () => {
    setDirections(null);
    originRef.current.value = '';
    destinationRef.current.value = '';
    setOrigin('');
    setDestination('');
  };
  
  if (!isLoaded) return <div>Loading...</div>;
  
  return (
    <div>
      <Header />
      <FlashMessage message={flash.success} type="success" />
      <FlashMessage message={flash.error} type="error" />        
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
      <Footer />
    </div>
  );
};

export default Create;
