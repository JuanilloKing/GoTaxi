import React from 'react';
import { usePage, useForm } from '@inertiajs/react';
import FlashMessage from '@/Components/FlashMensaje';
import { motion } from 'framer-motion';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Contact() {
  const { auth } = usePage().props;
  const { flash } = usePage().props;
  const user = auth.user;

  const { data, setData, post, processing, errors } = useForm({
    asunto: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.asunto.trim() || !data.mensaje.trim()) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    post('/contacto', {
      onSuccess: () => {
        setData('asunto', '');
        setData('mensaje', '');
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header />
      <FlashMessage message={flash.success} type="success" />
      <FlashMessage message={flash.error} type="error" /> 
      <main className="flex-grow px-6 py-12 text-center">
        <motion.img
          src="/images/contactanos.jpg"
          alt="Contáctanos"
          className="w-full max-w-md mx-auto rounded-2xl shadow-lg mb-8"
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
            ¿Tienes alguna duda o quieres colaborar con nosotros? Puedes escribirnos o dejarnos un mensaje.
          </p>

          <div className="text-center space-y-4">
            <p className="text-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-6 h-6 inline-block"
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

          {!user ? (
            <p className="text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mt-8">
              <span className="font-semibold text-red-600">Inicia sesión</span> para preguntarnos tus dudas o dejar un mensaje.
            </p>
          ) : (
            <div className="max-w-xl mx-auto text-left bg-gray-100 p-6 rounded-xl shadow mt-6">
              <h2 className="text-2xl font-semibold mb-4">Déjanos tu mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Asunto *</label>
                  <input
                    type="text"
                    name="asunto"
                    value={data.asunto}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Tu mensaje *</label>
                  <textarea
                    name="mensaje"
                    value={data.mensaje}
                    onChange={handleChange}
                    rows="5"
                    className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                  disabled={processing}
                >
                  Enviar mensaje
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
