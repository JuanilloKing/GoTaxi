import React, { useState } from 'react';

const RegisterTaxista = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        telefono: '',
        dni: '',
        gmail: '',
        contraseña: '',
        confirmarContraseña: '',
        ciudad: '',
        licencia_taxi: '',
        matricula: '',
        modelo: '',
        color: '',
        num_plazas: '',
    });

    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        let errors = {};

        // Validación de campos obligatorios
        if (!formData.nombre) errors.nombre = 'El nombre es obligatorio.';
        if (!formData.apellidos) errors.apellidos = 'Los apellidos son obligatorios.';
        if (!formData.telefono) errors.telefono = 'El teléfono es obligatorio.';
        if (!formData.dni) errors.dni = 'El DNI es obligatorio.';
        if (!formData.gmail) errors.gmail = 'El correo electrónico es obligatorio.';
        if (!formData.contraseña) errors.contraseña = 'La contraseña es obligatoria.';
        if (!formData.ciudad) errors.ciudad = 'La ciudad es obligatoria.';
        if (!formData.licencia_taxi) errors.licencia_taxi = 'La licencia de taxi es obligatoria.';
        if (!formData.matricula) errors.matricula = 'La matrícula es obligatoria.';
        if (!formData.modelo) errors.modelo = 'El modelo es obligatorio.';
        if (!formData.color) errors.color = 'El color del vehículo es obligatorio.';
        if (!formData.num_plazas) errors.num_plazas = 'El número de plazas es obligatorio.';

        // Validación de formatos
        const dniRegex = /^[0-9]{8}[A-Za-z]{1}$/;
        if (formData.dni && !dniRegex.test(formData.dni)) {
            errors.dni = 'El DNI no es válido.';
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (formData.gmail && !emailRegex.test(formData.gmail)) {
            errors.gmail = 'El correo electrónico no es válido.';
        }

        // Contraseña y Confirmar Contraseña
        if (formData.contraseña !== formData.confirmarContraseña) {
            errors.confirmarContraseña = 'Las contraseñas no coinciden.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        console.log('Form Data Submitted:', formData);
        // Aquí se debe agregar la lógica para enviar los datos al servidor
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Registro de Taxista</h1>
            <div>
                <label>Nombre:</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                {formErrors.nombre && <span>{formErrors.nombre}</span>}
            </div>
            <div>
                <label>Apellidos:</label>
                <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                {formErrors.apellidos && <span>{formErrors.apellidos}</span>}
            </div>
            <div>
                <label>Teléfono:</label>
                <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
                {formErrors.telefono && <span>{formErrors.telefono}</span>}
            </div>
            <div>
                <label>DNI:</label>
                <input type="text" name="dni" value={formData.dni} onChange={handleChange} required />
                {formErrors.dni && <span>{formErrors.dni}</span>}
            </div>
            <div>
                <label>Gmail:</label>
                <input type="email" name="gmail" value={formData.gmail} onChange={handleChange} required />
                {formErrors.gmail && <span>{formErrors.gmail}</span>}
            </div>
            <div>
                <label>Contraseña:</label>
                <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} required />
                {formErrors.contraseña && <span>{formErrors.contraseña}</span>}
            </div>
            <div>
                <label>Confirmar Contraseña:</label>
                <input type="password" name="confirmarContraseña" value={formData.confirmarContraseña} onChange={handleChange} required />
                {formErrors.confirmarContraseña && <span>{formErrors.confirmarContraseña}</span>}
            </div>
            <div>
                <label>Ciudad:</label>
                <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
                {formErrors.ciudad && <span>{formErrors.ciudad}</span>}
            </div>
            <h3>Datos del Vehículo</h3>
            <div>
                <label>Licencia de Taxi:</label>
                <input type="text" name="licencia_taxi" value={formData.licencia_taxi} onChange={handleChange} required />
                {formErrors.licencia_taxi && <span>{formErrors.licencia_taxi}</span>}
            </div>
            <div>
                <label>Matrícula:</label>
                <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required />
                {formErrors.matricula && <span>{formErrors.matricula}</span>}
            </div>
            <div>
                <label>Modelo:</label>
                <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} required />
                {formErrors.modelo && <span>{formErrors.modelo}</span>}
            </div>
            <div>
                <label>Color:</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} required />
                {formErrors.color && <span>{formErrors.color}</span>}
            </div>
            <div>
                <label>Número de Plazas:</label>
                <input type="number" name="num_plazas" value={formData.num_plazas} onChange={handleChange} required />
                {formErrors.num_plazas && <span>{formErrors.num_plazas}</span>}
            </div>
            <button type="submit">Registrar</button>
        </form>
    );
};

export default RegisterTaxista;
