import Header from '@/Components/Header'
import Footer from '@/Components/Footer'

export default function Principal({ children, auth }) {
  const isLoggedIn = !!auth?.user

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} />
      <main className="p-6">{children}</main>
      <Footer />
    </div>
  )
}
