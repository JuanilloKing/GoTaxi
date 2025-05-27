import React from 'react';
import {Link, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Index() {
  const { contactos } = usePage().props;

  return (
    <>
    <Header />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mensajes de contacto</h1>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {contactos.data.map((contacto) => (
            <div key={contacto.id} className="border-b px-4 py-3">
              <div className="font-semibold">{contacto.asunto}</div>
              <div className="text-sm text-gray-600">{contacto.mensaje}</div>
              <div className="text-xs text-gray-400 mt-1">Enviado el {new Date(contacto.created_at).toLocaleString()}</div>
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
      <Footer />
    </> 
  );
}
