// src/components/TransactionModal.jsx
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Business', 'Other'];
const EXPENSE_CATEGORIES = ['Housing', 'Transportation', 'Food', 'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Other'];

export default function TransactionModal({ isOpen, onClose, onSubmit, type }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        type,
      });
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-card w-full max-w-md p-6 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <h2 className={`text-xl font-semibold mb-4 ${
          type === 'income' ? 'text-green-400' : 'text-red-400'
        }`}>
          Record {type === 'income' ? 'Income' : 'Expense'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          />

          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          />

          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-black">
                {cat}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          />

          {errors.submit && (
            <p className="text-sm text-red-400">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn-primary ${
              type === 'income'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isLoading ? <LoadingSpinner /> : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
