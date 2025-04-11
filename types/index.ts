export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string; // ISO string
  note?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  emoji: string; // Добавляем поле для эмодзи
  type: TransactionType;
  color: string;
}

export interface Period {
  label: string;
  value: 'day' | 'week' | 'month' | 'year';
}

export interface AppSettings {
  currency: string;
  showBaxik: boolean;
}