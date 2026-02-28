// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Calculator,
  FileText,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', to: '/transactions', icon: Wallet },
  { name: 'Budgets', to: '/budgets', icon: PieChart },
  { name: 'Tax Estimator', to: '/tax', icon: Calculator },
  { name: 'Reports', to: '/reports', icon: FileText },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-2xl border-r border-slate-200/50 flex flex-col premium-shadow z-50">
      <div className="p-6">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent drop-shadow-sm">
          TaxPal
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group
              ${isActive
                ? 'bg-indigo-50/80 text-indigo-700 font-bold shadow-sm ring-1 ring-indigo-100'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium hover:shadow-sm hover:ring-1 hover:ring-slate-100'
              }
            `}
          >
            <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${item.to === window.location.pathname ? 'text-indigo-600 scale-110' : ''}`} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-200/50 relative">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="flex items-center gap-3 px-4 py-3 w-full hover:bg-slate-50 rounded-xl transition-all duration-300 hover:shadow-sm hover:ring-1 hover:ring-slate-100 group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md group-hover:shadow-indigo-500/30 transition-all duration-300">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-bold text-slate-800 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-slate-500 font-medium truncate">
              {user?.email}
            </p>
          </div>
        </button>

        {showProfile && (
          <div className="absolute bottom-20 left-4 right-4 bg-white shadow-2xl shadow-indigo-500/10 border border-slate-100 rounded-2xl p-5 space-y-2 animate-slide-up z-50">
            <p className="text-sm text-slate-900 font-semibold">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              {user?.email}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              {user?.phone || 'No phone added'}
            </p>

            <button
              onClick={logout}
              className="mt-3 flex items-center gap-2 text-rose-600 font-medium text-sm hover:text-rose-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
