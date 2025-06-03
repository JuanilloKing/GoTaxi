<?php

return [

    'required' => 'El campo :attribute es obligatorio.',

    'email' => 'El campo :attribute debe ser una dirección de correo electrónico válida.',
    'min' => [
        'string' => 'El campo :attribute debe tener al menos :min caracteres.',
    ],
    'max' => [
        'string' => 'El campo :attribute no debe superar los :max caracteres.',
    ],
    // ...

    'attributes' => [
        'email' => 'correo electrónico',
        'password' => 'contraseña',
        // Agrega aquí cualquier otro campo para traducir su nombre
    ],
];
