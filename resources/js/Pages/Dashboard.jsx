import { router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { useEffect, useState } from 'react';

export default function Dashboard({ error = true }) {
    const [seconds, setSeconds] = useState(3);

    useEffect(() => {
        if (error) {
            const countdown = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);

            const timeout = setTimeout(() => {
                router.visit('/');
            }, 3000);

            return () => {
                clearInterval(countdown);
                clearTimeout(timeout);
            };
        }
    }, [error]);

    return (
        <div>
            <Header />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="text-center">
                                <p>Ya has iniciado sesión, volviendo al menú inicial en {seconds}...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
