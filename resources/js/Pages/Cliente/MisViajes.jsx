import { Link, router } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import Header from '@/Components/Header';
import { usePage } from '@inertiajs/react';
import FlashMessage from '@/Components/FlashMensaje';
import { useEffect, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

export default function MisViajes({ auth, reservas }) {
  const reservaActiva = reservas.data.find(r => [2, 4].includes(r.estado_reservas_id));
  const reservasAnteriores = reservas.data.filter(r => ![2, 4].includes(r.estado_reservas_id));
  const { flash } = usePage().props;
  const [tiempoLlegada, setTiempoLlegada] = useState(null);
  const [minutosDesdeUltimaActualizacion, setMinutosDesdeUltimaActualizacion] = useState(null);


const cancelarReserva = (id) => {
  if (reservaActiva?.pagado) {
    const confirmar = confirm(
      '⚠️ Este servicio ya ha sido abonado. ¿Estás seguro de que deseas cancelar? Serás redirigido para solicitar una devolución.'
    );
    if (confirmar) {
      router.get(route('pago.reembolso.mostrar', id)); // ruta que te llevará al proceso de devolución
    }
  } else {
    if (confirm('¿Estás seguro de que quieres finalizar este servicio?')) {
      router.post(route('reservas.cancelado', id));
    }
}
};

const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_APY_KEY, // asegúrate que la clave sea válida
  libraries: ['places'],
});

useEffect(() => {
  const calcularTiempo = () => {
    if (
      !isLoaded ||
      !reservaActiva?.origen ||
      !reservaActiva?.taxista?.lat ||
      !reservaActiva?.taxista?.lng
    ) {
      return;
    }

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: reservaActiva.origen }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const origenCoords = results[0].geometry.location;

        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
          {
            origin: new google.maps.LatLng(reservaActiva.taxista.lat, reservaActiva.taxista.lng),
            destination: origenCoords,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === 'OK' && result.routes.length > 0) {
              const duracion = result.routes[0].legs[0].duration.text;
              setTiempoLlegada(duracion);
            } else {
              console.error('Error al obtener direcciones:', result);
            }
          }
        );

        // Calcular minutos desde última actualización
        if (reservaActiva.taxista.ultima_actualizacion_ubicacion) {
          const updatedAt = new Date(reservaActiva.taxista.ultima_actualizacion_ubicacion);
          const ahora = new Date();
          const diferenciaMin = Math.floor((ahora - updatedAt) / 60000);
          setMinutosDesdeUltimaActualizacion(diferenciaMin);
        }
      } else {
        console.error('Error en geocoding:', status, results);
      }
    });
  };

  calcularTiempo();
}, [isLoaded, reservaActiva]);


  return (
    <div>
      <Header />
      <FlashMessage message={flash.success} type="success" />
      <FlashMessage message={flash.error} type="error" />
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <h1 className="text-4xl font-bold text-center mb-8">Mis Viajes</h1>

        {/* Reserva activa */}
        {reservaActiva ? (
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Reserva Activa</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <p><strong>Origen:</strong> {reservaActiva.origen}</p>
              <p><strong>Destino:</strong> {reservaActiva.destino}</p>
              <p><strong>Pasajeros:</strong> {reservaActiva.num_pasajeros}</p>
              <p><strong>Vehículo adaptado:</strong> {reservaActiva.minusvalido ? 'Sí' : 'No'}</p>
              <p><strong>Fecha y hora recogida:</strong> {new Date(reservaActiva.fecha_recogida).toLocaleString('es-ES')}</p>
              <p><strong>Tiempo aproximado del viaje:</strong> {reservaActiva.duracion} min</p>
              <p><strong>Estado de la reserva:</strong> {reservaActiva.estado_reservas.estado}</p>
              <p><strong>Precio estimado:</strong> {reservaActiva.precio} €</p>
              {tiempoLlegada && (
                <p className="md:col-span-2 text-blue-600 font-semibold">
                  🚖 Tiempo aproximado de llegada del taxista: {tiempoLlegada}
                </p>
              )}
              {minutosDesdeUltimaActualizacion !== null && (
                <p className="md:col-span-2 text-sm text-gray-500 italic">
                  Última actualización: hace {minutosDesdeUltimaActualizacion} min
                </p>
              )}
            </div>
            {!reservaActiva.pagado ? (
              <a
                href={route('pago.reserva', reservaActiva.id)}
                className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mr-4"
              >
                Realizar pago
              </a>
            ) : (
              <div className="mt-4 space-y-2">
                <p className="text-green-600 font-semibold">
                  ✅ Servicio abonado correctamente
                </p>
                {reservaActiva.estado_reservas_id === 2 && (
                  <div className="space-y-2">
                  <a
                    href={route('pago.reembolso.mostrar', reservaActiva.id)}
                    className="inline-block px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
                  >
                    Cancelar pago
                  </a>
                  <p className="text-yellow-600 italic">
                    ⚠️ Si cancelas el pago, se te redirigirá al proceso de devolución.
                  </p>
                  </div>
                )}
                {reservaActiva.estado_reservas_id === 4 && (
                  <p className="text-red-600 italic">
                    ❌ No puedes cancelar el pago de un servicio que está siendo realizado
                  </p>
                )}
              </div>
            )}
            <button
              className="mt-6 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => cancelarReserva(reservaActiva.id)}
            >
              Cancelar Reserva
            </button>
              <p className="text-sm text-red-500 mt-2 italic">
                  *Atención: realizar el abono no siempre garantiza realizar el pago completo, ya que es un precio estimado.
              </p>
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">No tienes ninguna reserva activa.</p>
        )}

        {/* Historial de viajes */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Historial de Viajes</h2>
          {reservasAnteriores.length === 0 ? (
            <p className="text-gray-500 italic">Aún no tienes viajes anteriores registrados.</p>
          ) : (
            <>
              <ul className="space-y-6">
                {reservasAnteriores.map((reserva, i) => (
                  <li key={i} className="p-6 bg-white rounded-xl shadow border border-gray-100">
                    <div className="grid md:grid-cols-2 gap-4">
                      <p><strong>Fecha recogida:</strong> {new Date(reserva.fecha_recogida).toLocaleString('es-ES')}</p>
                      {reserva.estado_reservas_id !== 3 && (
                        <p><strong>Fecha llegada:</strong> {new Date(reserva.fecha_entrega).toLocaleString('es-ES')}</p>
                      )}
                      <p><strong>Origen:</strong> {reserva.origen}</p>
                      <p><strong>Destino:</strong> {reserva.destino}</p>
                      <p><strong>Pasajeros:</strong> {reserva.num_pasajeros}</p>
                      <p><strong>Estado:</strong> <span className="capitalize">{reserva.estado_reservas.estado  }</span></p>
                      {/* Valoración */}
                      <div className="col-span-2 mt-2">
                        {reserva.estado_reservas_id === 3 ? (
                          <p className="text-red-600 font-semibold">❌ No puedes calificar servicios cancelados</p>
                        ) : reserva.valoracion ? (
                          <p className="text-green-600 font-semibold">✅ Reseña realizada correctamente</p>
                        ) : (
                          <Link
                            href={route('valoraciones.create', reserva.id)}
                            className="text-blue-600 hover:underline"
                          >
                            Déjanos tu opinión sobre el servicio
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Paginación */}
              <div className="mt-8 flex justify-center gap-2">
                {reservas.links.map((link, i) => (
                  link.url ? (
                    <Link
                      key={i}
                      href={link.url}
                      className={`px-3 py-1 rounded ${
                        link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ) : (
                    <span
                      key={i}
                      className="px-3 py-1 text-gray-400"
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  )
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};