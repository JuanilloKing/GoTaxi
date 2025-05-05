import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

import Principal
 from '@/Layouts/Principal';
export default function Show({reservaActiva, reservasFinalizadas }) {
  const { post } = useForm();
  const { auth, flash } = usePage().props;

  const finalizarReserva = (id) => {
    if (confirm('¿Estás seguro de que quieres finalizar este servicio?')) {
      post(route('reservas.finalizar', id));
    }
  };

  return (
    <Principal auth={auth} flash={flash}>
      <Head title="Servicios del taxista" />

      <div className="max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Servicios del taxista</h1>

        {/* ================= Servicio Activo ================= */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Servicio activo</h2>

          {reservaActiva ? (
            <div className="bg-green-50 p-4 rounded shadow border border-green-300">
              <p><strong>Recoger en:</strong> {reservaActiva.origen}</p>
              <p><strong>Destino:</strong> {reservaActiva.destino}</p>
              <p><strong>Nombre cliente:</strong> {reservaActiva.cliente.user.nombre}</p>
              <p><strong>Teléfono:</strong> {reservaActiva.cliente.user.telefono}</p>
              <p><strong>Anotaciones:</strong>{' '}
                {reservaActiva.anotaciones?.trim() ? (
                  reservaActiva.anotaciones
                ) : (
                  <span className="text-gray-400 italic">No hay anotaciones</span>
                )}
              </p>
              <button
                onClick={() => finalizarReserva(reservaActiva.id)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Marcar como entregado
              </button>
            </div>
          ) : (
            <p className="text-gray-500">No hay ningún servicio activo actualmente.</p>
          )}
        </section>

        {/* ================= Servicios Finalizados ================= */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Servicios finalizados</h2>

          {reservasFinalizadas.data.length === 0 ? (
            <p className="text-gray-500">Aún no hay servicios finalizados.</p>
          ) : (
            <>
              <div className="space-y-4">
                {reservasFinalizadas.data.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="bg-gray-50 p-4 rounded border shadow-sm hover:shadow transition"
                  >
                    <p><strong>Recogida:</strong> {reserva.origen}</p>
                    <p><strong>Destino:</strong> {reserva.destino}</p>
                    <p><strong>Cliente:</strong> {reserva.cliente?.user?.nombre}</p>
                    <p><strong>Fecha:</strong> {new Date(reserva.fecha_entrega).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              <div className="mt-8 flex justify-center gap-2">
                {reservasFinalizadas.links.map((link, i) =>
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
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </Principal>
  );
}
