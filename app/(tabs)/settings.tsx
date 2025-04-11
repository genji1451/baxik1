import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { useBaxikStore } from '@/store/baxik-store';
import { 
  DollarSign, 
  Cat, 
  Trash2, 
  ChevronRight, 
  HelpCircle, 
  Info
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import CurrencySelector from '@/components/CurrencySelector';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings, resetStore } = useFinanceStore();
  const { resetBaxik } = useBaxikStore();
  const [currencySelectorVisible, setCurrencySelectorVisible] = useState(false);
  
  const handleToggleBaxik = () => {
    updateSettings({ showBaxik: !settings.showBaxik });
  };
  
  const handleResetData = () => {
    resetStore();
    resetBaxik();
  };
  
  const handleCurrencySelect = (currency: string) => {
    updateSettings({ currency });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Предпочтения</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setCurrencySelectorVisible(true)}
          >
            <View style={styles.settingIconContainer}>
              <DollarSign size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Валюта</Text>
              <Text style={styles.settingValue}>{settings.currency}</Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Cat size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Показывать Баксика</Text>
              <Text style={styles.settingDescription}>
                Показывать кота-помощника Баксика
              </Text>
            </View>
            <Switch
              value={settings.showBaxik}
              onValueChange={handleToggleBaxik}
              trackColor={{ false: colors.inactive, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Данные</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleResetData}
          >
            <View style={[styles.settingIconContainer, { backgroundColor: colors.danger + '20' }]}>
              <Trash2 size={20} color={colors.danger} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: colors.danger }]}>
                Сбросить все данные
              </Text>
              <Text style={styles.settingDescription}>
                Это удалит все ваши транзакции и настройки
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О приложении</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Info size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Версия</Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Помощь и поддержка</Text>
              <Text style={styles.settingDescription}>
                Получить помощь по использованию приложения
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <CurrencySelector
        visible={currencySelectorVisible}
        selectedCurrency={settings.currency}
        onSelect={handleCurrencySelect}
        onClose={() => setCurrencySelectorVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textLight,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textLight,
  },
});