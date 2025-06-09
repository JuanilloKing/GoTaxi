import React, { useState, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import Principal from '@/Layouts/Principal';
import FlashMessage from '@/Components/FlashMensaje';

export default function UsuariosIndex() {
  const { flash, users, filters, auth } = usePage().props;

  const [search, setSearch] = useState(filters.search || '');
  const [roles, setRoles] = useState(filters.roles || []);
  const [selectedProvincia, setSelectedProvincia] = useState(filters.provincia_id || '');
  const [selectedMunicipio, setSelectedMunicipio] = useState(filters.municipio_id || '');
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  const isTaxistaChecked = roles.includes('taxista');

  useEffect(() => {
    fetch('/api/provincias')
      .then(res => res.json())
      .then(setProvincias);
  }, []);

  useEffect(() => {
    if (selectedProvincia) {
      fetch(`/api/municipios/${selectedProvincia}`)
        .then(res => res.json())
        .then(setMunicipios);
    } else {
      setMunicipios([]);
      setSelectedMunicipio('');
    }
  }, [selectedProvincia]);

  const updateFilters = (newFilters) => {
    router.get(route('admin.users.index'), {
      search,
      roles,
      provincia_id: isTaxistaChecked ? selectedProvincia : '',
      municipio_id: isTaxistaChecked ? selectedMunicipio : '',
      ...newFilters,
    }, { preserveState: true, replace: true });
  };

  const toggleRole = (role) => {
    let newRoles = [];

    if (!roles.includes(role)) {
      newRoles = [role];
    }

    setRoles(newRoles);
    if (!newRoles.includes('taxista')) {
      setSelectedProvincia('');
      setSelectedMunicipio('');
    }
    updateFilters({ roles: newRoles });
  };


  useEffect(() => {
    const delay = setTimeout(() => {
      updateFilters();
    }, 400);
    return () => clearTimeout(delay);
  }, [search]);

  const handleProvinciaChange = (e) => {
    const value = e.target.value;
    setSelectedProvincia(value);
    setSelectedMunicipio('');
    updateFilters({ provincia_id: value, municipio_id: '' });
  };

  const handleMunicipioChange = (e) => {
    const value = e.target.value;
    setSelectedMunicipio(value);
    updateFilters({ municipio_id: value });
  };

  const toggleAdmin = (id, isAdmin) => {
    const msg = isAdmin
      ? '¿Seguro que quieres quitar admin a este usuario?'
      : '¿Seguro que quieres hacer admin a este usuario?';
    if (confirm(msg)) {
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

          {isTaxistaChecked && (
            <div className="flex gap-4">
              <select
                value={selectedProvincia}
                onChange={handleProvinciaChange}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Todas las provincias</option>
                {provincias.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.provincia}
                  </option>
                ))}
              </select>

              <select
                value={selectedMunicipio}
                onChange={handleMunicipioChange}
                className="border border-gray-300 rounded px-2 py-1"
                disabled={!selectedProvincia}
              >
                <option value="">Todos los municipios</option>
                {municipios.map((mun) => (
                  <option key={mun.id} value={mun.id}>
                    {mun.municipio}
                  </option>
                ))}
              </select>
            </div>
          )}
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
                    ) : 'Cliente'}
                  </td>
                  <td className="border px-4 py-2">{user.is_admin ? 'Sí' : 'No'}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => toggleAdmin(user.id, user.is_admin)}
                      className={`hover:underline ${user.is_admin ? 'text-green-600' : 'text-blue-600'}`}
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
                link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </main>
    </Principal>
  );
}
