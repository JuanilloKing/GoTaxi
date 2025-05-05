import { Link, router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import Principal from '@/Layouts/Principal'


export default function MisViajes({ auth, reservas }) {
  const reservaActiva = reservas.data.find(r => r.estado_reservas_id === 2);
  const reservasAnteriores = reservas.data.filter(r => r.estado !== 'activa');
  const { flash } = usePage().props;
  const cancelarReserva = (id) => {
    if (confirm('¿Estás seguro de que quieres finalizar este servicio?')) {
      router.post(route('reservas.cancelar', id));
    }
  };

  return (
      <Principal auth={auth} flash={flash}>
    <div>
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
            </div>
            <button
              className="mt-6 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => cancelarReserva(reservaActiva.id)}
            >
              Cancelar Reserva
            </button>
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
                      <p><strong>Origen:</strong> {reserva.origen}</p>
                      <p><strong>Destino:</strong> {reserva.destino}</p>
                      <p><strong>Fecha recogida:</strong> {new Date(reserva.fecha_recogida).toLocaleString('es-ES')}</p>
                      {reserva.estado_reservas.estado == "finalizada" && (
                      <p><strong>Fecha llegada:</strong> {new Date(reserva.fecha_entrega).toLocaleString('es-ES')}</p>
                      )}
                      <p><strong>Pasajeros:</strong> {reserva.num_pasajeros}</p>
                      <p><strong>Estado:</strong> <span className="capitalize">{reserva.estado_reservas.estado}</span></p>
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
    </div>
    </Principal>
  );
}
