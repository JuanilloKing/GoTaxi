import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import Footer from '@/Components/Footer';

export default function Edit({ taxista, vehiculo, usuario }) {
    const [showVehiculoForm, setShowVehiculoForm] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        nombre: usuario?.nombre || '',
        apellidos: usuario?.apellidos || '',
        email: usuario?.email || '',
        telefono: usuario?.telefono || '',
        password: '',
        password_confirmation: '',
    });


    // Formulario del vehículo
    const {
        data: vehiculoData,
        setData: setVehiculoData,
        post: postVehiculo,
        processing: processingVehiculo,
        errors: vehiculoErrors,
        reset: resetVehiculo,
    } = useForm({
        licencia_taxi: '',
        matricula: '',
        marca: '',
        modelo: '',
        color: '',
        minusvalido: false,
        capacidad: '',
    });

    useEffect(() => {
        if (recentlySuccessful) {
            setShowMessage(true);
            const timer = setTimeout(() => setShowMessage(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [recentlySuccessful]);

    const submit = (e) => {
        e.preventDefault();

        const datosFiltrados = { ...data };

        if (!data.password) {
            delete datosFiltrados.password;
            delete datosFiltrados.password_confirmation;
        }

        put(route('taxista.update'), {
            data: datosFiltrados,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
        <GuestLayout>
            <Head title="Editar Perfil de Taxista" />
            <div className="flex flex-col items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg mt-4">
                    <h1 className="text-2xl font-semibold mb-4 text-center">Editar Perfil de Taxista</h1>

                    <form onSubmit={submit}>
                        {/* Nombre */}
                        <div>
                            <InputLabel htmlFor="nombre" value="Nombre" />
                            <TextInput id="nombre" type="text" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.nombre} className="mt-2" />
                        </div>

                        {/* Apellidos */}
                        <div className="mt-4">
                            <InputLabel htmlFor="apellidos" value="Apellidos" />
                            <TextInput id="apellidos" type="text" value={data.apellidos} onChange={(e) => setData('apellidos', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.apellidos} className="mt-2" />
                        </div>

                        {/* Email */}
                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Teléfono */}
                        <div className="mt-4">
                            <InputLabel htmlFor="telefono" value="Teléfono" />
                            <TextInput id="telefono" type="text" value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.telefono} className="mt-2" />
                        </div>

                        {/* Contraseña */}
                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Contraseña" />
                            <TextInput id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Confirmar Contraseña */}
                        <div className="mt-4">
                            <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />
                            <TextInput id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="mt-6 flex items-center gap-4">
                            <PrimaryButton disabled={processing}>Actualizar Perfil</PrimaryButton>
                            <Transition show={showMessage} enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-500" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <p className="text-sm text-gray-600">Perfil actualizado.</p>
                            </Transition>
                        </div>
                    </form>

                    {/* Vehículo */}
                    <div className="mt-10 p-4 bg-gray-100 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">Vehículo actual</h2>
                        {vehiculo ? (
                            <div>
                                <p><strong>Licencia Taxi:</strong> {vehiculo.licencia_taxi}</p>
                                <p><strong>Matrícula:</strong> {vehiculo.matricula}</p>
                                <p><strong>Marca:</strong> {vehiculo.marca}</p>
                                <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
                                <p><strong>Color:</strong> {vehiculo.color}</p>
                                <p><strong>Capacidad:</strong> {vehiculo.capacidad}</p>
                                <p><strong>Adaptado:</strong> {vehiculo.minusvalido ? 'Sí' : 'No'}</p>
                            </div>
                        ) : (
                            <p>No tienes un vehículo asignado actualmente.</p>
                        )}

                        <PrimaryButton className="mt-4" onClick={() => setShowVehiculoForm(!showVehiculoForm)}>
                            Cambiar Vehículo Actual
                        </PrimaryButton>

                        {showVehiculoForm && (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                postVehiculo(route('vehiculo.cambiar'));
                            }} className="mt-4 space-y-4">
                                <div>
                                    <InputLabel value="Licencia Taxi" />
                                    <TextInput value={vehiculoData.licencia_taxi} onChange={e => setVehiculoData('licencia_taxi', e.target.value)} />
                                    <InputError message={vehiculoErrors.licencia_taxi} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Matrícula" />
                                    <TextInput value={vehiculoData.matricula} onChange={e => setVehiculoData('matricula', e.target.value)} />
                                    <InputError message={vehiculoErrors.matricula} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Marca" />
                                    <TextInput value={vehiculoData.marca} onChange={e => setVehiculoData('marca', e.target.value)} />
                                    <InputError message={vehiculoErrors.marca} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Modelo" />
                                    <TextInput value={vehiculoData.modelo} onChange={e => setVehiculoData('modelo', e.target.value)} />
                                    <InputError message={vehiculoErrors.modelo} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Color" />
                                    <TextInput value={vehiculoData.color} onChange={e => setVehiculoData('color', e.target.value)} />
                                    <InputError message={vehiculoErrors.color} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel value="Capacidad" />
                                    <TextInput value={vehiculoData.capacidad} onChange={e => setVehiculoData('capacidad', e.target.value)} />
                                    <InputError message={vehiculoErrors.capacidad} className="mt-2" />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="minusvalido"
                                        type="checkbox"
                                        checked={vehiculoData.minusvalido}
                                        onChange={e => setVehiculoData('minusvalido', e.target.checked)}
                                    />
                                    <label htmlFor="minusvalido" className="ml-2">Adaptado a personas con movilidad reducida</label>
                                </div>
                                <InputError message={vehiculoErrors.minusvalido} className="mt-2" />
                                <PrimaryButton type="submit" disabled={processingVehiculo}>Guardar nuevo vehículo</PrimaryButton>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
        <Footer />
        </>
    );
}
