// src/components/Sidebar.jsx - FIXED
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

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', to: '/transactions', icon: Wallet },
  { name: 'Budgets', to: '/budgets', icon: PieChart },
  { name: 'Tax Estimator', to: '/tax', icon: Calculator },
  { name: 'Reports', to: '/reports', icon: FileText },
];

export default function Sidebar({ onLogout }) {
  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-card m-4 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
          TaxPal
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-accent/20 text-white' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-purple-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </aside>
  );
}