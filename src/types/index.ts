export interface Account {
  name: string;
  balance: number;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

export interface TransactionResult {
  message: string;
}
