// /resources/js/Pages/Reservar/Create.jsx

import React from 'react';
import Mapa from "../../Components/Mapa";  // Ajusta la ruta según la ubicación de tu archivo
import Header from '@/Components/Header';

const Create = () => {
    return (
      <div>
        <Header />
        <h1>Formulario de Reserva</h1>
        {/* Muestra el mapa aquí */}
        <Mapa />
      </div>
    );
  };

  export default Create;
