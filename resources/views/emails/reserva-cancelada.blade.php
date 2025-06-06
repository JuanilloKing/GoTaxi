<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reserva Cancelada</title>
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
            background-color: #EB5757;
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
        .button {
            display: inline-block;
            margin-top: 25px;
            padding: 10px 20px;
            background-color: #2D9CDB;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .button:hover {
            background-color: #238bc9;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header text-center">
            <h1>Tu reserva ha sido cancelada</h1>
        </div>

        <div class="body">
            <p>Hola <strong>{{ $reserva->cliente->user->nombre }}</strong>,</p>
            <p>Lamentablemente no hemos podido encontrar un taxista disponible para tu reserva.</p>

            <p>Detalles de tu intento de reserva:</p>
            <ul>
                <li><strong>Origen:</strong> {{ $reserva->origen }}</li>
                <li><strong>Destino:</strong> {{ $reserva->destino }}</li>
                <li><strong>Precio estimado:</strong> {{ $reserva->precio }} €</li>
                <li><strong>Fecha y hora solicitada:</strong> {{ \Carbon\Carbon::parse($reserva->fecha_recogida)->format('d/m/Y H:i') }}</li>
            </ul>

            <p>Te invitamos a volver a intentarlo más tarde. Sentimos mucho los inconvenientes ocasionados.</p>
        </div>

        <div class="footer">
            Este es un mensaje automático de {{ config('app.name') }}. Por favor, no respondas a este correo.
        </div>
    </div>
</body>
</html>
