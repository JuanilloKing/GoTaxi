import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Show({ auth, taxista }) {
  return (
    <GuestLayout>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-4">Servicios del taxista</h1>
        <div className="bg-white shadow p-4 rounded">
          <p><strong>ID:</strong> {taxista.id}</p>
          <p><strong>Ciudad:</strong> {taxista.ciudad}</p>
          <p><strong>Vehículo ID:</strong> {taxista.vehiculo_id}</p>
          <p><strong>Estado ID:</strong> {taxista.estado_taxistas_id}</p>
        </div>
      </div>
    </GuestLayout>
  );
}
