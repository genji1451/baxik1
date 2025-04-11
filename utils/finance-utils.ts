import { Transaction, Category } from '@/types';
import { getPeriodDates } from './date-utils';

export const formatCurrency = (
  amount: number,
  currency: string = '$'
): string => {
  return `${currency}${Math.abs(amount).toFixed(2)}`;
};

export const getTransactionsByPeriod = (
  transactions: Transaction[],
  period: 'day' | 'week' | 'month' | 'year',
  date: Date = new Date()
): Transaction[] => {
  const { start, end } = getPeriodDates(period, date);
  
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= start && transactionDate <= end;
  });
};

export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'income'
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);
};

export const calculateIncomeTotal = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((total, t) => total + t.amount, 0);
};

export const calculateExpenseTotal = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((total, t) => total + t.amount, 0);
};

export const getCategoryById = (
  categories: Category[],
  categoryId: string
): Category | undefined => {
  return categories.find((category) => category.id === categoryId);
};

export const getCategorySummary = (
  transactions: Transaction[],
  categories: Category[]
): { category: Category; amount: number; percentage: number }[] => {
  const categoryMap = new Map<string, number>();
  
  // Calculate total for each category
  transactions.forEach((transaction) => {
    const currentAmount = categoryMap.get(transaction.categoryId) || 0;
    categoryMap.set(
      transaction.categoryId,
      currentAmount + transaction.amount
    );
  });
  
  // Calculate total amount
  const totalAmount = Array.from(categoryMap.values()).reduce(
    (sum, amount) => sum + amount,
    0
  );
  
  // Create summary with percentages
  const summary = Array.from(categoryMap.entries())
    .map(([categoryId, amount]) => {
      const category = getCategoryById(categories, categoryId);
      if (!category) return null;
      
      return {
        category,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
      };
    })
    .filter((item): item is { category: Category; amount: number; percentage: number } => 
      item !== null
    )
    .sort((a, b) => b.amount - a.amount);
  
  return summary;
};

// Новая функция для расчета средней суммы транзакций
export const calculateAverageAmount = (transactions: Transaction[]): number => {
  if (transactions.length === 0) return 0;
  
  const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  return total / transactions.length;
};