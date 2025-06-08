<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reserva Asignada</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #2D9CDB;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .body {
            padding: 30px;
        }
        .footer {
            background-color: #f0f0f0;
            color: #777;
            padding: 15px;
            text-align: center;
            font-size: 12px;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            margin-top: 25px;
            padding: 10px 20px;
            background-color: #27AE60;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .button:hover {
            background-color: #219150;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>¡Nueva reserva asignada!</h1>
        </div>

        <div class="body">
            <p>Hola <strong>{{ $reserva->taxista->users->nombre }}</strong>,</p>
            <p>Se te ha asignado una nueva reserva Tienes 2 minutos para aceptarla o se asignará a otro taxista. Aquí tienes los detalles:</p>
            <ul>
                <li><strong>Cliente:</strong> {{ $reserva->cliente->user->nombre }}</li>
                <li><strong>Teléfono:</strong> {{ $reserva->cliente->user->telefono }}</li>
                <li><strong>Origen:</strong> {{ $reserva->origen }}</li>
                <li><strong>Destino:</strong> {{ $reserva->destino }}</li>
                <li><strong>Precio:</strong> {{ $reserva->precio }} €</li>
                <li><strong>Pasajeros:</strong> {{ $reserva->num_pasajeros }}</li>
                <li><strong>Accesibilidad:</strong> {{ $reserva->minusvalido ? 'Sí' : 'No' }}</li>
                <li><strong>Fecha y hora de recogida:</strong> {{ \Carbon\Carbon::parse($reserva->fecha_recogida)->format('d/m/Y H:i') }}</li>
            </ul>

            <a href="{{ url('/') }}" class="button">Ir a la plataforma</a>
        </div>

        <div class="footer">
            Este es un mensaje automático de {{ config('app.name') }}. Por favor, no respondas a este correo.
        </div>
    </div>
</body>
</html>
