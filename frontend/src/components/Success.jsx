// src/components/Success.jsx
import { CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export default function Success({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className="glass-card px-4 py-3 flex items-center gap-3 border border-green-500/20">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <p className="text-white">{message}</p>
        <button onClick={onClose} className="ml-4 p-1 hover:bg-white/10 rounded">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}