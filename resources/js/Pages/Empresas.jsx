import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import Ventajas from '@/Components/Ventajas';
import { Link } from '@inertiajs/react';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 text-center">
        <motion.img
          src="/images/reunion.jpg"
          alt="Empresas"
          className="w-full max-w-md rounded-2xl shadow-lg mb-8"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Empresas</h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-6">
            Ponte en contacto con nosotros como empresa y tendrás a tu disposición una flota de taxis de confianza.
            Gestionamos la movilidad de tu equipo o tus clientes de forma eficiente, profesional y segura.
            Contamos con taxistas verificados y comprometidos para dar un servicio de calidad adaptado a tus necesidades.
            Los precios son competitivos y ajustados a cada tipo de servicio, ya sea para traslados al aeropuerto, reuniones o eventos especiales.
            Si deseas más información, no dudes en <Link href="/contactos" className="text-blue-500 hover:underline">contactarnos</Link>.
          </p>

        </motion.div>
      </main>

      <Ventajas />
      <Footer />
    </div>
  );
}
