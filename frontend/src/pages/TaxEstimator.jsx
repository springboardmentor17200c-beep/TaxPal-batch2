import { useState, useMemo, useEffect } from 'react';
import { Calculator, Calendar, Globe, AlertCircle, Save, CheckCircle2, FileText, History } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { estimateTax, saveTaxEstimate, getTaxEstimates } from '../services/tax.service';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const quarterlyDates = [
    { id: 'Q1', quarter: 'Q1 (Jan - Mar)', due: 'April 15' },
    { id: 'Q2', quarter: 'Q2 (Apr - Jun)', due: 'June 15' },
    { id: 'Q3', quarter: 'Q3 (Jul - Sep)', due: 'September 15' },
    { id: 'Q4', quarter: 'Q4 (Oct - Dec)', due: 'January 15' }
];

export default function TaxEstimator() {
    const { transactions, isLoading: isTxLoading } = useTransactions();
    const [region, setRegion] = useState('US');
    const [taxData, setTaxData] = useState(null);
    const [savedEstimates, setSavedEstimates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Manual Entry States
    const [manualState, setManualState] = useState('');
    const [manualStatus, setManualStatus] = useState('Single');
    const [manualQuarter, setManualQuarter] = useState('Q1');
    const [manualIncome, setManualIncome] = useState(0);
    const [manualBusinessExpenses, setManualBusinessExpenses] = useState(0);
    const [manualRetirement, setManualRetirement] = useState(0);
    const [manualHealthIns, setManualHealthIns] = useState(0);
    const [manualHomeOffice, setManualHomeOffice] = useState(0);
    const [manualResult, setManualResult] = useState(null);

    useEffect(() => {
        fetchTaxData();
        fetchSavedEstimates();
    }, [region, transactions]);

    const fetchTaxData = async () => {
        setIsLoading(true);
        try {
            const result = await estimateTax({ region, year: new Date().getFullYear() });
            if (result.success) {
                setTaxData(result.data);
            }
        } catch (error) {
            console.error("Failed to estimate tax", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSavedEstimates = async () => {
        try {
            const result = await getTaxEstimates();
            if (result.success) {
                setSavedEstimates(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch saved estimates", error);
        }
    };

    const handleSaveEstimate = async () => {
        if (!taxData) return;
        setIsSaving(true);
        try {
            const result = await saveTaxEstimate({
                quarter: taxData.currentQuarter,
                estimated_tax: taxData.quarterlyTax,
                year: taxData.year
            });
            if (result.success) {
                setSaveSuccess(true);
                fetchSavedEstimates(); // refresh
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Failed to save estimate", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleManualCalculate = () => {
        const totalDeductions = Number(manualBusinessExpenses) + Number(manualRetirement) + Number(manualHealthIns) + Number(manualHomeOffice);
        const taxableIncome = Math.max(0, Number(manualIncome) - totalDeductions);
        // Simple mock progressive tax calculation or flat tax
        let estimatedTax = taxableIncome * 0.22; // 22% mock rate
        setManualResult({
            taxableIncome,
            estimatedTax,
            totalDeductions
        });
    };

    const isCurrentQuarter = (qId) => taxData?.currentQuarter === qId;

    if (isTxLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen ultra-bg font-sans text-slate-900 selection:bg-indigo-300">
            {/* Animated Background Blobs */}
            <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob pointer-events-none z-0"></div>
            <div className="fixed top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-2000 pointer-events-none z-0"></div>
            <div className="fixed bottom-[-20%] left-[20%] w-[40vw] h-[40vw] bg-rose-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-4000 pointer-events-none z-0"></div>

            <div className="relative z-10">
                <Sidebar />
                <main className="ml-72 p-8 relative z-10">

                    <div className="mb-8 flex items-center justify-between animate-fade-in-up">
                        <div>
                            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-purple-600 tracking-tight drop-shadow-sm">Tax Estimator</h1>
                            <p className="text-slate-600 mt-2 text-sm font-semibold">
                                Estimate your regional tax burden based on your logged transactions.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                        {/* Tax Calculator Card */}
                        <div className="lg:col-span-2 glass-card p-8 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl rounded-3xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                        <Calculator className="w-6 h-6" />
                                    </div>
                                    Tax Calculator
                                </h2>

                                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60 shadow-sm">
                                    <Globe className="w-5 h-5 text-slate-400 ml-2" />
                                    <select
                                        value={region}
                                        onChange={e => setRegion(e.target.value)}
                                        className="bg-transparent text-slate-700 text-sm font-semibold rounded-lg focus:ring-0 focus:border-0 block p-2 border-0 outline-none cursor-pointer"
                                    >
                                        <option value="US">United States</option>
                                        <option value="UK">United Kingdom</option>
                                        <option value="AUS">Australia</option>
                                        <option value="India">India</option>
                                    </select>
                                </div>
                            </div>

                            {isLoading || !taxData ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                    <LoadingSpinner />
                                    <span className="mt-4 text-sm font-medium">Calculating estimates...</span>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex flex-col justify-center p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-100/50 shadow-sm transition-transform hover:-translate-y-1">
                                            <span className="text-emerald-700 font-semibold tracking-wide text-sm mb-2">Gross Income</span>
                                            <span className="text-2xl font-bold text-emerald-900">${taxData.income.toLocaleString()}</span>
                                        </div>

                                        <div className="flex flex-col justify-center p-5 bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-2xl border border-rose-100/50 shadow-sm transition-transform hover:-translate-y-1">
                                            <span className="text-rose-700 font-semibold tracking-wide text-sm mb-2">Deductible Expenses</span>
                                            <span className="text-2xl font-bold text-rose-900">${taxData.expenses.toLocaleString()}</span>
                                        </div>

                                        <div className="flex flex-col justify-center p-5 bg-gradient-to-br from-slate-100 to-slate-200/50 rounded-2xl border border-slate-200/50 shadow-sm transition-transform hover:-translate-y-1">
                                            <span className="text-slate-700 font-semibold tracking-wide text-sm mb-2">Net Taxable Income</span>
                                            <span className="text-2xl font-bold text-slate-900">${taxData.netIncome.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div>
                                            <p className="text-slate-500 font-semibold mb-2">Estimated Yearly Tax ({region})</p>
                                            <h3 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                                                ${taxData.estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
                                                <AlertCircle className="w-4 h-4" /> This is an estimate based on simplified bracket models.
                                            </p>
                                        </div>

                                        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50 flex flex-col items-center flex-shrink-0 min-w-[240px]">
                                            <span className="text-indigo-600/80 font-semibold text-sm mb-2">{taxData.currentQuarter} Estimated Payment</span>
                                            <span className="text-3xl font-bold text-indigo-700 mb-4">
                                                ${taxData.quarterlyTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            <button
                                                onClick={handleSaveEstimate}
                                                disabled={isSaving || saveSuccess}
                                                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${saveSuccess
                                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5'
                                                    }`}
                                            >
                                                {saveSuccess ? (
                                                    <><CheckCircle2 className="w-5 h-5" /> Saved!</>
                                                ) : isSaving ? (
                                                    <LoadingSpinner className="w-5 h-5" />
                                                ) : (
                                                    <><Save className="w-5 h-5" /> Save Estimate</>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                        {/* Manual Tax Calculator Card */}
                        <div className="lg:col-span-2 glass-card p-8 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl rounded-3xl mt-8 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                                        <Calculator className="w-6 h-6" />
                                    </div>
                                    Manual Tax Estimator
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Country/Region</label>
                                    <select value={region} onChange={e => setRegion(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                                        <option value="US">United States</option>
                                        <option value="UK">United Kingdom</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">State/Province</label>
                                    <input type="text" value={manualState} onChange={e => setManualState(e.target.value)} placeholder="e.g., California" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Filing Status</label>
                                    <select value={manualStatus} onChange={e => setManualStatus(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                                        <option value="Single">Single</option>
                                        <option value="Married">Married Filing Jointly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Quarter</label>
                                    <select value={manualQuarter} onChange={e => setManualQuarter(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                                        <option value="Q1">Q1 (Jan-Mar)</option>
                                        <option value="Q2">Q2 (Apr-Jun)</option>
                                        <option value="Q3">Q3 (Jul-Sep)</option>
                                        <option value="Q4">Q4 (Oct-Dec)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Gross Income for Quarter</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                    <input type="number" value={manualIncome} onChange={e => setManualIncome(e.target.value)} className="w-full pl-8 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="0.00" />
                                </div>
                            </div>

                            <h3 className="text-md font-bold text-slate-800 mb-4">Deductions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Business Expenses</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                        <input type="number" value={manualBusinessExpenses} onChange={e => setManualBusinessExpenses(e.target.value)} className="w-full pl-8 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Retirement Contributions</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                        <input type="number" value={manualRetirement} onChange={e => setManualRetirement(e.target.value)} className="w-full pl-8 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Health Insurance Premiums</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                        <input type="number" value={manualHealthIns} onChange={e => setManualHealthIns(e.target.value)} className="w-full pl-8 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Home Office Deduction</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                        <input type="number" value={manualHomeOffice} onChange={e => setManualHomeOffice(e.target.value)} className="w-full pl-8 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="0.00" />
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleManualCalculate} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 mb-8">
                                Calculate Estimated Tax
                            </button>

                            {manualResult !== null && (
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-inner">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">Tax Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-semibold">Total Deductions</span>
                                            <span className="text-slate-900 font-bold">${manualResult.totalDeductions.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-semibold">Taxable Income</span>
                                            <span className="text-slate-900 font-bold">${manualResult.taxableIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                        </div>
                                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                            <span className="text-slate-800 font-bold">Estimated Quarterly Tax</span>
                                            <span className="text-2xl font-black text-indigo-700">${manualResult.estimatedTax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Quarterly Schedule Card & History */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Reminders */}
                            <div className="glass-card p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl rounded-3xl h-fit">
                                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    Quarterly Deadlines
                                </h2>

                                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-100 before:via-slate-200 before:to-transparent">
                                    {quarterlyDates.map((q, i) => {
                                        const isActive = isCurrentQuarter(q.id);
                                        return (
                                            <div key={i} className={`relative flex items-center justify-between group ${isActive ? 'is-active' : ''}`}>

                                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white text-slate-400 border-slate-100 shadow-sm shrink-0 z-10 transition-colors ${isActive ? '!bg-indigo-50 !text-indigo-600 !border-indigo-200 ring-4 ring-indigo-50' : ''}`}>
                                                    <span className="text-xs font-bold">{i + 1}</span>
                                                </div>

                                                <div className={`w-[calc(100%-3.5rem)] p-4 rounded-2xl border transition-all ${isActive ? 'bg-indigo-50/30 border-indigo-200 shadow-sm shadow-indigo-100/50' : 'bg-white border-slate-100 shadow-sm hover:border-slate-300'}`}>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <div className={`font-bold text-sm ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>{q.quarter}</div>
                                                        {isActive && <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">Current</span>}
                                                    </div>
                                                    <div className="text-slate-500 text-xs font-semibold">Due: <span className={isActive ? "text-rose-600 font-bold" : "text-slate-600"}>{q.due}</span></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Saved History */}
                            <div className="glass-card p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl rounded-3xl h-fit">
                                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                                        <History className="w-5 h-5" />
                                    </div>
                                    Saved Estimates
                                </h2>
                                {savedEstimates.length > 0 ? (
                                    <div className="space-y-3">
                                        {savedEstimates.map(est => (
                                            <div key={est._id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 group hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100/50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                        {est.quarter}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">{est.year} Estimate</p>
                                                        <p className="text-[10px] font-medium text-slate-400">{new Date(est.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-slate-900">${est.estimated_tax.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-400 flex flex-col items-center">
                                        <FileText className="w-8 h-8 mb-3 opacity-20" />
                                        <p className="text-sm font-medium">No saved estimates yet.</p>
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
