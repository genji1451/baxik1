import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { formatCurrency } from '@/utils/finance-utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react-native';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
  currency: string;
  period: string;
}

const BalanceCard = ({ 
  balance, 
  income, 
  expenses, 
  currency, 
  period 
}: BalanceCardProps) => {
  const isNegative = balance < 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Баланс • {period}</Text>
        <Text style={[
          styles.balanceAmount, 
          isNegative ? { color: colors.danger } : {}
        ]}>
          {isNegative ? '-' : ''}{formatCurrency(balance, currency)}
        </Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.iconContainer}>
            <ArrowUpRight size={16} color={colors.success} />
          </View>
          <View>
            <Text style={styles.statLabel}>Доходы</Text>
            <Text style={[styles.statAmount, { color: colors.success }]}>
              {formatCurrency(income, currency)}
            </Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <View style={styles.iconContainer}>
            <ArrowDownRight size={16} color={colors.danger} />
          </View>
          <View>
            <Text style={styles.statLabel}>Расходы</Text>
            <Text style={[styles.statAmount, { color: colors.danger }]}>
              {formatCurrency(expenses, currency)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceContainer: {
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
});

export default BalanceCard;