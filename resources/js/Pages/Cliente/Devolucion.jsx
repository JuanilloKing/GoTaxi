import { router } from '@inertiajs/react';
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

export default function Devolucion({ reserva }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow max-w-xl w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Solicitud de Reembolso</h1>
          <p>Has pagado <strong>{reserva.precio} €</strong> por este servicio.</p>
          <p className="text-sm text-gray-600">
            Una vez confirmes la cancelación, procesaremos el reembolso del importe pagado.
          </p>
          <button
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={() => router.post(route('pago.reembolso', reserva.id))}
          >
            Confirmar Cancelación y Solicitar Reembolso
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
  