// src/services/transactionService.js
import api from './api';

export async function getTransactions(page = 1, limit = 10) {
  const response = await api.get(`/transactions?page=${page}&limit=${limit}`);
  return response.data;
}

export async function addIncome(data) {
  const response = await api.post('/transactions/income', data);
  return response.data;
}

export async function addExpense(data) {
  const response = await api.post('/transactions/expense', data);
  return response.data;
}

export async function getMonthlySummary() {
  const response = await api.get('/transactions/summary/monthly');
  return response.data;
}

export async function getExpenseBreakdown() {
  const response = await api.get('/transactions/breakdown/expenses');
  return response.data;
}