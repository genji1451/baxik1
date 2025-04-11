import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baxikTips, baxikGreetings, transactionReactions } from '@/mocks/baxik-tips';
import { Transaction, TransactionType } from '@/types';

interface BaxikState {
  lastInteraction: string | null;
  tipIndex: number;
  greetingIndex: number;
  lastTransactionId: string | null;
  showBaxikForTransaction: boolean; // Новый флаг для принудительного показа Баксика
  
  // Actions
  getRandomTip: () => string;
  getGreeting: () => string;
  getTransactionReaction: (transaction: Transaction, averageAmount: number) => string;
  updateLastInteraction: () => void;
  setLastTransactionId: (id: string) => void;
  triggerBaxikForTransaction: () => void; // Новый метод для принудительного показа
  resetBaxik: () => void;
}

export const useBaxikStore = create<BaxikState>()(
  persist(
    (set, get) => ({
      lastInteraction: null,
      tipIndex: 0,
      greetingIndex: 0,
      lastTransactionId: null,
      showBaxikForTransaction: false,
      
      getRandomTip: () => {
        const { tipIndex } = get();
        const newIndex = (tipIndex + 1) % baxikTips.length;
        set({ tipIndex: newIndex });
        return baxikTips[tipIndex];
      },
      
      getGreeting: () => {
        const { greetingIndex } = get();
        const newIndex = (greetingIndex + 1) % baxikGreetings.length;
        set({ greetingIndex: newIndex });
        return baxikGreetings[greetingIndex];
      },
      
      getTransactionReaction: (transaction: Transaction, averageAmount: number) => {
        const { type, amount } = transaction;
        
        // Определяем, большая ли это сумма
        const isBigAmount = amount > averageAmount * 2;
        
        let reactionPool;
        if (type === 'income') {
          reactionPool = isBigAmount 
            ? transactionReactions.bigIncome 
            : transactionReactions.income;
        } else {
          reactionPool = isBigAmount 
            ? transactionReactions.bigExpense 
            : transactionReactions.expense;
        }
        
        // Выбираем случайную реакцию из соответствующего пула
        const randomIndex = Math.floor(Math.random() * reactionPool.length);
        return reactionPool[randomIndex];
      },
      
      updateLastInteraction: () => {
        set({ lastInteraction: new Date().toISOString() });
      },
      
      setLastTransactionId: (id: string) => {
        set({ lastTransactionId: id });
      },
      
      triggerBaxikForTransaction: () => {
        // Устанавливаем флаг, чтобы показать Баксика
        set({ showBaxikForTransaction: true });
        
        // Сбрасываем флаг через небольшую задержку
        setTimeout(() => {
          set({ showBaxikForTransaction: false });
        }, 500);
      },
      
      resetBaxik: () => {
        set({
          lastInteraction: null,
          tipIndex: 0,
          greetingIndex: 0,
          lastTransactionId: null,
          showBaxikForTransaction: false,
        });
      },
    }),
    {
      name: 'baxik-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);