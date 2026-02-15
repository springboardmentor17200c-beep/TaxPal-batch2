// src/components/EmptyState.jsx
import { Wallet } from 'lucide-react';

export default function EmptyState({ type = 'transactions' }) {
  const messages = {
    transactions: {
      title: 'No transactions yet',
      description: 'Get started by adding your first income or expense',
    },
    income: {
      title: 'No income records',
      description: 'Add your first income to start tracking',
    },
    expense: {
      title: 'No expenses yet',
      description: 'Add your first expense to see them here',
    },
  };

  const message = messages[type] || messages.transactions;

  return (
    <div className="glass-card p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-white/5 rounded-full">
          <Wallet className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{message.title}</h3>
      <p className="text-gray-400">{message.description}</p>
    </div>
  );
}