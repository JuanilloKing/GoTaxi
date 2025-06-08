import { usePage, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import NavLink from './NavLink';
import { useEffect } from 'react';
import axios from 'axios';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { auth } = usePage().props;
  const estadoId = auth.estado_id;
  const user = auth.user;
  const isLoggedIn = !!user;
  const [hasReservaActiva, setHasReservaActiva] = useState(auth.hasReservaActiva || false);

  const isTaxista = user?.tipable_type === 'App\\Models\\Taxista';

useEffect(() => {
  if (!isTaxista || !("geolocation" in navigator)) return;

  let intervalId = null;

  const enviarUbicacion = (lat, lng) => {
    axios.post(route('taxista.ubicacion.update'), {
      lat,
      lng,
    }).catch(error => {
      console.error('❌ Error al enviar ubicación:', error);
    });
  };  

  // Intentar obtener permiso inicial
  navigator.geolocation.getCurrentPosition(
    () => {
      intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            enviarUbicacion(latitude, longitude);
          },
          (error) => {
            console.warn('⚠️ Error obteniendo ubicación:', error);
          }
        );
      }, 3000);
    },
    (error) => {
      console.error('🚫 Permiso de geolocalización denegado o fallido:', error);
    }
  );

  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}, [isTaxista]);

  useEffect(() => {
    if (!isTaxista) return;

    const intervaloReserva = setInterval(() => {
      axios.get(route('taxista.reserva.activa'))
        .then(res => {
          setHasReservaActiva(res.data.hasReservaActiva);
        })
        .catch(err => {
          console.error('Error comprobando reserva activa:', err);
        });
    }, 5000);

    return () => clearInterval(intervaloReserva);
  }, [isTaxista]);

  const taxistaId = isTaxista ? user.tipable_id : null;
  const avatarUrl = user?.avatar_url || '/default-avatar.png';

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const getEstadoTexto = (estadoId) => {
    switch (estadoId) {
      case 1:
        return 'Disponible';
      case 2:
        return 'Ocupado';
      case 3:
        return 'No disponible';
      default:
        return 'Desconocido';
    }
  };

  const getEstadoColor = (estadoId) => {
    switch (estadoId) {
      case 1:
        return 'bg-green-500'; // Disponible
      case 2:
        return 'bg-black';     // Ocupado
      case 3:
        return 'bg-red-500';   // No disponible
      default:
        return 'bg-gray-400';  // Desconocido
    }
  };
  

  const cambiarEstado = () => {
    // Solo permite cambiar entre estado 1 (disponible) y 3 (no disponible)
    const nuevoEstado = estadoId === 1 ? 3 : 1;

    router.post(route('taxista.cambiar-estado'), {
      estado_id: nuevoEstado
    });
  };

  const enviarUbicacion = (lat, lng) => {
  router.post(route('taxista.ubicacion.update'), {
    lat,
    lng,
  }, {
    preserveScroll: true,
    preserveState: true,
    only: [], // no necesitas respuesta visible
  });
};


  return (
    <header className="bg-white p-4 shadow flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          GoTaxi
          <img src="/favicon.ico" alt="GoTaxi logo" width="40" height="40" />
        </Link>
      </h1>

      <nav className="flex space-x-4">
        <div className="relative">
          {isTaxista ? (
            <NavLink href={route('taxistas.show', taxistaId)}>
              Ver servicios
            </NavLink>
          ) : null}
          {isTaxista && hasReservaActiva && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full pointer-events-none"></span>
          )}
        </div>

        {user?.is_admin && (
          <>
            <NavLink href="/registrar-taxista">Dar de alta taxista</NavLink>
          </>
        )}  

        {isLoggedIn && (
          <div className="relative z-50">
            <button onClick={toggleDropdown} className="flex items-center gap-2">
              <span role="img" aria-label="user" className="text-xl">👤</span>
              <span>{user.nombre}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg">
                <ul className="p-2" style={{ width: '170px' }}>
                  {!isTaxista && (
                  <li>
                      <Link
                        href="/reservar"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                      Hacer reserva
                    </Link>
                  </li>
                  )}
                  <li>
                  {isTaxista ? (
                  <div className="block px-4 py-2 text-gray-800 flex items-center gap-2 cursor-default">
                    <span className={`inline-block w-3 h-3 rounded-full ${getEstadoColor(estadoId)}`}></span>
                    {getEstadoTexto(estadoId)}
                  </div>
                ) : (
                  <Link
                    href="/Cliente/mis-viajes"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center gap-2"
                  >
                    Mis viajes
                  </Link>
                )}
                  </li>

                  {isTaxista && (
                    <li>
                      <button
                        onClick={cambiarEstado}
                        className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
                      >
                        Cambiar disponibilidad
                      </button>
                    </li>
                  )}

                  <li>
                    <Link
                      href={isTaxista ? '/taxista/editar' : route('profile.edit')}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Editar perfil
                    </Link>
                  </li>
                {user?.is_admin && (
                  <>
                   <li>
                    <Link
                      href="/admin/usuarios"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Gestion usuarios
                    </Link>
                  </li>
                    <li>
                      <Link
                        href="/admin/tarifas"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Editar tarifas
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/mensajes"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Ver mensajes
                      </Link>
                    </li>
                  </>
                )}
                  <li>
                    <Link
                      href="/logout"
                      method="post"
                      as="button"
                      className="block px-4 py-2 text-red-600 hover:bg-gray-200"
                    >
                      Cerrar sesión
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
