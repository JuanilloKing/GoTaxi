import Header from '@/Components/Header'
import Footer from '@/Components/Footer'
import FlashMessage from '@/Components/FlashMensaje'

export default function Principal({ children, auth, flash }) {
  const isLoggedIn = !!auth?.user

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} />
        {/* Modal de éxito */}
        <FlashMessage message={flash.success} type="success" />
        <FlashMessage message={flash.error} type="error" />

      <main className="p-6">{children}</main>
      <Footer />
    </div>
  )
}
