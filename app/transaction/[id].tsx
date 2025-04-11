import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  SafeAreaView
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { formatCurrency } from '@/utils/finance-utils';
import { formatDate, formatTime } from '@/utils/date-utils';
import { Trash2, Edit2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { 
  isRunningInTelegram, 
  showTelegramMainButton, 
  hideTelegramMainButton,
  showTelegramBackButton
} from '@/utils/telegram-utils';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { transactions, categories, settings, deleteTransaction } = useFinanceStore();
  const [transaction, setTransaction] = useState(null);
  const [category, setCategory] = useState(null);
  
  // Проверяем, запущено ли приложение в Telegram
  const runningInTelegram = Platform.OS === 'web' && isRunningInTelegram();
  
  useEffect(() => {
    if (!id) return;
    
    const foundTransaction = transactions.find((t) => t.id === id);
    if (foundTransaction) {
      setTransaction(foundTransaction);
      
      const foundCategory = categories.find(
        (c) => c.id === foundTransaction.categoryId
      );
      if (foundCategory) {
        setCategory(foundCategory);
      }
    }
  }, [id, transactions, categories]);
  
  // Настраиваем кнопки в Telegram Web App
  useEffect(() => {
    if (runningInTelegram) {
      showTelegramBackButton(() => router.back());
      showTelegramMainButton('Удалить транзакцию', handleDelete);
      
      return () => {
        hideTelegramMainButton();
      };
    }
  }, [runningInTelegram, id]);
  
  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (confirm("Вы уверены, что хотите удалить эту транзакцию?")) {
        deleteTransaction(id as string);
        router.back();
      }
    } else {
      Alert.alert(
        "Удалить транзакцию",
        "Вы уверены, что хотите удалить эту транзакцию?",
        [
          {
            text: "Отмена",
            style: "cancel",
          },
          {
            text: "Удалить",
            style: "destructive",
            onPress: () => {
              if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
              }
              deleteTransaction(id as string);
              router.back();
            },
          },
        ]
      );
    }
  };
  
  const handleEdit = () => {
    // Navigate to edit screen (not implemented in this version)
    router.back();
  };
  
  if (!transaction || !category) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFoundText}>Транзакция не найдена</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Детали транзакции',
        }}
      />
      
      <View style={styles.card}>
        <View style={styles.header}>
          <View 
            style={[
              styles.typeIndicator, 
              { 
                backgroundColor: 
                  transaction.type === 'income' ? colors.success : colors.danger 
              }
            ]}
          />
          <Text style={styles.type}>
            {transaction.type === 'income' ? 'Доход' : 'Расход'}
          </Text>
        </View>
        
        <Text style={styles.amount}>
          {transaction.type === 'income' ? '+' : '-'} 
          {formatCurrency(transaction.amount, settings.currency)}
        </Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Категория</Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={styles.detailValue}>{category.name}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Дата</Text>
            <Text style={styles.detailValue}>
              {formatDate(transaction.date)}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Время</Text>
            <Text style={styles.detailValue}>
              {formatTime(transaction.date)}
            </Text>
          </View>
          
          {transaction.note && (
            <>
              <View style={styles.divider} />
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Примечание</Text>
                <Text style={styles.detailValue}>{transaction.note}</Text>
              </View>
            </>
          )}
        </View>
      </View>
      
      {/* Показываем кнопки действий только если не в Telegram */}
      {!runningInTelegram && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color={colors.danger} />
            <Text style={[styles.actionButtonText, { color: colors.danger }]}>
              Удалить
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEdit}
          >
            <Edit2 size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              Редактировать
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  notFoundText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  type: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  amount: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 24,
  },
  detailsContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    maxWidth: '60%',
    textAlign: 'right',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: colors.danger + '20',
  },
  editButton: {
    backgroundColor: colors.primary + '20',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});