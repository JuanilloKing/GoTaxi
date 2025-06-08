import { Link } from '@inertiajs/react'

export default function NavLink({ href, className = '', children, ...props }) {
  return (
    <Link
      href={href}
      className={`text-blue-600 hover:underline font-semibold ${className}`}
      {...props}
    >
      {children}
    </Link>
  )
}
