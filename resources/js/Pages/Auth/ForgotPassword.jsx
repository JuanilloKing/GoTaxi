import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Header from '@/Components/Header';
import { Head, useForm } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import Ventajas from '@/Components/Ventajas';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
    <>
        <Header />
            <Head title="Forgot Password" />
                <div className="flex justify-center pt-20 bg-gray-100 mb-10">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            ¿Olvidaste tu contraseña?
                        </h2>

                        <p className="mb-4 text-sm text-gray-600 text-center">
                            No te preocupes. Simplemente ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                        </p>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <InputError message={errors.email} className="mt-2" />

                            <div className="mt-6 flex justify-center">
                                <PrimaryButton disabled={processing}>
                                    Enviar
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            <Ventajas />
            <Footer />
        </>
    );
}
