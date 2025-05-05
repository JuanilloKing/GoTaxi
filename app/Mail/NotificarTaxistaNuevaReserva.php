<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificarTaxistaNuevaReserva extends Mailable
{
    use Queueable, SerializesModels;

    public $origen;
    public $destino;

    public function __construct($origen, $destino)
    {
        $this->origen = $origen;
        $this->destino = $destino;
    }

    public function build()
    {
        return $this->subject('Nueva Reserva Asignada')
                    ->view('emails.nueva_reserva');
    }
}
