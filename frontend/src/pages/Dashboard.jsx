// src/pages/Dashboard.jsx - FIXED (logout navigation)
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, DollarSign, TrendingUp, TrendingDown, Percent, Wallet } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import TransactionModal from '../components/TransactionModal';
import TransactionList from '../components/TransactionList';
import { IncomeExpenseChart, ExpenseBreakdownChart } from '../components/Charts';
import { useTransactions } from '../hooks/useTransactions';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const {
    transactions,
    monthlySummary,
    expenseBreakdown,
    isLoading,
    addIncome,
    addExpense,
  } = useTransactions();

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const estimatedTax = totalIncome * 0.25;
    const savingsRate = totalIncome > 0 
      ? ((totalIncome - totalExpenses) / totalIncome) * 100 
      : 0;

    return {
      income: totalIncome,
      expenses: totalExpenses,
      tax: estimatedTax,
      savings: savingsRate,
      incomeChange: 12.5,
      expenseChange: 8.3,
      taxChange: 5.2,
      savingsChange: 3.1,
    };
  }, [transactions]);

    const handleLogout = () => {
      logout();
};


  if (isLoading && !transactions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy to-purple">
      <Sidebar onLogout={handleLogout} />
      
      <main className="ml-72 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, here's your financial overview</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setIsIncomeModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Record Income
            </button>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Record Expense
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Monthly Income"
            value={stats.income}
            change={stats.incomeChange}
            icon={TrendingUp}
          />
          <DashboardCard
            title="Monthly Expenses"
            value={stats.expenses}
            change={stats.expenseChange}
            icon={TrendingDown}
          />
          <DashboardCard
            title="Estimated Tax Due"
            value={stats.tax}
            change={stats.taxChange}
            icon={DollarSign}
          />
          <DashboardCard
            title="Savings Rate"
            value={stats.savings}
            change={stats.savingsChange}
            icon={Percent}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <h2 className="text-lg font-medium text-white mb-4">Income vs Expenses</h2>
            <div className="h-64">
              <IncomeExpenseChart monthlyData={monthlySummary} />
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-lg font-medium text-white mb-4">Expense Breakdown</h2>
            <div className="h-64">
              <ExpenseBreakdownChart breakdownData={expenseBreakdown} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Recent Transactions</h2>
            <button className="text-accent hover:text-accent/80 text-sm transition-colors">
              View All
            </button>
          </div>
          
          <TransactionList transactions={transactions.slice(0, 10)} />
        </div>
      </main>

      <TransactionModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSubmit={addIncome}
        type="income"
      />

      <TransactionModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={addExpense}
        type="expense"
      />
    </div>
  );
}