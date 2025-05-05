import Principal from '@/Layouts/Principal'
import { Link } from '@inertiajs/react'
import { useState } from 'react'
import { usePage } from '@inertiajs/react';
import FlashMessage from '@/Components/FlashMensaje';
import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
 

export default function Welcome({ auth }) {
  const isLoggedIn = !!auth.user
  const isCliente = isLoggedIn && auth.user.tipable_type === 'App\\Models\\Cliente'
  const isTaxista = isLoggedIn && auth.user.tipable_type === 'App\\Models\\Taxista'
  const taxistaId = isTaxista ? auth.user.tipable_id : null;
  const { flash } = usePage().props;
  const [showMsg, setShowMsg] = useState(false)
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const handleClick = (e) => {
    if (isLoggedIn) {
      e.preventDefault()
      setShowMsg(true)
      setTimeout(() => setShowMsg(false), 3000)
    }
  }

  return (
    <Principal auth={auth} flash={flash}>
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-24 text-lg">
        {/* Sección para usuario no logueado */}
        {!isLoggedIn ? (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">Inicia sesión para ver tu actividad reciente</h2>
              <p className="text-gray-600 mb-6">
                Consulta el historial de viajes, sugerencias personalizadas, recursos de ayuda y mucho más.
              </p>
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                >
                  Inicia sesión en tu cuenta
                </Link>
                <Link
                  href="/register"
                  className="text-black border border-gray-400 px-6 py-2 rounded hover:bg-gray-100"
                >
                  ¿No tienes cuenta? Regístrate
                </Link>
              </div>
            </div>
            <div>
              <img
                src="/images/fondoHombre.jpg"
                alt="Viajes recientes"
                className="rounded-xl shadow-xl"
              />
            </div>
          </div>
        ) : isCliente ? (
          /* Sección para clientes */
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black mb-4">Reserva tu próximo taxi</h2>
              <p className="text-gray-600 mb-6">También puedes consultar tus últimos viajes realizados, o reservados</p>
              <div className="space-x-4">
                <Link
                  href="/reservar"
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                >
                  Hacer una reserva
                </Link>
                <Link
                  href="/Cliente/mis-viajes"
                  className="text-black border border-gray-400 px-6 py-2 rounded hover:bg-gray-100"
                >
                  Ver mis viajes
                </Link>
              </div>
            </div>
            <div>
              <img
                src="/images/fondoHombre.jpg"
                alt="Reserva un taxi"
                className="rounded-xl shadow-xl"
              />
            </div>
          </div>
        ) : isTaxista ? (
          /* Sección para taxistas */
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black mb-4">Bienvenido, Taxista</h2>
              <p className="text-gray-600 mb-6">Aquí podrás gestionar tus reservas,ver el historial de tus viajes realizados, y cambiar tu estado</p>
              <div className="space-x-4">
              <Link
              href={`/taxistas/${taxistaId}`}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
              Ver servicios
              </Link>
                <Link
                  href="/taxista/mi-historial"
                  className="text-black border border-gray-400 px-6 py-2 rounded hover:bg-gray-100"
                >
                  Cambiar disponibilidad
                </Link>
              </div>
            </div>
            <div>
              <img
                src="/images/fondoHombre.jpg"
                alt="Taxista"
                className="rounded-xl shadow-xl"
              />
            </div>
          </div>
        ) : null}

        {/* Sección 2: visible para todos */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/images/tarifa.jpg"
              alt="Mapa con dibujo de una ruta"
              className="rounded-xl shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-4">Sabrás al momento el tiempo y precio aproximado de tu destino</h2>
            <p className="text-gray-600 mb-6">
              Contamos con un sistema de estimación de tiempo y precio para que puedas planificar tu viaje con antelación.
            </p>
            <div className="space-x-4">
              <>
                <Link
                  href="/consultar-tarifa"
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                >
                  Consulta las tarifas
                </Link>
                <Link
                  href="/sobre-nosotros"
                  className="text-black border border-gray-400 px-6 py-2 rounded hover:bg-gray-100"
                >
                  Conoce más sobre nosotros
                </Link>
              </>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">Preguntas frecuentes</h2>
        <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(1)}>¿Cómo se calcula el precio del viaje?</AccordionHeader>
        <AccordionBody className="text-gray-600 mb-6 text-lg">
        El precio se estima automáticamente según la distancia y duración del trayecto, basándonos en datos en tiempo real.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(2)}>
        ¿Qué pasa si necesito cancelar una reserva?
        </AccordionHeader>
        <AccordionBody className="text-gray-600 mb-6 text-lg">
        Puedes cancelar tu reserva desde tu perfil, en el apartado "Mis reservas". No se aplica penalizaciones si cancelas con 24 horas de antelación.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(3)}>
        ¿Qué hago si mi taxista no aparece?
        </AccordionHeader>
        <AccordionBody className="text-gray-600 mb-6 text-lg">
        Puedes revisar el estado del viaje desde "Mis viajes" o llamar al teléfono que aparece.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 4} icon={<Icon id={4} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(4)}>
        ¿GoTaxi está disponible en todas las ciudades?
        </AccordionHeader>
        <AccordionBody className="text-gray-600 mb-6 text-lg">
        Actualmente operamos en ciudades donde tengamos taxistas activos. Al ingresar el origen, te avisamos si hay disponibilidad.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 5} icon={<Icon id={5} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(5)}>
        ¿Puedo viajar con mascotas?
        </AccordionHeader>
        <AccordionBody className="text-gray-600 mb-6 text-lg">
        Sí, llevandolo en un transportin adecuado, recomendamos indicarlo en las anotaciones al reservar.
        </AccordionBody>
      </Accordion>
      </div>
      <div>
        <img
          src="/images/pregFrec.jpg"
          alt="Reserva un taxi"
          className="rounded-xl shadow-xl"
        />
            </div>
      </div>
      </div>
    </Principal>
  )
}
