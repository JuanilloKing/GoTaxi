import { useForm } from '@inertiajs/react';
import Principal from '@/Layouts/Principal';

export default function CrearValoracion({ reserva }) {
  const { data, setData, post, processing, errors } = useForm({
    reserva_id: reserva.id,
    cliente_id: reserva.cliente_id,
    taxista_id: reserva.taxista_id,
    puntuacion: 0,
    comentario: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('valoraciones.store'));
  };
  
  return (
    <div>
      <Principal>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Valorar tu viaje</h1>

        <div className="mb-4 text-gray-700">
          <p><strong>Origen:</strong> {reserva.origen}</p>
          <p><strong>Destino:</strong> {reserva.destino}</p>
          <p><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleString('es-ES')}</p>
          <p><strong>Nombre Taxista:</strong> {reserva.taxista.nombre}</p>
        </div>

        <form onSubmit={submit} id="form" className="space-y-6">
          {/* Estrellas */}
          <div>
            <p className="clasificacion">
              <input id="radio1" type="radio" name="estrellas" value="5" checked={data.puntuacion == 5} onChange={() => setData('puntuacion', 5)} />
              <label htmlFor="radio1">★</label>

              <input id="radio2" type="radio" name="estrellas" value="4" checked={data.puntuacion == 4} onChange={() => setData('puntuacion', 4)} />
              <label htmlFor="radio2">★</label>

              <input id="radio3" type="radio" name="estrellas" value="3" checked={data.puntuacion == 3} onChange={() => setData('puntuacion', 3)} />
              <label htmlFor="radio3">★</label>

              <input id="radio4" type="radio" name="estrellas" value="2" checked={data.puntuacion == 2} onChange={() => setData('puntuacion', 2)} />
              <label htmlFor="radio4">★</label>

              <input id="radio5" type="radio" name="estrellas" value="1" checked={data.puntuacion == 1} onChange={() => setData('puntuacion', 1)} />
              <label htmlFor="radio5">★</label>
            </p>
            {errors.puntuacion && <p className="text-red-500 text-sm mt-1">{errors.puntuacion}</p>}
          </div>

          {/* Comentario */}
          <div>
            <label className="block mb-1 font-medium">Comentario:</label>
            <textarea
              className="border rounded w-full p-2"
              rows="4"
              value={data.comentario}
              onChange={e => setData('comentario', e.target.value)}
            />
            {errors.comentario && <p className="text-red-500 text-sm mt-1">{errors.comentario}</p>}
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={processing}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Enviar valoración
          </button>
        </form>
      </div>
      </Principal>

      {/* Estilos de las estrellas */}
      <style>{`
        #form {
          width: 100%;
          margin: 0 auto;
        }
        .clasificacion {
          direction: rtl;
          unicode-bidi: bidi-override;
          text-align: center;
        }
        .clasificacion input[type="radio"] {
          display: none;
        }
        .clasificacion label {
          font-size: 2rem;
          color: grey;
          cursor: pointer;
        }
        .clasificacion label:hover,
        .clasificacion label:hover ~ label {
          color: orange;
        }
        .clasificacion input[type="radio"]:checked ~ label {
          color: orange;
        }
      `}</style>
    </div>
  );
}
