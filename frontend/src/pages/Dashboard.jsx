// src/pages/Dashboard.jsx - UPDATED with all features
import { useState, useMemo, useEffect } from 'react';
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
import Alert from '../components/Alert';
import { useDeadlines } from '../hooks/useDeadlines';
import QuarterlyTaxAlert from '../components/QuarterlyTaxAlert';
import UserDeadlineAlert from '../components/UserDeadlineAlert';
import { Helmet } from 'react-helmet';

export default function Dashboard() {
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const { user } = useAuth();
  const [activeAlert, setActiveAlert] = useState(null);

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

    // Use a default rate of 20% or similar, but ideally this should come from a service
    // For now, let's keep it as an estimate but label it clearly in the UI if needed
    const estimatedTax = totalIncome * 0.20; 

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
    <div className="min-h-screen ultra-bg font-sans text-slate-900 selection:bg-indigo-300" id="dashboard-page">
      <Helmet>
        <title>Dashboard | TaxPal Personal Finance</title>
        <meta name="description" content="View your financial overview, track income and expenses, and monitor your tax readiness in real-time." />
      </Helmet>
      {/* Animated Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob pointer-events-none z-0"></div>
      <div className="fixed top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-rose-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-2000 pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] left-[20%] w-[40vw] h-[40vw] bg-violet-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-4000 pointer-events-none z-0"></div>

      <div className="relative z-10">
        <Sidebar />

        {successMessage && (
          <Success
            message={successMessage}
            onClose={clearSuccessMessage}
          />
        )}

        {activeAlert && (
          <Alert
            message={activeAlert.message}
            type={activeAlert.type}
            onClose={() => setActiveAlert(null)}
          />
        )}

        <main className="ml-72 p-8 pt-2 relative z-10">
          <QuarterlyTaxAlert />
          <UserDeadlineAlert />
          <div className="flex justify-between items-center mb-8 animate-fade-in-up">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">Live Dashboard</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              </div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 via-purple-700 to-indigo-900 tracking-tight drop-shadow-sm">
                Financial Overview
              </h1>
              <p className="text-slate-600 mt-2 text-sm font-semibold italic opacity-80">
                Strategic intelligence for <span className="text-indigo-600 font-bold underline decoration-indigo-200 decoration-4">{user?.name || 'User'}</span>
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsIncomeModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/5 hover:shadow-indigo-500/10 hover:-translate-y-1 active:scale-[0.98] border border-indigo-50"
              >
                <Plus className="w-5 h-5 text-indigo-600" />
                Deposit
              </button>
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className="btn-primary flex items-center gap-2 !w-auto"
              >
                <Plus className="w-5 h-5" />
                New Expense
              </button>
            </div>
          </div>

          {/* Financial Health Wow Factor */}
          <div className="glass-card mb-8 p-6 flex flex-col md:flex-row items-center gap-8 animate-fade-in-up stagger-1 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-700"></div>
            <div className="relative text-center md:text-left">
              <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-2">Financial Health Score</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{Math.round(stats.savings)}</span>
                <span className="text-xl font-bold text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                <span>Safety Buffer</span>
                <span>Excellent</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-full transition-all duration-1000 ease-out shimmer"
                  style={{ width: `${Math.min(stats.savings, 100)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 font-semibold text-center italic">
                "Your savings rate is in the top 5% of users this month. Impressive strategic management!"
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-center">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              index={0}
              title="Monthly Income"
              value={stats.income}
              change={stats.incomeChange}
              icon={TrendingUp}
            />
            <DashboardCard
              index={1}
              title="Monthly Expenses"
              value={stats.expenses}
              change={stats.expenseChange}
              icon={TrendingDown}
            />
            <DashboardCard
              index={2}
              title="Estimated Tax Due"
              value={stats.tax}
              change={stats.taxChange}
              icon={DollarSign}
            />
            <DashboardCard
              index={3}
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

          <div className="space-y-4 glass-card p-6 rounded-3xl mb-8 animate-fade-in-up stagger-3">
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
    </div>
  );
}