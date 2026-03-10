import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

export default function Alert({ message, type = 'info', onClose, duration = 5000 }) {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const styles = {
        success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        error: 'bg-rose-50 text-rose-800 border-rose-200',
        warning: 'bg-amber-50 text-amber-800 border-amber-200',
        info: 'bg-indigo-50 text-indigo-800 border-indigo-200'
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-rose-500" />,
        warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
        info: <Info className="w-5 h-5 text-indigo-500" />
    };

    return (
        <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl animate-slide-up ${styles[type]}`}>
            {icons[type]}
            <p className="text-sm font-bold">{message}</p>
            <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
