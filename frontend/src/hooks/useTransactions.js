// src/hooks/useTransactions.js
import { useState, useEffect, useCallback } from 'react';
import * as transactionService from '../services/transactionService';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await transactionService.getTransactions();
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMonthlySummary = useCallback(async () => {
    try {
      const data = await transactionService.getMonthlySummary();
      setMonthlySummary(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchExpenseBreakdown = useCallback(async () => {
    try {
      const data = await transactionService.getExpenseBreakdown();
      setExpenseBreakdown(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const addIncome = useCallback(async (data) => {
    try {
      await transactionService.addIncome(data);
      await fetchTransactions();
      await fetchMonthlySummary();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchTransactions, fetchMonthlySummary]);

  const addExpense = useCallback(async (data) => {
    try {
      await transactionService.addExpense(data);
      await fetchTransactions();
      await fetchMonthlySummary();
      await fetchExpenseBreakdown();
    } catch (err) {
      throw new Error(err.message);
    }
  }, [fetchTransactions, fetchMonthlySummary, fetchExpenseBreakdown]);

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
    addIncome,
    addExpense,
    refresh: fetchTransactions,
  };
}