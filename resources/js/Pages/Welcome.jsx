import Principal from '@/Layouts/Principal'
import { Link } from '@inertiajs/react'
import { useState } from 'react'

export default function Welcome({ auth }) {
  const isLoggedIn = !!auth.user
  const [showMsg, setShowMsg] = useState(false)

  const handleClick = (e) => {
    if (isLoggedIn) {
      e.preventDefault()
      setShowMsg(true)
      setTimeout(() => setShowMsg(false), 3000)
    }
  }

  return (
    <Principal auth={auth}>
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">

        {/* Sección dinámica según login */}
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
                  ¿No tienes cuenta de GoTaxi? Regístrate
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
        ) : (
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
        )}

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

      </div>
    </Principal>
  )
}
