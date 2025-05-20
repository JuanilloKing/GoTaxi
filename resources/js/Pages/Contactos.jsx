import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 text-center">
        <motion.img
          src="/images/contactanos.jpg"
          alt="Contáctanos"
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Contáctanos</h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-6">
            ¿Tienes alguna duda o quieres colaborar con nosotros? Puedes escribirnos o llamarnos directamente.
          </p>

          <div className="text-left space-y-4">
            <p className="text-lg flex items-center gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-6 h-6"
              />
              <span>
                <span className="font-semibold">WhatsApp:</span>{' '}
                <a href="https://wa.me/34600111222" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                  +34 600 111 222
                </a>
              </span>
            </p>
            <p className="text-lg">
              📧 <span className="font-semibold">Email:</span>{' '}
              <a href="mailto:GoTaxi@gmail.com" className="text-blue-600 hover:underline">
                Gotaxi@gmail.com
              </a>
            </p>

          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
