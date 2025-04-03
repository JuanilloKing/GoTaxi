import React, { useState } from 'react';
import { useForm } from '@inertiajs/react'; // Asegúrate de importar useForm desde Inertia.js

const RegisterTaxista = () => {
    // Usamos useForm de Inertia.js para manejar el estado del formulario
    const { data, setData, post } = useForm({
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);  // Actualiza el estado del formulario con Inertia.js
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('registrar-taxista.store'));  // Envia los datos al backend a la ruta 'registrar-taxista.store'
    };

    return (
        <form onSubmit={submit}>
            <h1>Registro de Taxista</h1>

            {/* Campos del formulario */}
            <div>
                <label>Nombre:</label>
                <input 
                    type="text" 
                    name="nombre" 
                    value={data.nombre} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <label>Apellidos:</label>
                <input 
                    type="text" 
                    name="apellidos" 
                    value={data.apellidos} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <label>Teléfono:</label>
                <input 
                    type="tel" 
                    name="telefono" 
                    value={data.telefono} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <label>DNI:</label>
                <input 
                    type="text" 
                    name="dni" 
                    value={data.dni} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <label>Gmail:</label>
                <input 
                    type="email" 
                    name="email" 
                    value={data.email} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <label>Contraseña:</label>
                <input 
                    type="password" 
                    name="password" 
                    value={data.password} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <label>Confirmar Contraseña:</label>
                <input 
                    type="password" 
                    name="password_confirmation" 
                    value={data.password_confirmation} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <label>Ciudad:</label>
                <input 
                    type="text" 
                    name="ciudad" 
                    value={data.ciudad} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <h3>Datos del Vehículo</h3>
            <div>
                <label>Licencia de Taxi:</label>
                <input 
                    type="text" 
                    name="licencia_taxi" 
                    value={data.licencia_taxi} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <label>Matrícula:</label>
                <input 
                    type="text" 
                    name="matricula" 
                    value={data.matricula} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <label>Marca:</label>
                <input 
                    type="text" 
                    name="marca" 
                    value={data.marca} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <label>Modelo:</label>
                <input 
                    type="text" 
                    name="modelo" 
                    value={data.modelo} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <label>Color:</label>
                <input 
                    type="text" 
                    name="color" 
                    value={data.color} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <label>Número de Plazas:</label>
                <input 
                    type="number" 
                    name="capacidad" 
                    value={data.capacidad} 
                    onChange={handleChange} 
                    required 
                />
            </div>

            <div>
                <label>Vehículo apto para minusválido</label>
                <input
                    type="checkbox"
                    name="minusvalido"
                    checked={data.minusvalido}  // Si está marcado, 'minusvalido' será true
                    onChange={(e) => setData('minusvalido', e.target.checked)}  // true si marcado, false si no
                />
            </div>


            <button type="submit">Registrar</button>
        </form>
    );
};

export default RegisterTaxista;
//