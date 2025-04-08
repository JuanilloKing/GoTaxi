import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react'; // Asegúrate de importar useForm desde Inertia.js
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';
import Header from '@/Components/Header';

// Hook para debounce
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
}

const RegisterTaxista = () => {
  const { data, setData, post, processing, errors } = useForm({
    nombre: '',
    apellidos: '',
    telefono: '',
    dni: '',
    email: '',
    password: '',
    password_confirmation: '',
    ciudad: '',
    licencia_taxi: '',
    matricula: '',
    marca: '',
    modelo: '',
    color: '',
    capacidad: '',
    minusvalido: false,
  });

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearch = useDebounce(search, 500); // Para evitar hacer demasiadas peticiones mientras el usuario escribe

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      fetchCitySuggestions(debouncedSearch); // Llamada a la API de OpenStreetMap
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearch]);

  const fetchCitySuggestions = async (query) => {
    const res = await fetch(
    `https://corsproxy.io/?https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ES&limit=5&featuretype=city`
    );
    const data = await res.json();
    setSuggestions(data);
    setShowSuggestions(true);
  };

  const handleSelectCity = (place) => {
    setSearch(place.display_name);  // Coloca la ciudad seleccionada en el campo de texto
    setData('ciudad', place.display_name);  // Actualiza el estado con la ciudad seleccionada
    setSuggestions([]);  // Limpiar las sugerencias
    setShowSuggestions(false);  // Ocultar las sugerencias
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);  // Actualiza el estado del formulario con Inertia.js
  };

  const submit = (e) => {
    e.preventDefault();
    post(route('registrar-taxista.store'));  // Envia los datos al backend a la ruta 'registrar-taxista.store'
  };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full bg-white shadow-lg">
                <Header />
            </div>
            <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg mt-4"> {/* Formulario centrado */}
                <h1 className="text-2xl font-semibold mb-4 text-center">Registro de Taxista</h1>

                {/* Campos del formulario */}
                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="nombre" value="Nombre" />
                        <TextInput
                            id="nombre"
                            type="text"
                            name="nombre"
                            value={data.nombre}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.nombre} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="apellidos" value="Apellidos" />
                        <TextInput
                            id="apellidos"
                            type="text"
                            name="apellidos"
                            value={data.apellidos}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.apellidos} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="telefono" value="Teléfono" />
                        <TextInput
                            id="telefono"
                            type="tel"
                            name="telefono"
                            value={data.telefono}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.telefono} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="dni" value="DNI" />
                        <TextInput
                            id="dni"
                            type="text"
                            name="dni"
                            value={data.dni}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.dni} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Contraseña" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="ciudad" value="Ciudad" />
                        <TextInput
                        id="ciudad"
                        type="text"
                        name="ciudad"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}  // Actualiza el valor del campo al escribir
                        required
                        className="mt-1 block w-full"
                        />
                        <InputError message={errors.ciudad} className="mt-2" />

                        {/* Mostrar sugerencias de ciudades */}
                        {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute bg-white border w-full shadow z-50 mt-1 max-h-60 overflow-y-auto">
                            {suggestions.map((place, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelectCity(place)}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {place.display_name}
                            </li>
                            ))}
                        </ul>
                        )}
                    </div>


                    <h3 className="mt-6 text-lg font-medium">Datos del Vehículo</h3>
                    <div className="mt-4">
                        <InputLabel htmlFor="licencia_taxi" value="Licencia de Taxi" />
                        <TextInput
                            id="licencia_taxi"
                            type="text"
                            name="licencia_taxi"
                            value={data.licencia_taxi}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.licencia_taxi} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="matricula" value="Matrícula" />
                        <TextInput
                            id="matricula"
                            type="text"
                            name="matricula"
                            value={data.matricula}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.matricula} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="marca" value="Marca" />
                        <TextInput
                            id="marca"
                            type="text"
                            name="marca"
                            value={data.marca}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.marca} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="modelo" value="Modelo" />
                        <TextInput
                            id="modelo"
                            type="text"
                            name="modelo"
                            value={data.modelo}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.modelo} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="color" value="Color" />
                        <TextInput
                            id="color"
                            type="text"
                            name="color"
                            value={data.color}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.color} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="capacidad" value="Número de Plazas" />
                        <TextInput
                            id="capacidad"
                            type="number"
                            name="capacidad"
                            value={data.capacidad}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.capacidad} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="minusvalido" className="flex items-center">
                            <Checkbox
                                name="minusvalido"
                                checked={data.minusvalido}
                                onChange={(e) => setData('minusvalido', e.target.checked)}
                            />
                            <span className="ms-2 text-sm text-gray-600">Vehículo apto para minusválido</span>
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <PrimaryButton type="submit" disabled={processing}>Registrar</PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );};

export default RegisterTaxista;
