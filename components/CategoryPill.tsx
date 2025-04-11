import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { Category } from '@/types';

interface CategoryPillProps {
  category: Category;
  selected: boolean;
  onPress: (category: Category) => void;
}

const CategoryPill = ({ category, selected, onPress }: CategoryPillProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: selected ? category.color : colors.card },
        selected && styles.selectedContainer
      ]}
      onPress={() => onPress(category)}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{category.emoji}</Text>
      <Text
        style={[
          styles.text,
          { color: selected ? colors.background : colors.text },
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 18,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CategoryPill;