import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            nombre: user.nombre,
            apellidos: user.apellidos || '',  // Agregado para los apellidos
            email: user.email,
            dni: user.dni || '',  // Agregado para el DNI
            telefono: user.telefono || '',  // Agregado para el teléfono
            password: '',  // Agregado para la contraseña
            password_confirmation: '',  // Confirmación de la contraseña
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Perfil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Cambia los siguientes datos para actualizar tu perfil.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Nombre */}
                <div>
                    <InputLabel htmlFor="nombre" value="Nombre" />

                    <TextInput
                        id="nombre"
                        className="mt-1 block w-full"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        required
                        isFocused
                        autoComplete="nombre"
                    />

                    <InputError className="mt-2" message={errors.nombre} />
                </div>

                {/* Apellidos */}
                <div>
                    <InputLabel htmlFor="apellidos" value="apellidos" />

                    <TextInput
                        id="apellidos"
                        className="mt-1 block w-full"
                        value={data.apellidos}
                        onChange={(e) => setData('apellidos', e.target.value)}
                        required
                        autoComplete="family-nombre"
                    />

                    <InputError className="mt-2" message={errors.apellidos} />
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* DNI */}
                <div>
                    <InputLabel htmlFor="dni" value="DNI" />

                    <TextInput
                        id="dni"
                        className="mt-1 block w-full"
                        value={data.dni}
                        onChange={(e) => setData('dni', e.target.value)}
                        required
                    />

                    <InputError className="mt-2" message={errors.dni} />
                </div>

                {/* Teléfono */}
                <div>
                    <InputLabel htmlFor="telefono" value="Teléfono" />

                    <TextInput
                        id="telefono"
                        className="mt-1 block w-full"
                        value={data.telefono}
                        onChange={(e) => setData('telefono', e.target.value)}
                        required
                    />

                    <InputError className="mt-2" message={errors.telefono} />
                </div>

                {/* Contraseña */}
                <div>
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        className="mt-1 block w-full"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                    />

                    <InputError className="mt-2" message={errors.password} />
                </div>

                {/* Confirmación de la contraseña */}
                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        className="mt-1 block w-full"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                    />

                    <InputError className="mt-2" message={errors.password_confirmation} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
