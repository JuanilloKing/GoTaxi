// resources/js/Layouts/GuestLayout.jsx
import Header from '@/Components/Header'; // Importamos el Header

export default function GuestLayout({ children, isLoggedIn }) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Incluimos el Header común en todas las páginas */}
            <Header isLoggedIn={isLoggedIn} />

            {/* Contenido específico de la página */}
            <main className="p-4">
                {children}
            </main>
        </div>
    );
}
