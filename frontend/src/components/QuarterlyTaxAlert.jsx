import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { getQuarterlyTaxStatus } from '../utils/taxAlert';

const QuarterlyTaxAlert = () => {
    const [status, setStatus] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const result = getQuarterlyTaxStatus();
        setStatus(result);
        
        // Show after a small delay for better animation feel
        const timer = setTimeout(() => {
            if (!isDismissed) setIsVisible(true);
        }, 500);

        return () => clearTimeout(timer);
    }, [isDismissed]);

    if (!status || !isVisible || isDismissed) return null;

    const styles = {
        safe: {
            bg: 'bg-emerald-50/90',
            border: 'border-emerald-200/50',
            text: 'text-emerald-800',
            accent: 'bg-emerald-500',
            icon: <Calendar className="w-6 h-6 text-emerald-600" />,
            shadow: 'shadow-emerald-500/10'
        },
        urgent: {
            bg: 'bg-amber-50/90',
            border: 'border-amber-200/50',
            text: 'text-amber-800',
            accent: 'bg-amber-500',
            icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
            shadow: 'shadow-amber-500/10'
        },
        due: {
            bg: 'bg-rose-50/90',
            border: 'border-rose-200/50',
            text: 'text-rose-800',
            accent: 'bg-rose-500',
            icon: <AlertCircle className="w-6 h-6 text-rose-600" />,
            shadow: 'shadow-rose-500/10'
        },
        missed: {
            bg: 'bg-rose-100/90',
            border: 'border-rose-300/50',
            text: 'text-rose-900',
            accent: 'bg-rose-600',
            icon: <X className="w-6 h-6 text-rose-700" />,
            shadow: 'shadow-rose-600/10'
        }
    };

    const currentStyle = styles[status.status];

    return (
        <div className="w-full mb-4 animate-fade-in-up">
            <div className={`relative overflow-hidden ${currentStyle.bg} border ${currentStyle.border} rounded-lg p-3 px-4 flex items-center justify-between shadow-sm transition-all duration-300`}>
                
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 bg-white rounded-md shadow-sm border border-white/50`}>
                        {currentStyle.icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded ${currentStyle.accent} text-white text-[10px] font-bold uppercase tracking-wide`}>
                                Quarterly Tax
                            </span>
                            <span className="text-slate-500 text-xs font-medium">
                                Due: {new Date(status.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        <h3 className={`text-sm font-semibold mt-0.5 ${currentStyle.text}`}>
                            {status.message}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {status.daysLeft > 0 && (
                        <div className="hidden sm:flex items-center gap-2 border-r border-slate-200/50 pr-4">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-medium text-slate-500">{status.daysLeft} days left</span>
                        </div>
                    )}
                    
                    <button 
                        onClick={() => setIsDismissed(true)}
                        className="p-1 hover:bg-black/5 rounded font-medium transition-colors text-slate-400 hover:text-slate-600"
                        title="Dismiss alert"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuarterlyTaxAlert;
