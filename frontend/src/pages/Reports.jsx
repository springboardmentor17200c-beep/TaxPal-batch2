import { useState, useEffect } from 'react';
import { FileText, Download, Printer, Settings2, FileBarChart, Loader2, ArrowDownToLine } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { generateReport, getReports } from '../services/report.service';

export default function Reports() {
    const [reportType, setReportType] = useState('Income Statement');
    const [period, setPeriod] = useState('Current Month');
    const [format, setFormat] = useState('PDF');
    const [reports, setReports] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const res = await getReports();
            if (res.success) {
                setReports(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch reports', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            const res = await generateReport({ report_type: reportType, period, format });
            if (res.success) {
                fetchReports(); // Refresh history
                // Auto trigger download for the generated report
                window.open(`http://localhost:5000${res.data.file_path}`, '_blank');
            }
        } catch (error) {
            console.error('Failed to generate report', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReset = () => {
        setReportType('Income Statement');
        setPeriod('Current Month');
        setFormat('PDF');
    };

    return (
        <div className="min-h-screen ultra-bg font-sans text-slate-900 selection:bg-indigo-300">
            {/* Animated Background Blobs */}
            <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-rose-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob pointer-events-none z-0"></div>
            <div className="fixed top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-amber-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-2000 pointer-events-none z-0"></div>
            <div className="fixed bottom-[-20%] left-[20%] w-[40vw] h-[40vw] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-4000 pointer-events-none z-0"></div>

            <div className="relative z-10">
                <Sidebar />
                <main className="ml-72 p-8 mb-12 relative z-10">
                    <div className="mb-8 animate-fade-in-up">
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-purple-600 tracking-tight drop-shadow-sm">Financial Reports</h1>
                        <p className="text-slate-600 mt-2 text-sm font-semibold">
                            Generate and download your financial reports for tax filing or personal review.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Left Column: Generate Form & History */}
                        <div className="xl:col-span-1 space-y-8">
                            {/* Form Card */}
                            <div className="glass-card p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl rounded-3xl">
                                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                        <Settings2 className="w-5 h-5" />
                                    </div>
                                    Generate Report
                                </h2>

                                <form onSubmit={handleGenerate} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Report Type</label>
                                        <select
                                            value={reportType}
                                            onChange={(e) => setReportType(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3 transition-colors outline-none cursor-pointer hover:bg-slate-100"
                                        >
                                            <option>Income Statement</option>
                                            <option>Tax Summary</option>
                                            <option>Expense Breakdown</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Period</label>
                                        <select
                                            value={period}
                                            onChange={(e) => setPeriod(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3 transition-colors outline-none cursor-pointer hover:bg-slate-100"
                                        >
                                            <option>Current Month</option>
                                            <option>Last Month</option>
                                            <option>Q1</option>
                                            <option>Q2</option>
                                            <option>Q3</option>
                                            <option>Q4</option>
                                            <option>Year to Date</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Format</label>
                                        <select
                                            value={format}
                                            onChange={(e) => setFormat(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3 transition-colors outline-none cursor-pointer hover:bg-slate-100"
                                        >
                                            <option>PDF</option>
                                            <option>CSV</option>
                                        </select>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="w-1/3 py-2.5 px-4 rounded-xl font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isGenerating}
                                            className="w-2/3 py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                                        >
                                            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Report'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column: History table & Preview Placeholder */}
                        <div className="xl:col-span-2 space-y-8">
                            {/* History Table */}
                            <div className="glass-card border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                                <div className="p-6 border-b border-slate-100">
                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                                            <FileBarChart className="w-5 h-5" />
                                        </div>
                                        Recent Reports
                                    </h2>
                                </div>

                                {isLoading ? (
                                    <div className="p-12 flex justify-center text-slate-400">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                    </div>
                                ) : reports.length === 0 ? (
                                    <div className="p-16 text-center text-slate-400 flex flex-col items-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                            <FileText className="w-8 h-8 opacity-40" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-500">No reports generated yet.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-slate-600">
                                            <thead className="text-xs text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100">
                                                <tr>
                                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Report Name</th>
                                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Generated</th>
                                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Period</th>
                                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-center">Format</th>
                                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reports.map((report) => {
                                                    const formatExt = report.file_path.endsWith('.csv') ? 'CSV' : 'PDF';
                                                    return (
                                                        <tr key={report._id} className="bg-white border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                                {report.report_type}
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-500">
                                                                {new Date(report.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="bg-slate-100 text-slate-600 py-1 px-2.5 rounded-full text-xs font-semibold">
                                                                    {report.period}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className={`inline-flex py-1 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${formatExt === 'PDF' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                                    {formatExt}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <a
                                                                    href={`http://localhost:5000${report.file_path}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors"
                                                                >
                                                                    <ArrowDownToLine className="w-3.5 h-3.5" /> DL
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Preview Placeholder */}
                            <div className="glass-card p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl rounded-3xl relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center text-center">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent opacity-50"></div>
                                <div className="absolute top-6 right-6 flex gap-2 opacity-30 pointer-events-none">
                                    <button className="p-2 bg-slate-100 rounded-lg text-slate-500"><Printer className="w-4 h-4" /></button>
                                    <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg flex gap-2 items-center text-xs font-bold px-3"><Download className="w-4 h-4" /> Download</button>
                                </div>

                                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                    <FileText className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-slate-800 font-semibold mb-1">Select a report to preview</h3>
                                <p className="text-slate-500 text-sm max-w-xs">Generated reports will appear here or can be directly downloaded from the table above.</p>
                            </div>

                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
