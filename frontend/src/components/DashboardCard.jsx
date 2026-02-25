// src/components/DashboardCard.jsx
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardCard({ title, value, change, icon: Icon }) {
  const isPositive = change > 0;
  
  return (
    <div className="glass-card p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-white">${value?.toLocaleString() || '0'}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-white/5 rounded-xl">
          <Icon className="w-6 h-6 text-accent" />
        </div>
      </div>
    </div>
  );
}