import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { colors } from '@/constants/colors';
import { Check } from 'lucide-react-native';

interface Currency {
  symbol: string;
  name: string;
}

const currencies: Currency[] = [
  { symbol: '$', name: 'Доллар США' },
  { symbol: '€', name: 'Евро' },
  { symbol: '₽', name: 'Российский рубль' },
  { symbol: '₸', name: 'Казахстанский тенге' },
  { symbol: '₴', name: 'Украинская гривна' },
  { symbol: '£', name: 'Фунт стерлингов' },
  { symbol: '¥', name: 'Японская иена' },
  { symbol: '₿', name: 'Биткоин' },
];

interface CurrencySelectorProps {
  visible: boolean;
  selectedCurrency: string;
  onSelect: (currency: string) => void;
  onClose: () => void;
}

const CurrencySelector = ({
  visible,
  selectedCurrency,
  onSelect,
  onClose,
}: CurrencySelectorProps) => {
  const renderCurrencyItem = ({ item }: { item: Currency }) => (
    <TouchableOpacity
      style={styles.currencyItem}
      onPress={() => {
        onSelect(item.symbol);
        onClose();
      }}
    >
      <View style={styles.currencyInfo}>
        <Text style={styles.currencySymbol}>{item.symbol}</Text>
        <Text style={styles.currencyName}>{item.name}</Text>
      </View>
      {selectedCurrency === item.symbol && (
        <Check size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Выберите валюту</Text>
          </View>
          
          <FlatList
            data={currencies}
            renderItem={renderCurrencyItem}
            keyExtractor={(item) => item.symbol}
            contentContainerStyle={styles.listContent}
          />
          
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '70%',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  currencyName: {
    fontSize: 16,
    color: colors.text,
  },
  cancelButton: {
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
});

export default CurrencySelector;