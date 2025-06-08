import React, { useState, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import FlashMessage from '@/Components/FlashMensaje';
import Principal from '@/Layouts/Principal';

export default function UsuariosIndex() {
  const { flash } = usePage().props;
  const errorMessage = flash?.error;
  const successMessage = flash?.success;
  const { users, filters, auth } = usePage().props;

  const [search, setSearch] = useState(filters.search || '');
  const [roles, setRoles] = useState(filters.roles || []);

  const toggleRole = (role) => {
    const newRoles = roles.includes(role)
      ? roles.filter((r) => r !== role)
      : [...roles, role];

    setRoles(newRoles);
    // Ejecutar el filtro automáticamente al hacer clic
    router.get(
      route('admin.users.index'),
      { search, roles: newRoles },
      { preserveState: true, replace: true }
    );
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(
        route('admin.users.index'),
        { search, roles },
        { preserveState: true, replace: true }
      );
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const toggleAdmin = (id, isAdmin) => {
    const message = isAdmin
      ? '¿Seguro que quieres quitar admin a este usuario?'
      : '¿Seguro que quieres hacer admin a este usuario?';

    if (confirm(message)) {
      router.put(route('admin.users.togle-admin', id));
    }
  };

  const deleteUser = (id) => {
    if (confirm('¿Seguro que quieres eliminar este usuario?')) {
      router.delete(route('admin.users.destroy', id));
    }
  };

  return (
    <Principal auth={auth}>
      <FlashMessage message={flash.success} type="success" />
      <FlashMessage message={flash.error} type="error" />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Administrar Usuarios</h1>

        <form onSubmit={(e) => e.preventDefault()} className="mb-4 space-y-4">
          <input
            type="text"
            placeholder="Buscar por DNI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/2"
          />

          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={roles.includes('taxista')}
                onChange={() => toggleRole('taxista')}
                className="mr-2"
              />
              Taxista
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={roles.includes('cliente')}
                onChange={() => toggleRole('cliente')}
                className="mr-2"
              />
              Cliente
            </label>
          </div>
        </form>

        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Nombre</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">DNI</th>
              <th className="border px-4 py-2 text-left">Rol</th>
              <th className="border px-4 py-2 text-left">Admin</th>
              <th className="border px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.data
              .filter((user) => user.id !== auth.user.id)
              .map((user) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">{user.nombre} {user.apellidos}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.dni}</td>
                  <td className="border px-4 py-2">
                    {user.tipable_type?.includes('Taxista') ? (
                      <Link
                        href={route('admin.taxistas.show', user.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Taxista
                      </Link>
                    ) : (
                      'Cliente'
                    )}
                  </td>
                  <td className="border px-4 py-2">{user.is_admin ? 'Sí' : 'No'}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => toggleAdmin(user.id, user.is_admin)}
                      className={`hover:underline ${
                        user.is_admin ? 'text-green-600' : 'text-blue-600'
                      }`}
                    >
                      {user.is_admin ? 'Quitar admin' : 'Hacer admin'}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            {users.data.filter((u) => u.id !== auth.user.id).length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-6 flex justify-center space-x-2">
          {users.links.map((link, i) => (
            <Link
              key={i}
              href={link.url || '#'}
              className={`px-3 py-1 rounded text-sm ${
                link.active
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </main>
    </Principal>
  );
}
