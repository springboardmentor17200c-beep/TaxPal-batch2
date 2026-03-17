import React, { useState, useEffect } from 'react';
import { X, Bell, AlertTriangle, AlertCircle, Clock, Calendar } from 'lucide-react';
import { useDeadlines } from '../hooks/useDeadlines';

const UserDeadlineAlert = () => {
    const { deadlines, isLoading } = useDeadlines();
    const [approachingEvent, setApproachingEvent] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        if (deadlines.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Find deadlines within the next 7 days or recently missed (2 days)
            const alerts = deadlines.map(d => {
                const dueDate = new Date(d.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                const diffTime = dueDate - today;
                const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return { ...d, daysLeft };
            }).filter(d => d.daysLeft <= 7 && d.daysLeft >= -2)
              .sort((a, b) => a.daysLeft - b.daysLeft);

            if (alerts.length > 0) {
                setApproachingEvent(alerts[0]);
                
                // Show after a small delay
                const timer = setTimeout(() => {
                    if (!isDismissed) setIsVisible(true);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [deadlines, isDismissed]);

    if (!approachingEvent || !isVisible || isDismissed) return null;

    const getStatus = (days) => {
        if (days < 0) return 'missed';
        if (days === 0) return 'due';
        if (days <= 3) return 'urgent';
        return 'upcoming';
    };

    const status = getStatus(approachingEvent.daysLeft);

    const styles = {
        upcoming: {
            bg: 'bg-indigo-50/90',
            border: 'border-indigo-200/50',
            text: 'text-indigo-800',
            accent: 'bg-indigo-500',
            icon: <Bell className="w-6 h-6 text-indigo-600" />,
            shadow: 'shadow-indigo-500/10',
            label: 'Upcoming Goal'
        },
        urgent: {
            bg: 'bg-amber-50/90',
            border: 'border-amber-200/50',
            text: 'text-amber-800',
            accent: 'bg-amber-500',
            icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
            shadow: 'shadow-amber-500/10',
            label: 'Urgent Action'
        },
        due: {
            bg: 'bg-rose-50/90',
            border: 'border-rose-200/50',
            text: 'text-rose-800',
            accent: 'bg-rose-500',
            icon: <AlertCircle className="w-6 h-6 text-rose-600" />,
            shadow: 'shadow-rose-500/10',
            label: 'Due Today'
        },
        missed: {
            bg: 'bg-slate-100/90',
            border: 'border-slate-300/50',
            text: 'text-slate-900',
            accent: 'bg-slate-600',
            icon: <Calendar className="w-6 h-6 text-slate-700" />,
            shadow: 'shadow-slate-600/10',
            label: 'Recently Missed'
        }
    };

    const currentStyle = styles[status];

    const getMessage = (d) => {
        if (d.daysLeft < 0) return `❌ You missed the deadline for "${d.title}"`;
        if (d.daysLeft === 0) return `🚨 "${d.title}" is due TODAY!`;
        if (d.daysLeft <= 3) return `⚠️ Hurry! Only ${d.daysLeft} days left for "${d.title}"`;
        return `${d.daysLeft} days left until "${d.title}"`;
    };

    return (
        <div className="w-full mb-4 animate-fade-in-up stagger-1">
            <div className={`relative overflow-hidden ${currentStyle.bg} border ${currentStyle.border} rounded-lg p-3 px-4 flex items-center justify-between shadow-sm transition-all duration-300`}>
                
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 bg-white rounded-md shadow-sm border border-white/50`}>
                        {currentStyle.icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded ${currentStyle.accent} text-white text-[10px] font-bold uppercase tracking-wide`}>
                                {currentStyle.label}
                            </span>
                            <span className="text-slate-500 text-xs font-medium">
                                Due: {new Date(approachingEvent.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        <h3 className={`text-sm font-semibold mt-0.5 ${currentStyle.text}`}>
                            {getMessage(approachingEvent)}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4">
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

export default UserDeadlineAlert;
