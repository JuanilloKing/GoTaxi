// resources/js/Components/Header.jsx
import { Link } from '@inertiajs/react'
import ResponsiveNavLink from './ResponsiveNavLink'
import NavLink from './NavLink'

export default function Header({ isLoggedIn }) {
  const isTaxista = isLoggedIn && window.user?.tipable_type === 'App\\Models\\Taxista';

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
          <NavLink href="/login"></NavLink>
        )}
        {!isLoggedIn && (
        <NavLink href={isLoggedIn ? '/taxistas' : '/registrar-taxista'}>
          Taxistas
          </NavLink>
          )}
        {isLoggedIn && (
          <Link
            href="/logout"
            method="post"
            as="button"
            className="text-red-600 hover:underline font-semibold"
          >
            Cerrar sesión
          </Link>
        )}
      </nav>
    </header>
  )
}
