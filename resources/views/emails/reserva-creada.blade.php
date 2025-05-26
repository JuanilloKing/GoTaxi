<h1>Hola {{ $reserva->taxista->users->nombre }}</h1>
<p>Tienes una nueva reserva asignada:</p>
<ul>
    <li><strong>Cliente:</strong> {{ $reserva->cliente->user->nombre }}</li>
    <li><strong>Teléfono:</strong> {{ $reserva->cliente->user->telefono }}</li>
    <li><strong>Origen:</strong> {{ $reserva->origen }}</li>
    <li><strong>Destino:</strong> {{ $reserva->destino }}</li>
</ul>
