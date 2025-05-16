import React, { useEffect, useState } from 'react';

export default function FlashMessage({ message, type = 'success' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible || !message) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50 text-white transition-all duration-300 flex items-center justify-between min-w-[250px] ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      <span>{message}</span>
      <button onClick={() => setVisible(false)} className="ml-4 font-bold hover:text-gray-200 text-lg leading-none">
        x
      </button>
    </div>
  );
}
