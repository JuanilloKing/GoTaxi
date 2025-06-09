import React from 'react';
import {Link, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import Principal from '@/Layouts/Principal';

export default function Index() {
  const { contactos } = usePage().props;

  return (
    <Principal>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mensajes de contacto</h1>

<div className="bg-white shadow rounded-lg p-4 space-y-6">
  {contactos.data.map((contacto) => (
    <div key={contacto.id} className="p-4 border border-black border-gray-300 rounded">
      
      {/* Datos del remitente */}
      <div className="bg-gray-100 p-4 rounded mb-3">
        <p className="text-sm text-gray-700"><strong>Nombre:</strong> {contacto.user?.nombre}</p>
        <p className="text-sm text-gray-700"><strong>Email:</strong> {contacto.user?.email}</p>
        <p className="text-sm text-gray-700"><strong>Teléfono:</strong> {contacto.user?.telefono}</p>
      </div>

      {/* Contenido del mensaje */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{contacto.asunto}</h3>
        <p className="text-gray-600 text-sm">{contacto.mensaje}</p>
        <p className="text-xs text-gray-400 mt-2">
          Enviado el {new Date(contacto.created_at).toLocaleString()}
        </p>
      </div>

    </div>
  ))}
</div>

        {/* Paginación */}
        <div className="flex justify-center mt-6 space-x-2">
          {contactos.links.map((link, index) => (
            <Link
            key={index}
            href={link.url ?? '#'}
            dangerouslySetInnerHTML={{ __html: link.label }}
            className={`px-3 py-1 border rounded ${
              link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
            />
          ))}
        </div>
      </div>
      </Principal>
  );
}
