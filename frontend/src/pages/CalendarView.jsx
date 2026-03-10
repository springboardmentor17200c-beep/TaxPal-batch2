import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { getDeadlines, createDeadline, updateDeadline, deleteDeadline } from '../services/deadline.service';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [deadlines, setDeadlines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDeadline, setEditingDeadline] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        type: 'deadline',
        priority: 'medium'
    });

    useEffect(() => {
        fetchDeadlines();
    }, []);

    const fetchDeadlines = async () => {
        setIsLoading(true);
        try {
            const res = await getDeadlines();
            if (res.success) {
                setDeadlines(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch deadlines', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const days = [];
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);

    // Padding for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push({ day: null, currentMonth: false });
    }

    // Days of current month
    for (let i = 1; i <= totalDays; i++) {
        days.push({ day: i, currentMonth: true });
    }

    const getDeadlinesForDay = (day) => {
        if (!day) return [];
        return deadlines.filter(d => {
            const dDate = new Date(d.dueDate);
            return dDate.getDate() === day &&
                dDate.getMonth() === month &&
                dDate.getFullYear() === year;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDeadline) {
                await updateDeadline(editingDeadline._id, formData);
            } else {
                await createDeadline(formData);
            }
            setIsModalOpen(false);
            setEditingDeadline(null);
            setFormData({ title: '', description: '', dueDate: '', type: 'deadline', priority: 'medium' });
            fetchDeadlines();
        } catch (error) {
            console.error('Failed to save deadline', error);
        }
    };

    const handleEdit = (deadline) => {
        setEditingDeadline(deadline);
        setFormData({
            title: deadline.title,
            description: deadline.description || '',
            dueDate: new Date(deadline.dueDate).toISOString().split('T')[0],
            type: deadline.type,
            priority: deadline.priority
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this reminder?')) {
            try {
                await deleteDeadline(id);
                fetchDeadlines();
            } catch (error) {
                console.error('Failed to delete deadline', error);
            }
        }
    };

    return (
        <div className="min-h-screen ultra-bg font-sans text-slate-900 selection:bg-indigo-300">
            <Sidebar />
            <main className="ml-72 p-8 relative z-10">
                <div className="flex justify-between items-center mb-8 animate-fade-in-up">
                    <div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-purple-600 tracking-tight drop-shadow-sm">Tax Calendar</h1>
                        <p className="text-slate-600 mt-2 text-sm font-semibold">
                            Manage your tax deadlines and financial reminders.
                        </p>
                    </div>
                    <button
                        onClick={() => { setEditingDeadline(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Event
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-96">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        {/* Calendar Grid */}
                        <div className="xl:col-span-3 glass-card p-6 border border-slate-200/60 shadow-xl bg-white/80 backdrop-blur-xl rounded-3xl">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                    {monthName} {year}
                                </h2>
                                <div className="flex gap-2">
                                    <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                        Today
                                    </button>
                                    <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="bg-slate-50 p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {day}
                                    </div>
                                ))}
                                {days.map((d, i) => {
                                    const dayDeadlines = getDeadlinesForDay(d.day);
                                    const isToday = d.day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                                    return (
                                        <div key={i} className={`min-h-[120px] bg-white p-2 transition-colors hover:bg-slate-50/50 ${!d.currentMonth ? 'bg-slate-50/30' : ''}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-sm font-bold ${isToday ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md' : d.currentMonth ? 'text-slate-800' : 'text-slate-300'}`}>
                                                    {d.day}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                {dayDeadlines.map(deadline => (
                                                    <div
                                                        key={deadline._id}
                                                        onClick={() => handleEdit(deadline)}
                                                        className={`text-[10px] p-1.5 rounded-md font-bold truncate cursor-pointer transition-transform hover:scale-105 ${deadline.priority === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                                                deadline.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                                    'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                            }`}
                                                    >
                                                        {deadline.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sidebar: Upcoming & Actions */}
                        <div className="space-y-8">
                            <div className="glass-card p-6 border border-slate-200/60 bg-white/80 backdrop-blur-xl rounded-3xl">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-500" />
                                    Upcoming
                                </h3>
                                <div className="space-y-4">
                                    {deadlines.filter(d => new Date(d.dueDate) >= new Date()).slice(0, 5).map(d => (
                                        <div key={d._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${d.priority === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                                                    }`}>
                                                    {d.type}
                                                </span>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(d); }} className="p-1 hover:text-indigo-600"><Edit2 className="w-3.5 h-3.5" /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(d._id); }} className="p-1 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{d.title}</h4>
                                            <p className="text-xs text-slate-500 font-medium">{new Date(d.dueDate).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                    {deadlines.length === 0 && (
                                        <div className="text-center py-8 text-slate-400">
                                            <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-sm">No events planned.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">{editingDeadline ? 'Edit Event' : 'New Event'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <Plus className="w-6 h-6 rotate-45 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Due Date</label>
                                <input
                                    required
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                                    >
                                        <option value="deadline">Deadline</option>
                                        <option value="reminder">Reminder</option>
                                        <option value="alert">Alert</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95">
                                    {editingDeadline ? 'Save Changes' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
