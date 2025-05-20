import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import FlashMessage from '@/Components/FlashMensaje';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

const Index = () => {
  const { provincias, filters } = usePage().props;

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [sortAsc, setSortAsc] = useState(filters.sort === 'asc');
  const { flash } = usePage().props;
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get(
        route('tarifas.index'),
        { search: searchTerm, sort: sortAsc ? 'asc' : 'desc' },
        { preserveState: true, replace: true }
      );
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, sortAsc]);

  const startEditing = (provincia) => {
    setEditingId(provincia.id);
    setFormData({
      precio_km: provincia.precio_km,
      precio_hora: provincia.precio_hora,
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveEdit = (id) => {
    router.put(`/admin/tarifas/${id}`, formData, {
      onSuccess: () => setEditingId(null),
    });
  };

  return (
    <>
      <Header />
        {/* Modal de éxito */}
        <FlashMessage message={flash.success} type="success" />
        <FlashMessage message={flash.error} type="error" />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Tarifas por Provincia</h1>

        {/* Filtros */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <input
            type="text"
            placeholder="Buscar provincia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/2"
          />
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Ordenar {sortAsc ? 'A-Z' : 'Z-A'}
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Provincia</th>
                <th className="border px-4 py-2 text-left">Precio por KM</th>
                <th className="border px-4 py-2 text-left">Precio por Hora</th>
                <th className="border px-4 py-2 text-left">Editar</th>
              </tr>
            </thead>
            <tbody>
              {provincias.data.map((provincia) => (
                <tr key={provincia.id}>
                  <td className="border px-4 py-2">{provincia.nombre}</td>
                  <td className="border px-4 py-2">
                    {editingId === provincia.id ? (
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
                    {editingId === provincia.id ? (
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
                </tr>
              ))}
              {provincias.data.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No se encontraron provincias.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


      </main>
      <Footer />
    </>
  );
};

export default Index;
