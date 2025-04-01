import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, errors, reset } = useForm({
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

    const validarDNI = (dni) => {
        const dniRegex = /^(\d{8})([A-Z])$/i;
        const match = dni.match(dniRegex);

        if (!match) return false;

        const numero = parseInt(match[1], 10);
        const letra = match[2].toUpperCase();
        const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';

        return letras[numero % 23] === letra;
    };

    const submit = (e) => {
        e.preventDefault();
    
        // Actualizamos el tipable_type según el estado del checkbox
        setData('tipable_type', data.es_taxista ? 'Taxista' : 'Cliente');
        
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="nombre" value="Nombre" />

                    <TextInput
                        id="nombre"
                        name="nombre"
                        value={data.nombre}
                        className="mt-1 block w-full"
                        autoComplete="nombre"
                        isFocused={true}
                        onChange={(e) => setData('nombre', e.target.value)}
                        required
                    />

                    <InputError message={errors.nombre} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="apellidos" value="Apellidos" />

                    <TextInput
                        id="apellidos"
                        name="apellidos"
                        value={data.apellidos}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('apellidos', e.target.value)}
                        required
                    />
                    <InputError message={errors.apellidos} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="dni" value="DNI" />

                    <TextInput
                        id="dni"
                        name="dni"
                        value={data.dni}
                        className={`mt-1 block w-full ${dniError ? 'border-red-500' : ''}`}
                        autoComplete="dni"
                        onChange={(e) => setData('dni', e.target.value)}
                        onBlur={() => {
                            if (!validarDNI(data.dni)) {
                                setDniError('El DNI no es válido');
                            } else {
                                setDniError('');
                            }
                        }}
                        required
                    />

                    <InputError message={dniError || errors.dni} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="telefono" value="Teléfono" />

                    <TextInput
                        id="telefono"
                        name="telefono"
                        value={data.telefono}
                        className="mt-1 block w-full"
                        autoComplete="telefono"
                        onChange={(e) => setData('telefono', e.target.value)}
                        required
                    />

                    <InputError message={errors.telefono} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar contraseña"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>


                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        ¿Ya registrado?
                    </Link>

                    <PrimaryButton className="ms-4">
                        Registrar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
