import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
  const { flash } = usePage().props;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(null);
  const [type, setType] = useState('success');

  useEffect(() => {
    if (flash?.success) {
      setMessage(flash.success);
      setType('success');
      setVisible(true);
    } else if (flash?.error) {
      setMessage(flash.error);
      setType('error');
      setVisible(true);
    }

    if (flash?.success || flash?.error) {
      const timer = setTimeout(() => {
        setVisible(false); 
      }, 4000);

      return () => clearTimeout(timer); // Limpia el timer cuando el componente se desmonte
    }
  }, [flash]);

  const close = () => {
    setVisible(false); // Esto ahora cerrará correctamente el mensaje al hacer clic
  };

  if (!visible || !message) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50 text-white transition-all duration-300 flex items-center justify-between min-w-[250px] ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
    >
      <span>{message}</span>
      <button onClick={close} className="ml-4 font-bold hover:text-gray-200 text-lg leading-none">
        x
      </button>
    </div>
  );
}
