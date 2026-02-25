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
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass-card w-full max-w-md p-6 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <h2 className={`text-xl font-semibold mb-4 ${type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
          Record {type === 'income' ? 'Income' : 'Expense'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white input-focus ${
                errors.description && touched.description ? 'border-red-400' : 'border-white/10'
              }`}
              placeholder="e.g., Monthly salary"
            />
            {errors.description && touched.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Amount <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="1000000"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              onBlur={() => handleBlur('amount')}
              className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white input-focus ${
                errors.amount && touched.amount ? 'border-red-400' : 'border-white/10'
              }`}
              placeholder="0.00"
            />
            {errors.amount && touched.amount && (
              <p className="mt-1 text-sm text-red-400">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
              className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white input-focus ${
                errors.category && touched.category ? 'border-red-400' : 'border-white/10'
              }`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-navy">{cat}</option>
              ))}
            </select>
            {errors.category && touched.category && (
              <p className="mt-1 text-sm text-red-400">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              onBlur={() => handleBlur('date')}
              className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white input-focus ${
                errors.date && touched.date ? 'border-red-400' : 'border-white/10'
              }`}
            />
            {errors.date && touched.date && (
              <p className="mt-1 text-sm text-red-400">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white input-focus"
              placeholder="Add additional notes..."
            />
          </div>

          {errors.submit && (
            <p className="text-sm text-red-400 text-center">{errors.submit}</p>
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