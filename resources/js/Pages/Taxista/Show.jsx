import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function Show({ auth, taxista }) {
  return (
    <GuestLayout user={auth.user}>
      <Head title="Servicios del taxista" />

      <div className="max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Servicios del taxista</h1>

        {/* ================= Servicio Activo ================= */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Servicio activo</h2>

          {/* // añadir funcionalidad para obtener el servicio activo del taxista */}

          <div className="bg-white p-4 rounded shadow border">
            {/* Si no hay servicio activo, podrías mostrar un mensaje: */}
            {/* <p className="text-gray-500">No hay ningún servicio activo actualmente.</p> */}

            {/* Ejemplo de datos si hay servicio activo */}
            <p><strong>Recoger en:</strong> {/* ubicación recogida */}</p>
            <p><strong>Destino:</strong> {/* ubicación destino */}</p>
            <p><strong>Cliente:</strong> {/* nombre del cliente */}</p>
            <p><strong>Teléfono:</strong> {/* teléfono del cliente */}</p>
          </div>
        </section>

        {/* ================= Servicios Finalizados ================= */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Servicios finalizados</h2>

          {/* // añadir funcionalidad para saber las reservas que han finalizado */}

          <div className="space-y-4">
            {/* // iterar aquí sobre los servicios finalizados */}
            <div className="bg-gray-50 p-4 rounded border shadow-sm">
              <p><strong>Recogida:</strong> {/* dirección */}</p>
              <p><strong>Destino:</strong> {/* dirección */}</p>
              <p><strong>Cliente:</strong> {/* nombre */}</p>
              <p><strong>Fecha:</strong> {/* fecha del viaje */}</p>
            </div>

            {/* más tarjetas según los viajes finalizados */}
          </div>
        </section>
      </div>
    </GuestLayout>
  );
}
