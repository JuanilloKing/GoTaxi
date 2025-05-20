import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import FlashMessage from '@/Components/FlashMensaje';
import { usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import Header from '@/Components/Header';

const RegisterTaxista = () => {
  const { data, setData, post, processing, errors } = useForm({
    nombre: '', apellidos: '', telefono: '', dni: '', email: '',
    password: '', password_confirmation: '', municipio_id: '',
    licencia_taxi: '', matricula: '', marca: '', modelo: '',
    color: '', capacidad: '', minusvalido: false,
  });

  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [selectedProvincia, setSelectedProvincia] = useState('');

  // Cargar provincias al montar
  useEffect(() => {
    fetch('/api/provincias')
      .then(res => res.json())
      .then(data => setProvincias(data));
  }, []);

  // Cargar municipios cuando cambia provincia
  useEffect(() => {
    if (selectedProvincia) {
      fetch(`/api/municipios/${selectedProvincia}`)
        .then(res => res.json())
        .then(data => setMunicipios(data));
    } else {
      setMunicipios([]);
      setData('municipio_id', '');
    }
  }, [selectedProvincia]);

  const { flash } = usePage().props;
  const errorMessage = flash?.error;
  const successMessage = flash?.success;

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setData(name, type === 'checkbox' ? checked : value);
  };

  const submit = (e) => {
    e.preventDefault();
    post(route('registrar-taxista.store'));
  };

  return (
    <div>
      <Header />
      {/* Modal de éxito */}
      <FlashMessage message={flash.success} type="success" />
      <FlashMessage message={flash.error} type="error" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg mt-4">
          <h1 className="text-2xl font-semibold mb-4 text-center">Registro de Taxista</h1>

          <form onSubmit={submit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Datos personales */}
              <TextField label="Nombre" name="nombre" value={data.nombre} error={errors.nombre} onChange={handleChange} />
              <TextField label="Apellidos" name="apellidos" value={data.apellidos} error={errors.apellidos} onChange={handleChange} />
              <TextField label="Teléfono" name="telefono" value={data.telefono} error={errors.telefono} onChange={handleChange} type="tel" />
              <TextField label="DNI" name="dni" value={data.dni} error={errors.dni} onChange={handleChange} />
              <TextField label="Email" name="email" value={data.email} error={errors.email} onChange={handleChange} type="email" />

              {/* Select Provincia */}
              <div>
                <InputLabel htmlFor="provincia" value="Provincia" />
                <select
                  name="provincia"
                  id="provincia"
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  value={selectedProvincia}
                  onChange={(e) => setSelectedProvincia(e.target.value)}
                  required
                >
                  <option value="">Selecciona una provincia</option>
                  {provincias.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.provincia}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Municipio */}
              <div>
                <InputLabel htmlFor="municipio_id" value="Municipio" />
                <select
                  name="municipio_id"
                  id="municipio_id"
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  value={data.municipio_id}
                  onChange={handleChange}
                  required
                  disabled={!selectedProvincia}
                >
                  <option value="">Selecciona un municipio</option>
                  {municipios.map((mun) => (
                    <option key={mun.id} value={mun.id}>
                      {mun.municipio}
                    </option>
                  ))}
                </select>
                <InputError message={errors.ciudad} className="mt-2" />
              </div>

              <TextField label="Contraseña" name="password" value={data.password} error={errors.password} onChange={handleChange} type="password" />
              <TextField label="Confirmar Contraseña" name="password_confirmation" value={data.password_confirmation} error={errors.password_confirmation} onChange={handleChange} type="password" />

              <h2 className="text-lg font-semibold col-span-2 mt-4">Datos del Vehículo</h2>

              {/* Datos del vehículo */}
              <TextField label="Licencia de Taxi" name="licencia_taxi" value={data.licencia_taxi} error={errors.licencia_taxi} onChange={handleChange} />
              <TextField label="Matrícula" name="matricula" value={data.matricula} error={errors.matricula} onChange={handleChange} />
              <TextField label="Marca" name="marca" value={data.marca} error={errors.marca} onChange={handleChange} />
              <TextField label="Modelo" name="modelo" value={data.modelo} error={errors.modelo} onChange={handleChange} />
              <TextField label="Color" name="color" value={data.color} error={errors.color} onChange={handleChange} />
              <TextField label="Número de Plazas" name="capacidad" value={data.capacidad} error={errors.capacidad} onChange={handleChange} type="number" />
            </div>

            <div className="mt-4">
              <label htmlFor="minusvalido" className="flex items-center">
                <Checkbox name="minusvalido" checked={data.minusvalido} onChange={handleChange} />
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

// Campo de texto reutilizable
const TextField = ({ label, name, value, onChange, error, type = 'text' }) => (
  <div>
    <InputLabel htmlFor={name} value={label} />
    <TextInput id={name} type={type} name={name} value={value} onChange={onChange} required className="mt-1 block w-full" />
    <InputError message={error} className="mt-2" />
  </div>
);

export default RegisterTaxista;
