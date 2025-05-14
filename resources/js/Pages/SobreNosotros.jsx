import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import Ventajas from '@/Components/Ventajas';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 text-center">
        <motion.img
          src="/images/calle-de-noche.jpg"
          alt="Sobre Nosotros"
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Sobre Nosotros</h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Somos una empresa especializada en el desarrollo web con experiencia en el mundo del taxi.
            Nuestra misión es ofrecer a los taxistas una plataforma moderna y accesible para que puedan darse a conocer,
            encontrar más clientes y trabajar de lo que más les apasiona. Esta web está hecha por y para taxistas.
          </p>
        </motion.div>
      </main>
    <Ventajas />
      <Footer />
    </div>
  );
}
