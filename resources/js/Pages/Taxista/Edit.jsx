import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ taxista }) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        nombre: taxista.nombre || '',
        apellidos: taxista.apellidos || '',
        email: taxista.email || '',
        dni: taxista.dni || '',
        telefono: taxista.telefono || '',
        password: '',
        password_confirmation: '',
    });

    const [showMessage, setShowMessage] = useState(false);
    const [dniError, setDniError] = useState('');

    useEffect(() => {
        if (recentlySuccessful) {
            setShowMessage(true);
            const timer = setTimeout(() => setShowMessage(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [recentlySuccessful]);

    const submit = (e) => {
        e.preventDefault();
    
        const dni = data.dni.trim();
    
        if (dni !== '') {
            const dniRegex = /^[0-9]{8}[A-Za-z]$/;
            const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    
            if (!dniRegex.test(dni)) {
                setDniError('El DNI debe tener 8 números seguidos de una letra. Ej: 12345678A');
                return;
            }
    
            const numero = parseInt(dni.substring(0, 8), 10);
            const letra = dni.substring(8).toUpperCase();
            const letraCorrecta = letras[numero % 23];
    
            if (letra !== letraCorrecta) {
                setDniError(`La letra del DNI no es correcta.`);
                return;
            }
        }
    
        setDniError('');
    
        put(route('taxista.update'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };



    return (
        <GuestLayout>
            <Head title="Editar Perfil de Taxista" />
            <div className="flex flex-col items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg mt-4">
                    <h1 className="text-2xl font-semibold mb-4 text-center">Editar Perfil de Taxista</h1>

                    <form onSubmit={submit}>
                        {/* Nombre */}
                        <div>
                            <InputLabel htmlFor="nombre" value="Nombre" />
                            <TextInput
                                id="nombre"
                                type="text"
                                name="nombre"
                                value={data.nombre}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('nombre', e.target.value)}
                            />
                            <InputError message={errors.nombre} className="mt-2" />
                        </div>

                        {/* Apellidos */}
                        <div className="mt-4">
                            <InputLabel htmlFor="apellidos" value="Apellidos" />
                            <TextInput
                                id="apellidos"
                                type="text"
                                name="apellidos"
                                value={data.apellidos}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('apellidos', e.target.value)}
                            />
                            <InputError message={errors.apellidos} className="mt-2" />
                        </div>

                        {/* Email */}
                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* DNI */}
                        <div className="mt-4">
                            <InputLabel htmlFor="dni" value="DNI" />
                            <TextInput
                                id="dni"
                                type="text"
                                name="dni"
                                value={data.dni}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('dni', e.target.value)}
                            />
                            <InputError message={dniError || errors.dni} className="mt-2" />
                        </div>

                        {/* Teléfono */}
                        <div className="mt-4">
                            <InputLabel htmlFor="telefono" value="Teléfono" />
                            <TextInput
                                id="telefono"
                                type="text"
                                name="telefono"
                                value={data.telefono}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('telefono', e.target.value)}
                            />
                            <InputError message={errors.telefono} className="mt-2" />
                        </div>

                        {/* Contraseña */}
                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Contraseña" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="new-password"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Confirmación de Contraseña */}
                        <div className="mt-4">
                            <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        {/* Botón y mensaje */}
                        <div className="mt-6 flex items-center gap-4">
                            <PrimaryButton disabled={processing}>
                                Actualizar Perfil
                            </PrimaryButton>

                            <Transition
                                show={showMessage}
                                enter="transition-opacity duration-500"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-500"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-gray-600">Perfil actualizado.</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
