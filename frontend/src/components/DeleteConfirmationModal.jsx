// src/components/DeleteConfirmationModal.jsx
import { X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isLoading }) {
  if (!isOpen) return null;

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

        <h2 className="text-xl font-semibold text-white mb-2">Delete Transaction</h2>
        <p className="text-gray-400 mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}