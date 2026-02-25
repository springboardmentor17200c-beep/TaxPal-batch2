// src/components/TransactionFilter.jsx
import { Filter } from 'lucide-react';

export default function TransactionFilter({ currentFilter, onFilterChange }) {
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ];

  return (
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-gray-400" />
      <div className="flex gap-1">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              currentFilter === filter.value
                ? 'bg-accent/20 text-accent'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}