import { usePage } from '@inertiajs/react';
import { useState } from 'react'
import { Link } from '@inertiajs/react'
import ResponsiveNavLink from './ResponsiveNavLink'
import NavLink from './NavLink'

export default function Header({ isLoggedIn }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const isTaxista = isLoggedIn && window.user?.tipable_type === 'App\\Models\\Taxista'
  const userName = window.user?.name || 'Usuario'
  const avatarUrl = window.user?.avatar_url || '/default-avatar.png'

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false)
  }

  const { auth } = usePage().props;
  const user = auth.user;
  

  return (
    <header className="bg-white p-4 shadow flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        GoTaxi
        <img src="/favicon.png" alt="GoTaxi logo" width="40" height="40" />
      </h1>

      <nav className="flex space-x-4">
        <NavLink href={isLoggedIn ? '/reservar' : '/register'}>
          Reservar taxi
        </NavLink>
        {!isLoggedIn && (
          <NavLink href="/login">Iniciar sesión</NavLink>
        )}
        {!isLoggedIn && (
          <NavLink href={isLoggedIn ? '/taxistas' : '/registrar-taxista'}>
            Taxistas
          </NavLink>
        )}

        {isLoggedIn && user.tipable_type === 'App\\Models\\Cliente' && (
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center gap-2">
              <span role="img" aria-label="user" className="text-xl">
                👤
              </span>
              <span>{userName}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg">
                <ul className="p-2">
                  <li>
                    <Link
                      href={isTaxista ? '/taxista-viajes' : '/cliente-viajes'}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Mis viajes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={route('profile.edit')}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Editar perfil
                    </Link>
                  </li>
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
  )
}
