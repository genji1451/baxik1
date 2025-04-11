import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { Period, TransactionType } from '@/types';
import { 
  getTransactionsByPeriod, 
  calculateIncomeTotal, 
  calculateExpenseTotal,
  getCategorySummary,
  formatCurrency
} from '@/utils/finance-utils';
import { formatPeriodLabel } from '@/utils/date-utils';
import PeriodSelector from '@/components/PeriodSelector';
import EmptyState from '@/components/EmptyState';

const periods: Period[] = [
  { label: 'День', value: 'day' },
  { label: 'Неделя', value: 'week' },
  { label: 'Месяц', value: 'month' },
  { label: 'Год', value: 'year' },
];

export default function StatisticsScreen() {
  const { transactions, categories, settings } = useFinanceStore();
  const [selectedPeriod, setSelectedPeriod] = useState<Period['value']>('month');
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  
  useEffect(() => {
    const filtered = getTransactionsByPeriod(transactions, selectedPeriod)
      .filter(t => t.type === selectedType);
    setFilteredTransactions(filtered);
  }, [transactions, selectedPeriod, selectedType]);
  
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period as Period['value']);
  };
  
  const handleTypeChange = (type: TransactionType) => {
    setSelectedType(type);
  };
  
  const totalIncome = calculateIncomeTotal(
    getTransactionsByPeriod(transactions, selectedPeriod)
  );
  
  const totalExpenses = calculateExpenseTotal(
    getTransactionsByPeriod(transactions, selectedPeriod)
  );
  
  const categorySummary = getCategorySummary(
    filteredTransactions,
    categories.filter(c => c.type === selectedType)
  );
  
  if (transactions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="Статистика отсутствует"
          message="Добавьте транзакции, чтобы увидеть статистику"
          emoji="📊" // Заменяем image на emoji
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <PeriodSelector
        periods={periods}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={handlePeriodChange}
      />
      
      <View style={styles.header}>
        <Text style={styles.periodLabel}>{formatPeriodLabel(selectedPeriod)}</Text>
      </View>
      
      <View style={styles.typeSelector}>
        <View
          style={[
            styles.typeSelectorBackground,
            { left: selectedType === 'income' ? '50%' : 0 },
          ]}
        />
        <Text
          style={[
            styles.typeOption,
            selectedType === 'expense' && styles.selectedTypeOption,
          ]}
          onPress={() => handleTypeChange('expense')}
        >
          Расходы
        </Text>
        <Text
          style={[
            styles.typeOption,
            selectedType === 'income' && styles.selectedTypeOption,
          ]}
          onPress={() => handleTypeChange('income')}
        >
          Доходы
        </Text>
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Всего доходов</Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>
            {formatCurrency(totalIncome, settings.currency)}
          </Text>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Всего расходов</Text>
          <Text style={[styles.summaryValue, { color: colors.danger }]}>
            {formatCurrency(totalExpenses, settings.currency)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>
        {selectedType === 'expense' ? 'Расходы' : 'Доходы'} по категориям
      </Text>
      
      <ScrollView style={styles.categoriesContainer}>
        {categorySummary.length === 0 ? (
          <Text style={styles.emptyText}>
            Нет {selectedType === 'expense' ? 'расходов' : 'доходов'} за этот период
          </Text>
        ) : (
          categorySummary.map((item) => (
            <View key={item.category.id} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryEmoji}>{item.category.emoji}</Text>
                  <Text style={styles.categoryName}>{item.category.name}</Text>
                </View>
                <Text style={styles.categoryPercentage}>
                  {item.percentage.toFixed(1)}%
                </Text>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${item.percentage}%`,
                      backgroundColor: item.category.color,
                    },
                  ]}
                />
              </View>
              
              <Text style={styles.categoryAmount}>
                {formatCurrency(item.amount, settings.currency)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
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
    alignItems: 'center',
    marginBottom: 16,
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  typeSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    height: 40,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  typeSelectorBackground: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 8,
    transition: 'left 0.3s ease',
  },
  typeOption: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingVertical: 10,
    zIndex: 1,
    color: colors.text,
  },
  selectedTypeOption: {
    color: colors.background,
    fontWeight: '600',
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  categoriesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  categoryItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  categoryPercentage: {
    fontSize: 14,
    color: colors.textLight,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textLight,
    marginTop: 24,
  },
});