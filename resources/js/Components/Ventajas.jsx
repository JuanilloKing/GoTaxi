import React from 'react';

const features = [
  {
    img: '/images/seguridad.svg',
    title: 'Seguridad',
    desc: 'Tu protección es lo que más nos importa.',
  },
  {
    img: '/images/24-7.svg',
    title: 'La mejor atención',
    desc: 'Nuestro equipo de atención al cliente disponible siempre para ti 365/7.',
  },
  {
    img: '/images/taximetro.png',
    title: 'Transparencia',
    desc: 'Tarifas oficiales por tu seguridad y garantía.',
  },
  {
    img: '/images/taxis.png',
    title: 'Servicio garantizado',
    desc: 'Las principales compañías de taxi disponibles para ti.',
  },
  {
    img: '/images/rapido.png',
    title: 'Rápido servicio',
    desc: 'Siempre valoramos tu tiempo.',
  },
  {
    img: '/images/facil.png',
    title: 'Fácil de usar',
    desc: 'Nuestra App pensada para todos.',
  },
  {
    img: '/images/presencia.png',
    title: 'Amplia presencia',
    desc: 'Más de 100 ciudades esperándote.',
  },
  {
    img: '/images/seguridad-extra.png',
    title: 'Máxima seguridad',
    desc: 'Todas las medidas de protección e higiene.',
  },
];

export default function Ventajas() {
  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
        {features.map(({ img, title, desc }, index) => (
          <div key={index} className="flex flex-col items-center">
            <img src={img} alt={title} className="w-20 h-20 mb-4" />
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
