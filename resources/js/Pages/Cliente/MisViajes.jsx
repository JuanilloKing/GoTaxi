import Footer from '@/Components/Footer';
import Principal from '@/Layouts/Principal'
import Header from '@/Components/Header';

export default function MisViajes({ auth, reservas }) {
  const reservaActiva = reservas.find(r => r.estado === 'activa');
  const reservasAnteriores = reservas.filter(r => r.estado !== 'activa');

  return (
    <div>
      <Header />
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
    </div>
        <h1 className="text-4xl font-bold text-center mb-8">Mis Viajes</h1>

        {/* Reserva activa */}
        {reservaActiva ? (
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">🚕 Reserva Activa</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <p><strong>Origen:</strong> {reservaActiva.origen}</p>
              <p><strong>Destino:</strong> {reservaActiva.destino}</p>
              <p><strong>Pasajeros:</strong> {reservaActiva.num_pasajeros}</p>
              <p><strong>Vehículo adaptado:</strong> {reservaActiva.minusvalido ? 'Sí' : 'No'}</p>
              <p><strong>Fecha y hora recogida:</strong> {new Date(reservaActiva.fecha_recogida).toLocaleString('es-ES', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}</p>
              <p><strong>Fecha y hora llegada:</strong> {new Date(reservaActiva.fecha_entrega).toLocaleString('es-ES', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}</p>
            </div>
            <button
              className="mt-6 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => alert('Cancelar reserva activa (lógica a implementar)')}
            >
              Cancelar Reserva
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">No tienes ninguna reserva activa.</p>
        )}

        {/* Historial de viajes */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4"> Historial de Viajes</h2>
          {reservasAnteriores.length === 0 ? (
            <p className="text-gray-500 italic">Aún no tienes viajes anteriores registrados.</p>
          ) : (
            <ul className="space-y-6">
              {reservasAnteriores.map((reserva, i) => (
                <li key={i} className="p-6 bg-white rounded-xl shadow border border-gray-100">
                  <div className="grid md:grid-cols-2 gap-4">
                    <p><strong>Origen:</strong> {reserva.origen}</p>
                    <p><strong>Destino:</strong> {reserva.destino}</p>
                    <p><strong>Pasajeros:</strong> {reserva.num_pasajeros}</p>
                    <p><strong>Fecha recogida:</strong> {new Date(reserva.fecha_recogida).toLocaleString('es-ES', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}</p>
                    <p><strong>Fecha llegada:</strong> {new Date(reserva.fecha_entrega).toLocaleString('es-ES', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}</p>
                    <p><strong>Estado:</strong> <span className="capitalize">{reserva.estado}</span></p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Footer />
      </div>
  );
}
