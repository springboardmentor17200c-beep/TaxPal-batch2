// src/components/TransactionList.jsx - UPDATED with delete and filter
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import TransactionFilter from './TransactionFilter';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EmptyState from './EmptyState';

export default function TransactionList({
  transactions = [],
  onDelete,
  isLoading
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, transactionId: null, isDeleting: false });
  const itemsPerPage = 10;

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter(t => t.type === filter);
  }, [transactions, filter]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, transactionId: id, isDeleting: false });
  };

  const handleDeleteConfirm = async () => {
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    try {
      await onDelete(deleteModal.transactionId);
      setDeleteModal({ isOpen: false, transactionId: null, isDeleting: false });
    } catch (error) {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-slate-500 font-medium">Loading transactions...</p>
      </div>
    );
  }

  if (!transactions.length) {
    return <EmptyState type="transactions" />;
  }

  return (
    <>
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl premium-shadow border border-slate-200/50 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <TransactionFilter currentFilter={filter} onFilterChange={setFilter} />
          <p className="text-sm text-slate-500 font-medium">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredTransactions.length === 0 ? (
          <EmptyState type={filter} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/80 border-b border-slate-100 backdrop-blur">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white/50">
                  {paginatedTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-slate-50 hover:shadow-sm transition-all duration-200 group relative z-0 hover:z-10"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDeleteClick(transaction.id)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl shadow-sm border border-slate-200 hover:border-rose-500 hover:shadow-rose-500/20 hover:-translate-y-0.5"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white/50 backdrop-blur">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2.5 hover:bg-white text-slate-600 rounded-xl disabled:opacity-50 hover:shadow-sm disabled:hover:shadow-none border border-transparent hover:border-slate-200 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 hover:bg-white text-slate-600 rounded-xl disabled:opacity-50 hover:shadow-sm disabled:hover:shadow-none border border-transparent hover:border-slate-200 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, transactionId: null, isDeleting: false })}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteModal.isDeleting}
      />
    </>
  );
}