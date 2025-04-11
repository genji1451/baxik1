import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { Transaction, Category } from '@/types';
import { formatCurrency } from '@/utils/finance-utils';
import { formatDate } from '@/utils/date-utils';
import { ChevronRight } from 'lucide-react-native';

interface TransactionItemProps {
  transaction: Transaction;
  category: Category;
  currency: string;
  onPress: (transaction: Transaction) => void;
}

const TransactionItem = ({ 
  transaction, 
  category, 
  currency, 
  onPress 
}: TransactionItemProps) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(transaction)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.leftContent}>
          <Text style={styles.title}>{category.name}</Text>
          {transaction.note && (
            <Text style={styles.note} numberOfLines={1}>
              {transaction.note}
            </Text>
          )}
        </View>
        
        <View style={styles.rightContent}>
          <Text 
            style={[
              styles.amount, 
              { 
                color: transaction.type === 'income' 
                  ? colors.success 
                  : colors.danger 
              }
            ]}
          >
            {transaction.type === 'income' ? '+' : '-'} 
            {formatCurrency(transaction.amount, currency)}
          </Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
      </View>
      
      <ChevronRight size={16} color={colors.textLight} style={styles.chevron} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
    marginRight: 8,
  },
  rightContent: {
    alignItems: 'flex-end',
    minWidth: 100,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  note: {
    fontSize: 12,
    color: colors.textLight,
    maxWidth: 150,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'right',
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'right',
  },
  chevron: {
    marginLeft: 4,
  },
});

export default TransactionItem;