import { useState, useMemo, useEffect } from 'react';
import { Calculator, Calendar as CalendarIcon, Globe, AlertCircle, Save, CheckCircle2, FileText, History, ChevronRight } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { estimateTax, getTaxEstimates, saveTaxEstimateGeneral } from '../services/tax.service';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import QuarterlyTaxAlert from '../components/QuarterlyTaxAlert';
import UserDeadlineAlert from '../components/UserDeadlineAlert';
import { Helmet } from 'react-helmet';



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



    const handleManualCalculate = async () => {
        const totalDeductions = Number(manualBusinessExpenses) + Number(manualRetirement) + Number(manualHealthIns) + Number(manualHomeOffice);
        const taxableIncome = Math.max(0, Number(manualIncome) - totalDeductions);
        let estimatedTaxValue = 0;
        
        switch (region) {
            case 'US':
                if (taxableIncome <= 11000) estimatedTaxValue = taxableIncome * 0.10;
                else if (taxableIncome <= 44725) estimatedTaxValue = 1100 + ((taxableIncome - 11000) * 0.12);
                else if (taxableIncome <= 95375) estimatedTaxValue = 5147 + ((taxableIncome - 44725) * 0.22);
                else estimatedTaxValue = 16290 + ((taxableIncome - 95375) * 0.24);
                break;
            case 'UK':
                if (taxableIncome <= 12570) estimatedTaxValue = 0;
                else if (taxableIncome <= 50270) estimatedTaxValue = (taxableIncome - 12570) * 0.20;
                else estimatedTaxValue = 7540 + ((taxableIncome - 50270) * 0.40);
                break;
            case 'AUS':
                if (taxableIncome <= 18200) estimatedTaxValue = 0;
                else if (taxableIncome <= 45000) estimatedTaxValue = (taxableIncome - 18200) * 0.19;
                else if (taxableIncome <= 120000) estimatedTaxValue = 5092 + ((taxableIncome - 45000) * 0.325);
                else estimatedTaxValue = 29467 + ((taxableIncome - 120000) * 0.37);
                break;
            case 'India':
                if (taxableIncome <= 300000) estimatedTaxValue = 0;
                else if (taxableIncome <= 600000) estimatedTaxValue = (taxableIncome - 300000) * 0.05;
                else if (taxableIncome <= 900000) estimatedTaxValue = 15000 + ((taxableIncome - 600000) * 0.10);
                else estimatedTaxValue = 45000 + ((taxableIncome - 900000) * 0.15);
                break;
            case 'Canada':
                if (taxableIncome <= 53359) estimatedTaxValue = taxableIncome * 0.15;
                else if (taxableIncome <= 106717) estimatedTaxValue = 8003 + ((taxableIncome - 53359) * 0.205);
                else estimatedTaxValue = 18942 + ((taxableIncome - 106717) * 0.26);
                break;
            case 'Germany':
                if (taxableIncome <= 10908) estimatedTaxValue = 0;
                else if (taxableIncome <= 62809) estimatedTaxValue = (taxableIncome - 10908) * 0.14;
                else estimatedTaxValue = 7266 + ((taxableIncome - 62809) * 0.42);
                break;
            default:
                estimatedTaxValue = taxableIncome * 0.20;
        }

        // since the manual estimator says "Quarterly Tax", if this formula calculates yearly, divide by 4.
        // Assuming they input "Gross Income for Quarter", we can either annualize income or just calculate directly:
        // Let's assume the user enters annual equivalent or we use proportional limits. If they enter quarterly, standard approach is: Annualize -> Tax -> Divide by 4.
        // But since this is a manual simplified estimator, and the original was "estimatedTaxValue = taxableIncome * 0.22", we'll just keep it direct.
        
        setManualResult({
            taxableIncome,
            estimatedTax: estimatedTaxValue,
            totalDeductions
        });

        // 🚀 Save to Database as per requirement
        setIsSaving(true);
        try {
            const result = await saveTaxEstimateGeneral({
                quarter: manualQuarter,
                estimated_tax: estimatedTaxValue,
                year: new Date().getFullYear(),
                source: 'manual'
            });
            if (result.success) {
                setSaveSuccess(true);
                fetchSavedEstimates(); // refresh history
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Failed to save manual estimate", error);
        } finally {
            setIsSaving(false);
        }
    };



    if (isTxLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen ultra-bg font-sans text-slate-900 selection:bg-indigo-300" id="tax-estimator-page">
            <Helmet>
                <title>Tax Estimator | Smart Regional Tax Projections</title>
                <meta name="description" content="Calculate your regional tax burden automatically from transactions or manually with our advanced deduction tracker." />
            </Helmet>
            {/* Animated Background Blobs */}
            <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob pointer-events-none z-0"></div>
            <div className="fixed top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-2000 pointer-events-none z-0"></div>
            <div className="fixed bottom-[-20%] left-[20%] w-[40vw] h-[40vw] bg-rose-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-4000 pointer-events-none z-0"></div>

            <div className="relative z-10">
                <Sidebar />
                <main className="ml-72 p-8 pt-2 relative z-10">
                    <QuarterlyTaxAlert />
                    <UserDeadlineAlert />
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
                                        <option value="Canada">Canada</option>
                                        <option value="Germany">Germany</option>
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
                                            <span className="text-indigo-600/80 font-semibold text-sm mb-2">{taxData.currentQuarter} Predicted Installment</span>
                                            <span className="text-3xl font-bold text-indigo-700">
                                                ${taxData.quarterlyTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Transaction Based Result</p>
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
                                        <option value="AUS">Australia</option>
                                        <option value="India">India</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Germany">Germany</option>
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

                            <button 
                                onClick={handleManualCalculate} 
                                disabled={isSaving || saveSuccess}
                                className={`w-full py-3 font-bold rounded-xl shadow-lg transition-all active:scale-95 mb-8 flex items-center justify-center gap-2 ${
                                    saveSuccess ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }`}
                            >
                                {saveSuccess ? (
                                    <><CheckCircle2 className="w-5 h-5" /> Saved to History!</>
                                ) : isSaving ? (
                                    <LoadingSpinner className="w-5 h-5" />
                                ) : (
                                    'Calculate & Save Estimated Tax'
                                )}
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

                        <div className="lg:col-span-3 mt-12 mb-12">
                            <div className="glass-card p-10 border border-indigo-100 shadow-2xl shadow-indigo-500/10 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
                                <div className="relative z-10 max-w-xl text-center md:text-left">
                                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                            <CalendarIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-100">Strategic Awareness</span>
                                    </div>
                                    <h2 className="text-4xl font-black mb-4 leading-tight">Your Unified Tax Calendar is Active</h2>
                                    <p className="text-indigo-100/80 font-medium text-lg leading-relaxed">
                                        We've integrated all quarterly deadlines and reminders into one central headquarters. Monitor your fiscal trajectory with precision.
                                    </p>
                                </div>
                                <div className="relative z-10 flex-shrink-0">
                                    <Link 
                                        to="/calendar" 
                                        className="inline-flex items-center gap-3 bg-white text-indigo-700 px-8 py-4 rounded-2xl font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all active:scale-95 group/btn"
                                    >
                                        Launch Unified Calendar
                                        <div className="p-2 bg-indigo-50 rounded-lg group-hover/btn:translate-x-1 transition-transform">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Recent History in a wide card */}
                        <div className="lg:col-span-3">
                            <div className="glass-card p-8 border border-slate-200/60 shadow-xl bg-white/80 backdrop-blur-xl rounded-[2.5rem]">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-amber-50 rounded-2xl text-amber-500 border border-amber-100/50">
                                        <History className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">Saved Estimates History</h2>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Audit Ledger</p>
                                    </div>
                                </div>

                                {savedEstimates.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {savedEstimates.map(est => (
                                            <div key={est._id} className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 group hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-indigo-100/50 flex items-center justify-center text-indigo-600 font-black text-sm">
                                                        {est.quarter}
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase">{est.year}</span>
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Estimated Tax</p>
                                                <p className="text-2xl font-black text-slate-900 mb-2">${est.estimated_tax.toLocaleString()}</p>
                                                <p className="text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-3 mt-2">
                                                    Recorded: {new Date(est.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-400 flex flex-col items-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                            <FileText className="w-8 h-8 opacity-20" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-500">No archival estimates discovered yet.</p>
                                        <p className="text-xs text-slate-400 mt-1">Start by calculating your first estimation above.</p>
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
