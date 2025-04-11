import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { Period } from '@/types';
import { 
  getTransactionsByPeriod, 
  calculateBalance, 
  calculateIncomeTotal, 
  calculateExpenseTotal,
  getCategoryById
} from '@/utils/finance-utils';
import { formatPeriodLabel } from '@/utils/date-utils';
import BalanceCard from '@/components/BalanceCard';
import TransactionItem from '@/components/TransactionItem';
import PeriodSelector from '@/components/PeriodSelector';
import EmptyState from '@/components/EmptyState';
import BaxikAssistant from '@/components/BaxikAssistant';
import { Plus } from 'lucide-react-native';
import { Platform } from 'react-native';
import { isRunningInTelegram, showTelegramMainButton } from '@/utils/telegram-utils';

const periods: Period[] = [
  { label: 'День', value: 'day' },
  { label: 'Неделя', value: 'week' },
  { label: 'Месяц', value: 'month' },
  { label: 'Год', value: 'year' },
];

export default function DashboardScreen() {
  const { transactions, categories, settings } = useFinanceStore();
  const [selectedPeriod, setSelectedPeriod] = useState<Period['value']>('month');
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  
  // Проверяем, запущено ли приложение в Telegram
  const runningInTelegram = Platform.OS === 'web' && isRunningInTelegram();
  
  useEffect(() => {
    const filtered = getTransactionsByPeriod(transactions, selectedPeriod);
    setFilteredTransactions(filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }, [transactions, selectedPeriod]);
  
  // Настраиваем кнопку в Telegram Web App
  useEffect(() => {
    if (runningInTelegram) {
      showTelegramMainButton('Добавить транзакцию', handleAddTransaction);
    }
  }, [runningInTelegram]);
  
  const balance = calculateBalance(filteredTransactions);
  const income = calculateIncomeTotal(filteredTransactions);
  const expenses = calculateExpenseTotal(filteredTransactions);
  
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period as Period['value']);
  };
  
  const handleTransactionPress = (transaction: typeof transactions[0]) => {
    router.push(`/transaction/${transaction.id}`);
  };
  
  const handleAddTransaction = () => {
    console.log('Нажата кнопка добавления транзакции');
    router.push('/transaction/new');
  };
  
  const renderTransactionItem = ({ item }: { item: typeof transactions[0] }) => {
    const category = getCategoryById(categories, item.categoryId);
    if (!category) return null;
    
    return (
      <TransactionItem
        transaction={item}
        category={category}
        currency={settings.currency}
        onPress={handleTransactionPress}
      />
    );
  };
  
  const renderEmptyState = () => (
    <EmptyState
      title="Нет транзакций"
      message="Добавьте свою первую транзакцию, нажав на кнопку + внизу"
      emoji="💸" // Заменяем image на emoji
    />
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Мой баланс</Text>
      </View>
      
      <PeriodSelector
        periods={periods}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={handlePeriodChange}
      />
      
      <BalanceCard
        balance={balance}
        income={income}
        expenses={expenses}
        currency={settings.currency}
        period={formatPeriodLabel(selectedPeriod)}
      />
      
      <View style={styles.transactionsHeader}>
        <Text style={styles.transactionsTitle}>Последние транзакции</Text>
      </View>
      
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
      
      {/* Показываем кнопку добавления только если не в Telegram */}
      {!runningInTelegram && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddTransaction}
          activeOpacity={0.8}
        >
          <Plus size={24} color={colors.background} />
        </TouchableOpacity>
      )}
      
      {/* Показываем Баксика только если не в Telegram */}
      {!runningInTelegram && settings.showBaxik && (
        <BaxikAssistant />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  listContent: {
    paddingBottom: 80,
    flexGrow: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 100,
  },
});