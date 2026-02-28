// src/components/TransactionModal.jsx - UPDATED with validation and reset
import { useState, useEffect } from 'react';
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
  const [touched, setTouched] = useState({});

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
      setTouched({});
    }
  }, [isOpen]);

  const validateField = (name, value) => {
    switch (name) {
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().length < 3) return 'Description must be at least 3 characters';
        return '';
      case 'amount':
        if (!value) return 'Amount is required';
        if (isNaN(value) || parseFloat(value) <= 0) return 'Amount must be a positive number';
        if (parseFloat(value) > 1000000) return 'Amount cannot exceed 1,000,000';
        return '';
      case 'category':
        if (!value) return 'Category is required';
        return '';
      case 'date':
        if (!value) return 'Date is required';
        return '';
      default:
        return '';
    }
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'notes') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'notes') allTouched[key] = true;
    });
    setTouched(allTouched);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        type,
      });
      if (result?.success) {
        onClose();
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isFormValid = Object.keys(validate()).length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in px-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white/95 backdrop-blur-2xl w-full max-w-md p-8 rounded-3xl premium-shadow border border-white/50 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className={`text-2xl font-extrabold tracking-tight mb-8 ${type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
          Record {type === 'income' ? 'Income' : 'Expense'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              className={`input-field ${errors.description && touched.description ? 'border-rose-500 ring-rose-500/20 focus:ring-rose-500/50 focus:border-rose-500' : ''
                }`}
              placeholder="e.g., Monthly salary"
            />
            {errors.description && touched.description && (
              <p className="mt-1 text-xs font-medium text-rose-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Amount <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="1000000"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              onBlur={() => handleBlur('amount')}
              className={`input-field ${errors.amount && touched.amount ? 'border-rose-500 ring-rose-500/20 focus:ring-rose-500/50 focus:border-rose-500' : ''
                }`}
              placeholder="0.00"
            />
            {errors.amount && touched.amount && (
              <p className="mt-1 text-xs font-medium text-rose-500">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
              className={`input-field ${errors.category && touched.category ? 'border-rose-500 ring-rose-500/20 focus:ring-rose-500/50 focus:border-rose-500' : ''
                }`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white text-slate-900">{cat}</option>
              ))}
            </select>
            {errors.category && touched.category && (
              <p className="mt-1 text-xs font-medium text-rose-500">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              onBlur={() => handleBlur('date')}
              className={`input-field ${errors.date && touched.date ? 'border-rose-500 ring-rose-500/20 focus:ring-rose-500/50 focus:border-rose-500' : ''
                }`}
            />
            {errors.date && touched.date && (
              <p className="mt-1 text-xs font-medium text-rose-500">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="input-field"
              placeholder="Add additional notes..."
            />
          </div>

          {errors.submit && (
            <p className="text-sm font-medium text-rose-500 text-center">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full btn-primary py-3 disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner /> : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}