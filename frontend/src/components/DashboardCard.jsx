// src/components/DashboardCard.jsx
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardCard({ title, value, change, icon: Icon, isPercentage }) {
  const isPositive = change > 0;

  return (
    <div className="bg-white/90 backdrop-blur border border-slate-200/50 p-6 rounded-3xl premium-shadow group relative overflow-hidden">
      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {isPercentage
              ? `${(value || 0).toFixed(2)}%`
              : `$${value?.toLocaleString() || '0'}`}
          </p>
          {change && (
            <div className={`flex items-center gap-1 mt-3 text-sm font-bold ${isPositive ? 'text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full w-fit' : 'text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full w-fit'
              }`}>
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm border border-indigo-100/50">
          <Icon className="w-6 h-6 text-indigo-600 drop-shadow-sm" />
        </div>
      </div>
    </div>
  );
}