// src/hooks/useTransactions.js - UPDATED
import { useState, useEffect, useCallback } from 'react';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock data
      const mockTransactions = [
        { id: 1, description: 'Salary', amount: 5000, category: 'Salary', date: '2024-01-15', type: 'income' },
        { id: 2, description: 'Rent', amount: 1500, category: 'Housing', date: '2024-01-16', type: 'expense' },
        { id: 3, description: 'Groceries', amount: 300, category: 'Food', date: '2024-01-17', type: 'expense' },
        { id: 4, description: 'Freelance', amount: 1000, category: 'Freelance', date: '2024-01-18', type: 'income' },
        { id: 5, description: 'Utilities', amount: 200, category: 'Utilities', date: '2024-01-19', type: 'expense' },
      ];
      setTransactions(mockTransactions);
    } catch (err) {
      setError('Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMonthlySummary = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMonthlySummary({
        income: [5000, 5200, 4800, 5100, 5300, 5500, 5400, 5600, 5800, 5900, 6100, 6200],
        expenses: [3000, 3100, 2900, 3200, 3300, 3400, 3300, 3500, 3600, 3700, 3800, 3900]
      });
    } catch (err) {
      setError('Failed to fetch summary');
    }
  }, []);

  const fetchExpenseBreakdown = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setExpenseBreakdown([
        { category: 'Housing', amount: 1500 },
        { category: 'Food', amount: 800 },
        { category: 'Transport', amount: 400 },
        { category: 'Utilities', amount: 300 },
        { category: 'Entertainment', amount: 200 }
      ]);
    } catch (err) {
      setError('Failed to fetch breakdown');
    }
  }, []);

  const addIncome = useCallback(async (data) => {
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newTransaction = {
        id: Date.now(),
        ...data,
        type: 'income'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setSuccessMessage('Income added successfully');
      await fetchMonthlySummary();
      return { success: true };
    } catch (err) {
      setError('Failed to add income');
      return { success: false, error: 'Failed to add income' };
    }
  }, [fetchMonthlySummary]);

  const addExpense = useCallback(async (data) => {
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newTransaction = {
        id: Date.now(),
        ...data,
        type: 'expense'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setSuccessMessage('Expense added successfully');
      await fetchMonthlySummary();
      await fetchExpenseBreakdown();
      return { success: true };
    } catch (err) {
      setError('Failed to add expense');
      return { success: false, error: 'Failed to add expense' };
    }
  }, [fetchMonthlySummary, fetchExpenseBreakdown]);

  const deleteTransaction = useCallback(async (id) => {
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTransactions(prev => prev.filter(t => t.id !== id));
      setSuccessMessage('Transaction deleted successfully');
      await fetchMonthlySummary();
      await fetchExpenseBreakdown();
      return { success: true };
    } catch (err) {
      setError('Failed to delete transaction');
      return { success: false, error: 'Failed to delete transaction' };
    }
  }, [fetchMonthlySummary, fetchExpenseBreakdown]);

  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  useEffect(() => {
    fetchTransactions();
    fetchMonthlySummary();
    fetchExpenseBreakdown();
  }, [fetchTransactions, fetchMonthlySummary, fetchExpenseBreakdown]);

  return {
    transactions,
    monthlySummary,
    expenseBreakdown,
    isLoading,
    error,
    successMessage,
    addIncome,
    addExpense,
    deleteTransaction,
    refresh: fetchTransactions,
    clearSuccessMessage,
  };
}