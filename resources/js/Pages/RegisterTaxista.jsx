import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';
import Header from '@/Components/Header';

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
    nombre: '', apellidos: '', telefono: '', dni: '', email: '',
    password: '', password_confirmation: '', ciudad: '',
    licencia_taxi: '', matricula: '', marca: '', modelo: '',
    color: '', capacidad: '', minusvalido: false,
  });

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const API_KEY = "3b3471c7f4ec44afa8588b257cc362d8";
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      fetchCitySuggestions(debouncedSearch);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearch]);

  const fetchCitySuggestions = async (query) => {
    const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&type=city&limit=5&countrycode=ES&apiKey=${API_KEY}`);
    const data = await res.json();
    setSuggestions(data.features);
    setShowSuggestions(true);
  };

  const handleSelectCity = (place) => {
    setSearch(place.properties.city);
    setData('ciudad', place.properties.city);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!data.ciudad || !suggestions.find(s => s.properties.city === data.ciudad)) {
      alert("Por favor selecciona una ciudad de las sugerencias.");
      return;
    }
    post(route('registrar-taxista.store'));
  };

  return (
    <div>
        <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full bg-white shadow-lg">
      </div>
      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg mt-4">
        <h1 className="text-2xl font-semibold mb-4 text-center">Registro de Taxista</h1>

        <form onSubmit={submit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="nombre" value="Nombre" />
              <TextInput id="nombre" type="text" name="nombre" value={data.nombre} onChange={handleChange} required className="mt-1 block w-full" />
              <InputError message={errors.nombre} className="mt-2" />
            </div>
            <div>
              <InputLabel htmlFor="apellidos" value="Apellidos" />
              <TextInput id="apellidos" type="text" name="apellidos" value={data.apellidos} onChange={handleChange} required className="mt-1 block w-full" />
              <InputError message={errors.apellidos} className="mt-2" />
            </div>
            <div>
              <InputLabel htmlFor="telefono" value="Teléfono" />
              <TextInput id="telefono" type="tel" name="telefono" value={data.telefono} onChange={handleChange} required className="mt-1 block w-full" />
              <InputError message={errors.telefono} className="mt-2" />
            </div>
            <div>
              <InputLabel htmlFor="dni" value="DNI" />
              <TextInput id="dni" type="text" name="dni" value={data.dni} onChange={handleChange} required className="mt-1 block w-full" />
              <InputError message={errors.dni} className="mt-2" />
            </div>
            <div>
              <InputLabel htmlFor="email" value="Email" />
              <TextInput id="email" type="email" name="email" value={data.email} onChange={handleChange} required className="mt-1 block w-full" />
              <InputError message={errors.email} className="mt-2" />
            </div>
            <div>
              <InputLabel htmlFor="ciudad" value="Ciudad" />
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                required
                className="mt-1 block w-full"
                placeholder="Introduce una ciudad"
                autoComplete='address-level2'
                />
              <InputError message={errors.ciudad} className="mt-2" />
              {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute bg-white border w-full shadow z-50 mt-1 max-h-60 overflow-y-auto">
                  {suggestions.map((place, index) => (
                      <li
                      key={index}
                      onClick={() => handleSelectCity(place)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                      {place.properties.city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <InputLabel htmlFor="password" value="Contraseña" />
              <TextInput id="password" type="password" name="password" value={data.password} onChange={handleChange} required className="mt-1 block w-full" />
              <InputError message={errors.password} className="mt-2" />
            </div>
            <div>
              <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />
              <TextInput id="password_confirmation" type="password" name="password_confirmation" value={data.password_confirmation} onChange={handleChange} required className="mt-1 block w-full" />
              <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            <h2 className="text-lg font-semibold col-span-2 mt-4">Datos del Vehículo</h2>

            <div>
              <InputLabel htmlFor="licencia_taxi" value="Licencia de Taxi" />
              <TextInput id="licencia_taxi" type="text" name="licencia_taxi" value={data.licencia_taxi} onChange={handleChange} required className="mt-1 block w-full" />
              <InputError message={errors.licencia_taxi} className="mt-2" />
            </div>
            <div>
              <InputLabel htmlFor="matricula" value="Matrícula" />
              <TextInput id="matricula" type="text" name="matricula" value={data.matricula} onChange={handleChange} required className="mt-1 block w-full" />
              <InputError message={errors.matricula} className="mt-2" />
            </div>
            <div>
              <InputLabel htmlFor="marca" value="Marca" />
              <TextInput id="marca" type="text" name="marca" value={data.marca} onChange={handleChange} required className="mt-1 block w-full" />
              <InputError message={errors.marca} className="mt-2" />
            </div>
            <div>
              <InputLabel htmlFor="modelo" value="Modelo" />
              <TextInput id="modelo" type="text" name="modelo" value={data.modelo} onChange={handleChange} required className="mt-1 block w-full" />
              <InputError message={errors.modelo} className="mt-2" />
            </div>
            <div>
              <InputLabel htmlFor="color" value="Color" />
              <TextInput id="color" type="text" name="color" value={data.color} onChange={handleChange} required className="mt-1 block w-full" />
              <InputError message={errors.color} className="mt-2" />
            </div>
            <div>
              <InputLabel htmlFor="capacidad" value="Número de Plazas" />
              <TextInput id="capacidad" type="number" name="capacidad" value={data.capacidad} onChange={handleChange} required className="mt-1 block w-full" />
              <InputError message={errors.capacidad} className="mt-2" />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="minusvalido" className="flex items-center">
              <Checkbox name="minusvalido" checked={data.minusvalido} onChange={(e) => setData('minusvalido', e.target.checked)} />
              <span className="ms-2 text-sm text-gray-600">Vehículo apto para minusválido</span>
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <PrimaryButton type="submit" disabled={processing}>Registrar</PrimaryButton>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterTaxista;
