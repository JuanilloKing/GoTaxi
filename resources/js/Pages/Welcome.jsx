import Principal from '@/Layouts/Principal'

export default function Welcome({ auth }) {
  return (
    <Principal auth={auth}>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">¡Bienvenido a GoTaxi!</h2>
        <p className="text-gray-600">Reserva tu taxi de forma rápida y segura.</p>
      </div>
    </Principal>
  )
}
