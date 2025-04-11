import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert
} from 'react-native';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { useBaxikStore } from '@/store/baxik-store';
import { TransactionType } from '@/types';
import CategoryPill from '@/components/CategoryPill';
import { Check, ArrowLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { 
  isRunningInTelegram, 
  showTelegramMainButton, 
  hideTelegramMainButton 
} from '@/utils/telegram-utils';

export default function NewTransactionScreen() {
  const { categories, settings, addTransaction } = useFinanceStore();
  const { setLastTransactionId, triggerBaxikForTransaction } = useBaxikStore();
  
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  
  const filteredCategories = categories.filter((c) => c.type === type);
  
  // Проверяем, запущено ли приложение в Telegram
  const runningInTelegram = Platform.OS === 'web' && isRunningInTelegram();
  
  // Настраиваем кнопку в Telegram Web App
  useEffect(() => {
    if (runningInTelegram) {
      showTelegramMainButton('Сохранить', handleSave);
      
      return () => {
        hideTelegramMainButton();
      };
    }
  }, [runningInTelegram, amount, categoryId]);
  
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategoryId('');
  };
  
  const handleCategorySelect = (category: typeof categories[0]) => {
    setCategoryId(category.id);
  };
  
  const handleSave = () => {
    console.log('Попытка сохранения транзакции...');
    
    if (!amount || !categoryId) {
      console.log('Ошибка: не заполнены обязательные поля');
      if (Platform.OS === 'web') {
        alert('Пожалуйста, заполните сумму и выберите категорию');
      } else {
        Alert.alert('Ошибка', 'Пожалуйста, заполните сумму и выберите категорию');
      }
      return;
    }
    
    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) {
        throw new Error('Некорректная сумма');
      }
      
      console.log('Сохранение транзакции с параметрами:', {
        amount: numAmount,
        type,
        categoryId,
        date: new Date().toISOString(),
        note: note.trim() || undefined,
      });
      
      // Создаем новую транзакцию
      const newTransaction = {
        amount: numAmount,
        type,
        categoryId,
        date: new Date().toISOString(),
        note: note.trim() || undefined,
      };
      
      // Добавляем транзакцию в хранилище
      addTransaction(newTransaction);
      
      // Активируем появление Баксика для новой транзакции
      triggerBaxikForTransaction();
      
      // Вибрация при успешном сохранении (только на мобильных устройствах)
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
      
      // Возвращаемся на предыдущий экран
      router.back();
    } catch (error) {
      console.error('Ошибка при сохранении транзакции:', error);
      if (Platform.OS === 'web') {
        alert('Ошибка при сохранении транзакции');
      } else {
        Alert.alert('Ошибка', 'Не удалось сохранить транзакцию');
      }
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={handleSave}>
                <Check size={24} color={colors.primary} />
              </TouchableOpacity>
            ),
          }}
        />
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.typeSelector}>
            <View
              style={[
                styles.typeSelectorBackground,
                { left: type === 'income' ? '50%' : 0 },
              ]}
            />
            <Text
              style={[
                styles.typeOption,
                type === 'expense' && styles.selectedTypeOption,
              ]}
              onPress={() => handleTypeChange('expense')}
            >
              Расход
            </Text>
            <Text
              style={[
                styles.typeOption,
                type === 'income' && styles.selectedTypeOption,
              ]}
              onPress={() => handleTypeChange('income')}
            >
              Доход
            </Text>
          </View>
          
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>{settings.currency}</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={colors.textLight}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
          </View>
          
          <Text style={styles.sectionTitle}>Категория</Text>
          
          <View style={styles.categoriesContainer}>
            {filteredCategories.map((category) => (
              <CategoryPill
                key={category.id}
                category={category}
                selected={category.id === categoryId}
                onPress={handleCategorySelect}
              />
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Примечание (необязательно)</Text>
          
          <TextInput
            style={styles.noteInput}
            placeholder="Добавьте примечание..."
            placeholderTextColor={colors.textLight}
            multiline
            value={note}
            onChangeText={setNote}
          />
          
          {/* Добавляем отступ внизу для кнопки */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
        
        {/* Показываем кнопку сохранения только если не в Telegram */}
        {!runningInTelegram && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Дополнительный отступ для кнопки внизу
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 8,
    height: 48,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  typeSelectorBackground: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  typeOption: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingVertical: 12,
    zIndex: 1,
    color: colors.text,
    fontWeight: '500',
  },
  selectedTypeOption: {
    color: colors.background,
    fontWeight: '600',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    minWidth: 150,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  noteInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    color: colors.text,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  bottomSpacer: {
    height: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});