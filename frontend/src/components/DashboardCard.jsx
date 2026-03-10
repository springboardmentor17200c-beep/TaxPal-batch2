// src/components/DashboardCard.jsx
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardCard({ title, value, change, icon: Icon, isPercentage, index = 0 }) {
  const isPositive = change > 0;

  return (
    <div
      className={`glass-card p-6 overflow-hidden group hover-scale animate-fade-in-up stagger-${(index % 3) + 1}`}
    >
      {/* Decorative pulse glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[10px] font-black text-indigo-500/80 uppercase tracking-[0.2em] mb-3">{title}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-black text-slate-900 tracking-tighter">
              {isPercentage
                ? `${(value || 0).toFixed(1)}`
                : `$${Math.floor(value || 0).toLocaleString()}`}
            </p>
            {isPercentage && <span className="text-xl font-bold text-slate-400 -ml-1">%</span>}
          </div>

          {change && (
            <div className={`flex items-center gap-1 mt-4 text-[10px] font-black tracking-widest uppercase ${isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}>
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 animate-bounce" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{Math.abs(change)}% trend</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-white shadow-xl shadow-indigo-500/10 rounded-2xl group-hover:bg-indigo-600 group-hover:rotate-[15deg] transition-all duration-500 group-hover:shadow-indigo-500/20 border border-slate-50">
          <Icon className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors duration-500" />
        </div>
      </div>

      {/* Visual background line */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-50 overflow-hidden">
        <div className={`h-full shimmer ${isPositive ? 'bg-emerald-500/50' : 'bg-rose-500/50'}`} style={{ width: '40%' }}></div>
      </div>
    </div>
  );
}