export interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  status: 'pending' | 'completed' | 'failed';
  timestamp: string; // ISO date string
  source_account_id: string;
  target_account_id?: string;
  description?: string;
}

export interface TransactionResult {
  message: string;
}
