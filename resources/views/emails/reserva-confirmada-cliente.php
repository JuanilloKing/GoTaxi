<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reserva Confirmada</title>
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
    <div class="header">
    <h1>¡Tu reserva ha sido confirmada!</h1>
    </div>
    <div class="body">
        <p>Hola {{ $reserva->cliente->users->nombre }},</p>

        <p>Tu reserva ha sido aceptada por un taxista.</p>

        <p>Puedes entrar en la <a href="{{ url('www.GoTaxi.com') }}">web</a> para ver más detalles.</p>

        <p>Gracias por confiar en nuestro servicio.</p>

    <div class="footer">
        Este es un mensaje automático de {{ config('app.name') }}. Por favor, no respondas a este correo.
    </div>
</body>
</html>
