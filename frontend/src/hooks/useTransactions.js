import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL, getHeaders());
      // Adjust structure based on standard response { success: true, data: [...] }
      const data = response.data.data || response.data;
      setTransactions(data);
      calculateDerivedData(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Compute charts directly from transactions for accuracy
  const calculateDerivedData = (txList) => {
    const months = Array(12).fill(0);
    const incMonths = [...months];
    const expMonths = [...months];
    const expDict = {};

    txList.forEach(t => {
      const date = new Date(t.date);
      const month = date.getMonth(); // 0 to 11
      const amount = Number(t.amount);

      if (t.type === 'income') {
        incMonths[month] += amount;
      } else if (t.type === 'expense') {
        expMonths[month] += amount;
        expDict[t.category] = (expDict[t.category] || 0) + amount;
      }
    });

    setMonthlySummary({
      income: incMonths,
      expenses: expMonths
    });

    const breakdown = Object.keys(expDict).map(cat => ({
      category: cat,
      amount: expDict[cat]
    }));

    // Sort descending by amount
    breakdown.sort((a, b) => b.amount - a.amount);
    setExpenseBreakdown(breakdown);
  };

  const addIncome = useCallback(async (data) => {
    setError(null);
    try {
      const response = await axios.post(API_URL, { ...data, type: 'income' }, getHeaders());
      const newTx = response.data.data ? response.data.data : response.data;
      setTransactions(prev => {
        const updated = [newTx, ...prev];
        calculateDerivedData(updated);
        return updated;
      });
      setSuccessMessage('Income added successfully');
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to add income';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  const addExpense = useCallback(async (data) => {
    setError(null);
    try {
      const response = await axios.post(API_URL, { ...data, type: 'expense' }, getHeaders());
      const newTx = response.data.data ? response.data.data : response.data;
      setTransactions(prev => {
        const updated = [newTx, ...prev];
        calculateDerivedData(updated);
        return updated;
      });
      setSuccessMessage('Expense added successfully');
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to add expense';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`, getHeaders());
      setTransactions(prev => {
        const updated = prev.filter(t => t.id !== id && t._id !== id);
        calculateDerivedData(updated);
        return updated;
      });
      setSuccessMessage('Transaction deleted successfully');
      return { success: true };
    } catch (err) {
      setError('Failed to delete transaction');
      return { success: false, error: 'Failed to delete transaction' };
    }
  }, []);

  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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