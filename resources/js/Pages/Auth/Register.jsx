// resources/js/Pages/RegisterUser.jsx
import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

const RegisterUser = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        apellidos: '',
        dni: '',
        telefono: '',
        email: '',
        password: '',
        password_confirmation: '',
        tipable_type: 'Cliente',
    });

    const [dniError, setDniError] = useState('');
    const [tlfnoError, setTlfnoError] = useState('');

    const validarDNI = (dni) => {
        const dniRegex = /^(\d{8})([A-Z])$/i;
        const match = dni.match(dniRegex);

        if (!match) return false;

        const numero = parseInt(match[1], 10);
        const letra = match[2].toUpperCase();
        const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';

        return letras[numero % 23] === letra;
    };

    const validarTlfno = (telefono) => {
        const telefonoRegex = /^\d{9}$/;
        return telefonoRegex.test(telefono);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    return (
        <GuestLayout>
        <div className="flex flex-col items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg ">
                <h1 className="text-2xl font-semibold mb-4 text-center">Registro de Usuario</h1>

                <form onSubmit={handleSubmit}>
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
                        <InputLabel htmlFor="dni" value="DNI" />
                        <TextInput
                            id="dni"
                            type="text"
                            name="dni"
                            value={data.dni}
                            onChange={(e) => setData('dni', e.target.value)}
                            onBlur={() => {
                                if (!validarDNI(data.dni)) {
                                    setDniError('El DNI no es válido');
                                } else {
                                    setDniError('');
                                }
                            }}
                            required
                            className={`mt-1 block w-full ${dniError ? 'border-red-500' : ''}`}
                        />
                        <InputError message={dniError || errors.dni} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="telefono" value="Teléfono" />
                        <TextInput
                            id="telefono"
                            type="tel"
                            name="telefono"
                            value={data.telefono}
                            onChange={(e) => setData('telefono', e.target.value)}
                            onBlur={() => {
                                if (!validarTlfno(data.telefono)) {
                                    setTlfnoError('El teléfono no es válido');
                                } else {
                                    setTlfnoError('');
                                }
                            }}
                            required
                            className={`mt-1 block w-full ${tlfnoError ? 'border-red-500' : ''}`}
                        />
                        <InputError message={tlfnoError || errors.telefono} className="mt-2" />
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

                    <input type="hidden" name="tipable_type" value="Cliente" />

                    <div className="mt-6 flex items-center justify-between">
                        <Link
                            href={route('login')}
                            className="text-sm text-gray-600 underline hover:text-gray-900"
                        >
                            ¿Ya registrado?
                        </Link>
                        <PrimaryButton type="submit" disabled={processing}>
                            Registrar
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    </GuestLayout>
    );
};

export default RegisterUser;
