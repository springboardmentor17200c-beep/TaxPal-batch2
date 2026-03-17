import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import analyticsService from '../services/analytics.service';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import LoadingSpinner from '../components/LoadingSpinner';
import { Helmet } from 'react-helmet';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchYearlyData();
  }, [year]);

  const fetchYearlyData = async () => {
    setLoading(true);
    try {
      const result = await analyticsService.getYearlyOverview(year);
      setData(result);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const chartData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Income',
        data: data.map(m => m.income),
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // green
      },
      {
        label: 'Expenses',
        data: data.map(m => m.expenses),
        backgroundColor: 'rgba(239, 68, 68, 0.6)', // red
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: { family: 'Inter', size: 12, weight: '600' },
          color: '#475569'
        }
      },
      title: {
        display: false
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="flex min-h-screen ultra-bg font-sans selection:bg-indigo-100 selection:text-indigo-900" id="analytics-page">
      <Helmet>
        <title>Financial Analytics | TaxPal Intelligence</title>
        <meta name="description" content="Dive deep into your yearly financial performance with interactive charts and monthly breakdowns. Monitor income trends and expense ratios." />
      </Helmet>
      <Sidebar />
      <main className="flex-1 p-8 ml-64 animate-fade-in-up">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight" id="main-heading">
                Financial <span className="text-gradient">Analytics</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1">Strategic intelligence for your yearly performance</p>
            </div>
            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-xl p-2 rounded-2xl shadow-sm border border-white/80" id="year-selector">
              <button 
                id="prev-year-btn"
                onClick={() => setYear(year - 1)}
                className="p-2.5 hover:bg-white rounded-xl transition-all duration-300 text-slate-600 hover:text-indigo-600 shadow-sm"
              >
                &larr;
              </button>
              <span className="font-bold text-lg text-slate-800 px-2" id="current-year-display">{year}</span>
              <button 
                id="next-year-btn"
                onClick={() => setYear(year + 1)}
                className="p-2.5 hover:bg-white rounded-xl transition-all duration-300 text-slate-600 hover:text-indigo-600 shadow-sm"
              >
                &rarr;
              </button>
            </div>
          </header>

          <div className="grid gap-8">
            <div className="glass-card p-8 rounded-[2rem]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Income vs Expenses</h3>
                <div className="flex gap-4 text-sm font-semibold">
                    <div className="flex items-center gap-2 text-green-600">
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" /> Income
                    </div>
                    <div className="flex items-center gap-2 text-rose-600">
                        <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]" /> Expenses
                    </div>
                </div>
              </div>
              {loading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="h-[400px]">
                  <Bar data={chartData} options={options} />
                </div>
              )}
            </div>

            <div className="glass-card p-8 rounded-[2rem] overflow-hidden">
                <h3 className="text-xl font-bold mb-6 text-slate-800">Monthly Performance</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="pb-4 px-4">Month</th>
                                <th className="pb-4 px-4 text-right">Income</th>
                                <th className="pb-4 px-4 text-right">Expenses</th>
                                <th className="pb-4 px-4 text-right">Net Profit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((m, i) => {
                                const profit = m.income - m.expenses;
                                return (
                                    <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="py-5 px-4 font-bold text-slate-700">{monthNames[m.month - 1]}</td>
                                        <td className="py-5 px-4 text-right font-semibold text-green-600 font-mono">
                                            +${m.income.toLocaleString()}
                                        </td>
                                        <td className="py-5 px-4 text-right font-semibold text-rose-600 font-mono">
                                            -${m.expenses.toLocaleString()}
                                        </td>
                                        <td className={`py-5 px-4 text-right font-bold font-mono ${profit >= 0 ? 'text-indigo-600' : 'text-orange-600'}`}>
                                            {profit >= 0 ? '+' : '-'}${Math.abs(profit).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
