import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { Period } from '@/types';

interface PeriodSelectorProps {
  periods: Period[];
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
}

const PeriodSelector = ({ 
  periods, 
  selectedPeriod, 
  onSelectPeriod 
}: PeriodSelectorProps) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {periods.map((period) => (
          <TouchableOpacity
            key={period.value}
            style={[
              styles.periodButton,
              selectedPeriod === period.value && styles.selectedPeriod,
            ]}
            onPress={() => onSelectPeriod(period.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period.value && styles.selectedPeriodText,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.card,
  },
  selectedPeriod: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: 14,
    color: colors.textLight,
  },
  selectedPeriodText: {
    color: colors.background,
    fontWeight: '500',
  },
});

export default PeriodSelector;