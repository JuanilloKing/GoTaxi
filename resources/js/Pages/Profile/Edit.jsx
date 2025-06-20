import { usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const isLoggedIn = auth.user !== null;

    return (
        <div>
            <Header isLoggedIn={isLoggedIn} />

            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 flex justify-center">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="w-full max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 flex justify-center">
                        <UpdatePasswordForm className="w-full max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 flex justify-center">
                        <DeleteUserForm className="w-full max-w-xl" />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
