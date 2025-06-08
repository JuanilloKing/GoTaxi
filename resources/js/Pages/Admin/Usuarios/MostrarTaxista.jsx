import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import Principal from '@/Layouts/Principal';

export default function MostrarTaxista() {
  const { taxista, media, reservas, estado, comentarios, auth } = usePage().props;

  return (
    <Principal auth={auth}>
      <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Datos del Taxista</h1>

      <div className="mb-6 bg-gray-100 rounded-lg p-6 shadow text-center">
        <p><strong>Nombre:</strong> {taxista.nombre} {taxista.apellidos}</p>
        <p><strong>Email:</strong> {taxista.email}</p>
        <p><strong>DNI:</strong> {taxista.dni}</p>
        <p><strong>Estado actual:</strong> {estado === 1 ? 'Disponible' : 'No disponible'}</p>
        <p><strong>Reservas realizadas:</strong> {reservas}</p>
        <p><strong>Puntuación media:</strong> {media ?? 'Sin valoraciones'}</p>
      </div>

        <h2 className="text-xl font-semibold mb-3">Comentarios</h2>

        {comentarios.data.length > 0 ? (
          <ul className="space-y-4">
            {comentarios.data.map((c, i) => (
              <li key={i} className="border p-4 rounded bg-gray-50">
                <p className="text-sm text-gray-600 mb-1">Puntuación: {c.puntuacion}/5</p>
                <p>{c.comentario || 'Sin comentario.'}</p>
                <p className="text-xs text-gray-400 mt-1">Fecha: {c.fecha}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay valoraciones aún.</p>
        )}

        {comentarios.links.length > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            {comentarios.links.map((link, i) => (
              <Link
                key={i}
                href={link.url || '#'}
                className={`px-3 py-1 rounded text-sm ${
                  link.active
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
      </main>
    </Principal>
  );
}
