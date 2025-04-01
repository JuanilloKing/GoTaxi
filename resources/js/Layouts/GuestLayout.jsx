import { Link } from '@inertiajs/react'

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            GoTaxi
            <img src="/favicon.png" alt="GoTaxi logo" width="40" height="40" />
            </h1>
                <nav>
                    <Link href="/login" className="text-blue-600 font-semibold">
                        Reservar taxi
                    </Link>
                </nav>
            </header>
            <main className="p-4">{children}</main>
        </div>
    );
}
