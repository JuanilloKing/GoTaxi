import { Link } from '@inertiajs/react'

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">GoTaxi</h1>
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
