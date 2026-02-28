import { useState, useMemo } from 'react';
import { Calculator, Calendar, Globe, AlertCircle } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

// Simplified Tax Slabs for Demonstration
const taxBrackets = {
    US: [
        { upTo: 11000, rate: 0.10 },
        { upTo: 44725, rate: 0.12 },
        { upTo: 95375, rate: 0.22 },
        { upTo: 182100, rate: 0.24 },
        { upTo: Infinity, rate: 0.32 },
    ],
    UK: [
        { upTo: 12570, rate: 0.0 },
        { upTo: 50270, rate: 0.20 },
        { upTo: 125140, rate: 0.40 },
        { upTo: Infinity, rate: 0.45 },
    ],
    AUS: [
        { upTo: 18200, rate: 0.0 },
        { upTo: 45000, rate: 0.19 },
        { upTo: 120000, rate: 0.325 },
        { upTo: 180000, rate: 0.37 },
        { upTo: Infinity, rate: 0.45 },
    ],
    India: [
        { upTo: 300000, rate: 0.0 },
        { upTo: 600000, rate: 0.05 },
        { upTo: 900000, rate: 0.10 },
        { upTo: 1200000, rate: 0.15 },
        { upTo: 1500000, rate: 0.20 },
        { upTo: Infinity, rate: 0.30 },
    ]
};

const quarterlyDates = [
    { quarter: 'Q1 (Jan - Mar)', due: 'April 15' },
    { quarter: 'Q2 (Apr - Jun)', due: 'June 15' },
    { quarter: 'Q3 (Jul - Sep)', due: 'September 15' },
    { quarter: 'Q4 (Oct - Dec)', due: 'January 15' }
];

export default function TaxEstimator() {
    const { transactions, isLoading } = useTransactions();
    const [region, setRegion] = useState('US');

    const { income, expenses, netIncome } = useMemo(() => {
        let inc = 0, exp = 0;
        transactions.forEach(t => {
            if (t.type === 'income') inc += t.amount;
            if (t.type === 'expense') exp += t.amount;
        });
        return { income: inc, expenses: exp, netIncome: Math.max(0, inc - exp) };
    }, [transactions]);

    const estimatedTax = useMemo(() => {
        let tax = 0;
        let remainingIncome = netIncome;
        let previousLimit = 0;

        const brackets = taxBrackets[region] || taxBrackets.US;

        for (const b of brackets) {
            const taxableAtThisRate = Math.min(Math.max(0, b.upTo - previousLimit), remainingIncome);
            if (taxableAtThisRate > 0) {
                tax += taxableAtThisRate * b.rate;
                remainingIncome -= taxableAtThisRate;
            }
            previousLimit = b.upTo;
            if (remainingIncome <= 0) break;
        }

        return tax;
    }, [netIncome, region]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <main className="ml-72 p-8">

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tax Estimator</h1>
                        <p className="text-slate-500 mt-1 text-sm font-medium">
                            Estimate your regional tax burden based on your logged transactions.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* Tax Calculator Card */}
                    <div className="lg:col-span-2 glass-card p-6 border border-slate-100 shadow-sm bg-white rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                <Calculator className="w-6 h-6 text-indigo-500" /> Tax Calculator
                            </h2>

                            <div className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-slate-400" />
                                <select
                                    value={region}
                                    onChange={e => setRegion(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
                                >
                                    <option value="US">United States</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="AUS">Australia</option>
                                    <option value="India">India</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">

                            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <span className="text-emerald-700 font-medium tracking-wide">Gross Income (Yearly)</span>
                                <span className="text-xl font-bold text-emerald-800">${income.toLocaleString()}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl border border-rose-100">
                                <span className="text-rose-700 font-medium tracking-wide">Deductible Expenses</span>
                                <span className="text-xl font-bold text-rose-800">${expenses.toLocaleString()}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-100 rounded-xl border border-slate-200">
                                <span className="text-slate-700 font-medium tracking-wide">Net Taxable Income</span>
                                <span className="text-xl font-bold text-slate-800">${netIncome.toLocaleString()}</span>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col items-center">
                                <p className="text-slate-500 font-medium mb-1">Estimated Tax Owed ({region})</p>
                                <h3 className="text-5xl font-extrabold text-indigo-600 bg-clip-text">
                                    ${estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h3>
                                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> This is an estimate based on simplified bracket models.
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Quarterly Schedule Card */}
                    <div className="lg:col-span-1 glass-card p-6 border border-slate-100 shadow-sm bg-white rounded-3xl h-fit">
                        <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-500" /> Quarterly Deadlines
                        </h2>

                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">

                            {quarterlyDates.map((q, i) => (
                                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 group-[.is-active]:bg-indigo-50 group-[.is-active]:text-indigo-500 group-[.is-active]:border-indigo-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                                        <span className="text-xs font-bold">{i + 1}</span>
                                    </div>

                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-800 text-sm">{q.quarter}</div>
                                        </div>
                                        <div className="text-slate-500 text-xs font-semibold">Due: <span className="text-rose-500">{q.due}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}
