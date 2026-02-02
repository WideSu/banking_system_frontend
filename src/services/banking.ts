import api from './api';
import { Account } from '../types/account';
import { TransactionResult } from '../types/transaction';

// Create Account
export const createAccount = async (name: string, initialBalance: number): Promise<void> => {
  await api.post('/accounts/', { name, initial_balance: initialBalance });
};

// Get Account Balance/Details
export const getAccount = async (name: string): Promise<Account> => {
  const response = await api.get<Account>(`/accounts/${name}`);
  return response.data;
};

// Deposit
export const deposit = async (name: string, amount: number): Promise<TransactionResult> => {
  const response = await api.post(`/accounts/${name}/deposits`, { amount });
  return response.data;
};

// Withdraw
export const withdraw = async (name: string, amount: number): Promise<TransactionResult> => {
  const response = await api.post(`/accounts/${name}/withdrawals`, { amount });
  return response.data;
};

// Transfer
export const transfer = async (sender: string, recipient: string, amount: number): Promise<TransactionResult> => {
  const response = await api.post('/transfers', { sender, recipient, amount });
  return response.data;
};
