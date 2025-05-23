export default function Devolucion({ reserva }) {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Solicitud de Reembolso</h1>
      <p>Has pagado <strong>{reserva.precio} €</strong> por este servicio.</p>
      <p className="text-sm text-gray-600 mt-2">
        Una vez confirmes la cancelación, procesaremos el reembolso del importe pagado.
      </p>
      <button
        className="mt-6 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={() => router.post(route('reservas.cancelado', reserva.id))}
      >
        Confirmar Cancelación y Solicitar Reembolso
      </button>
    </div>
  );
}
