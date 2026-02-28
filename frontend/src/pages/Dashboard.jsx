// src/pages/Dashboard.jsx - UPDATED with all features
import { useState, useMemo } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import TransactionModal from '../components/TransactionModal';
import TransactionList from '../components/TransactionList';
import { IncomeExpenseChart, ExpenseBreakdownChart } from '../components/Charts';
import LoadingSpinner from '../components/LoadingSpinner';
import Success from '../components/Success';

export default function Dashboard() {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const { user } = useAuth();

  const {
    transactions,
    monthlySummary,
    expenseBreakdown,
    isLoading,
    error,
    successMessage,
    addIncome,
    addExpense,
    deleteTransaction,
    clearSuccessMessage,
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

  if (isLoading && !transactions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 selection:bg-indigo-200">
      <Sidebar />

      {successMessage && (
        <Success
          message={successMessage}
          onClose={clearSuccessMessage}
        />
      )}

      <main className="ml-72 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              Welcome back, <span className="text-indigo-600 font-bold">{user?.name || 'User'}</span>! Here's your financial overview
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsIncomeModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Record Income
            </button>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-400 hover:to-rose-300 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Record Expense
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

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
            isPercentage={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Income vs Expenses</h2>
            <div className="h-64">
              <IncomeExpenseChart monthlyData={monthlySummary} />
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Expense Breakdown</h2>
            <div className="h-64">
              <ExpenseBreakdownChart breakdownData={expenseBreakdown} />
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-white/80 backdrop-blur-xl p-6 rounded-3xl premium-shadow border border-slate-200/50 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Recent Transactions</h2>
            <button className="text-indigo-600 hover:text-indigo-500 font-bold text-sm transition-colors relative group">
              View All
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
            isLoading={isLoading}
          />
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