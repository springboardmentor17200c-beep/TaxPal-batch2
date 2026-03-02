import { useState } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import { useTransactions } from '../hooks/useTransactions';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Transactions() {
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

    const {
        transactions,
        isLoading,
        error,
        addIncome,
        addExpense,
        deleteTransaction,
    } = useTransactions();

    return (
        <div className="min-h-screen ultra-bg font-sans text-slate-900 selection:bg-indigo-300">
            {/* Animated Background Blobs */}
            <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob pointer-events-none z-0"></div>
            <div className="fixed top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-rose-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-2000 pointer-events-none z-0"></div>

            <div className="relative z-10">
                <Sidebar />

                <main className="ml-72 p-8 relative z-10">
                    <div className="flex justify-between items-center mb-8 animate-fade-in-up">
                        <div>
                            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-purple-600 tracking-tight drop-shadow-sm">All Transactions</h1>
                            <p className="text-slate-600 mt-2 text-sm font-semibold">
                                Manage and filter all your financial records
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

                    <div className="animate-fade-in-up stagger-1">
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
