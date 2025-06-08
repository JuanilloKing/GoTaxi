import Header from '@/Components/Header'
import Footer from '@/Components/Footer'

export default function Principal({ children, auth }) {
  const isLoggedIn = !!auth?.user

  return (
    <div className='min-h-screen flex flex-col'>
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
