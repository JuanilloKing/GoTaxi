import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import Principal from '@/Layouts/Principal';

const Index = () => {
  const { provincias, filters = {}, editable = false } = usePage().props;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [sortAsc, setSortAsc] = useState((filters?.sort || 'asc') !== 'desc');

  const [editingId, setEditingId] = editable ? useState(null) : [null, () => {}];
  const [formData, setFormData] = editable ? useState({}) : [{}, () => {}];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    router.get(route(route().current()), {
      search: value,
      sort: sortAsc ? 'asc' : 'desc',
    }, { preserveState: true, replace: true });
  };

  const handleSortToggle = () => {
    const newSort = !sortAsc;
    setSortAsc(newSort);

    router.get(route(route().current()), {
      search: searchTerm,
      sort: newSort ? 'asc' : 'desc',
    }, { preserveState: true, replace: true });
  };

  const startEditing = (provincia) => {
    if (!editable) return;
    setEditingId(provincia.id);
    setFormData({
      precio_km: provincia.precio_km,
      precio_hora: provincia.precio_hora,
    });
  };

  const handleInputChange = (e) => {
    if (!editable) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveEdit = (id) => {
    if (!editable) return;
    router.put(`/admin/tarifas/${id}`, formData, {
      onSuccess: () => setEditingId(null),
    });
  };

  return (
    <Principal>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Tarifas por Provincia</h1>

        {/* Filtros */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <input
            type="text"
            placeholder="Buscar provincia..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/2"
          />
          <button
            onClick={handleSortToggle}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Ordenar {sortAsc ? 'Z-A' : 'A-Z'}
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border px-4 py-2 text-left">Provincia</th>
                <th className="border px-4 py-2 text-left">Precio por KM</th>
                <th className="border px-4 py-2 text-left">Precio por Hora</th>
                {editable && <th className="border px-4 py-2 text-left">Editar</th>}
              </tr>
            </thead>
            <tbody>
              {provincias.data.map((provincia) => (
                <tr key={provincia.id} className="odd:bg-white even:bg-gray-200">
                  <td className="border px-4 py-2">{provincia.nombre}</td>
                  <td className="border px-4 py-2">
                    {editable && editingId === provincia.id ? (
                      <input
                        type="number"
                        step="0.01"
                        name="precio_km"
                        value={formData.precio_km}
                        onChange={handleInputChange}
                        className="w-24 border rounded px-2 py-1"
                      />
                    ) : (
                      provincia.precio_km
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editable && editingId === provincia.id ? (
                      <input
                        type="number"
                        step="0.01"
                        name="precio_hora"
                        value={formData.precio_hora}
                        onChange={handleInputChange}
                        className="w-24 border rounded px-2 py-1"
                      />
                    ) : (
                      provincia.precio_hora
                    )}
                  </td>
                  {editable && (
                    <td className="border px-4 py-2">
                      {editingId === provincia.id ? (
                        <button
                          onClick={() => saveEdit(provincia.id)}
                          className="text-green-600 hover:underline"
                        >
                          Guardar
                        </button>
                      ) : (
                        <button
                          onClick={() => startEditing(provincia)}
                          className="text-blue-600 hover:underline"
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {provincias.data.length === 0 && (
                <tr>
                  <td colSpan={editable ? 4 : 3} className="text-center py-4 text-gray-500">
                    No se encontraron provincias.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="mt-6 flex justify-center space-x-2">
          {provincias.links.map((link, index) => (
            <Link
              key={index}
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
};

export default Index;
