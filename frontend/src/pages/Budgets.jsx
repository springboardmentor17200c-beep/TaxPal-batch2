import { useState, useEffect } from 'react';
import { DollarSign, Percent, AlertCircle } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import Success from '../components/Success';
import axios from 'axios';

// The auth token needs to be sent with these requests
const API_URL = 'http://localhost:5000/api/budgets';

export default function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [isLoadingBudgets, setIsLoadingBudgets] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // We need transactions to calculate "amount spent" safely.
    const { transactions, isLoading: isTxLoading } = useTransactions();

    // For the form
    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');

    const fetchBudgets = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBudgets(res.data);
        } catch (err) {
            setErrorMsg('Failed to load budgets');
        } finally {
            setIsLoadingBudgets(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!category || !limit) {
            setErrorMsg("Please provide both a category and a limit");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(API_URL, { category, limit: Number(limit) }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMsg("Budget limits updated successfully!");
            setCategory('');
            setLimit('');
            fetchBudgets(); // refresh the list
        } catch (err) {
            setErrorMsg(err.response?.data?.message || err.message);
        }
    };

    const deleteBudget = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBudgets();
        } catch (err) {
            setErrorMsg(err.response?.data?.message || err.message);
        }
    };

    // Combine fetched budgets with calculated spending from transactions
    const combinedBudgets = budgets.map(b => {
        const spent = transactions
            .filter(t => t.type === 'expense' && t.category.toLowerCase() === b.category.toLowerCase())
            .reduce((sum, t) => sum + t.amount, 0);

        const percentage = b.limit > 0 ? (spent / b.limit) * 100 : 0;

        return {
            ...b,
            spent,
            percentage: Math.min(percentage, 100), // Cap at 100 for width
            isOver: percentage > 100
        };
    });

    const isLoading = isLoadingBudgets || isTxLoading;

    return (
        <div className="min-h-screen ultra-bg font-sans text-slate-900 selection:bg-indigo-300">
            {/* Animated Background Blobs */}
            <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob pointer-events-none z-0"></div>
            <div className="fixed top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-violet-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-2000 pointer-events-none z-0"></div>
            <div className="fixed bottom-[-20%] left-[20%] w-[40vw] h-[40vw] bg-amber-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-4000 pointer-events-none z-0"></div>

            <div className="relative z-10">
                <Sidebar />
                <main className="ml-72 p-8 relative z-10">

                    {successMsg && (
                        <Success message={successMsg} onClose={() => setSuccessMsg('')} />
                    )}

                    <div className="mb-8 animate-fade-in-up">
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-purple-600 tracking-tight drop-shadow-sm">Budgets</h1>
                        <p className="text-slate-600 mt-2 text-sm font-semibold">
                            Set monthly limits and track your category spending.
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <p className="text-red-500 text-sm font-medium">{errorMsg}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Create/Edit Form */}
                        <div className="lg:col-span-1 border-0">
                            <div className="glass-card p-6 rounded-3xl animate-fade-in-up stagger-1">
                                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-indigo-500" /> Set Budget Limit
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                        <input
                                            type="text"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            placeholder="e.g. Housing, Food, Transport"
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Limit ($)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={limit}
                                            onChange={(e) => setLimit(e.target.value)}
                                            placeholder="0.00"
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn-primary w-full">Save Budget</button>
                                </form>
                            </div>
                        </div>

                        {/* Budget List and Progress tracking */}
                        <div className="lg:col-span-2 border-0">
                            <div className="glass-card p-6 rounded-3xl h-full animate-fade-in-up stagger-2">
                                <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                    <Percent className="w-5 h-5 text-indigo-500" /> Category Progress
                                </h2>

                                {isLoading ? (
                                    <div className="flex justify-center p-8"><LoadingSpinner /></div>
                                ) : combinedBudgets.length === 0 ? (
                                    <div className="text-center p-8 text-slate-500 border border-dashed border-slate-200 rounded-xl">
                                        No budgets set yet. Add one from the left to start tracking.
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {combinedBudgets.map(b => (
                                            <div key={b._id} className="relative group">
                                                <div className="flex justify-between items-end mb-2">
                                                    <div>
                                                        <p className="font-semibold text-slate-800 capitalize">{b.category}</p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            ${b.spent.toLocaleString()} spent of ${b.limit.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteBudget(b._id)}
                                                        className="text-xs text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                {/* Progress Bar Container */}
                                                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
                                                    <div
                                                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${b.isOver ? 'bg-rose-500' : (b.percentage > 85 ? 'bg-amber-400' : 'bg-emerald-400')}`}
                                                        style={{ width: `${b.percentage}%` }}
                                                    />
                                                </div>
                                                {b.isOver && <p className="text-xs tracking-tight text-rose-500 mt-1 text-right">Limit exceeded!</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
