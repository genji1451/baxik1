import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

export default function FloatingActionButton() {
  const handlePress = () => {
    // Вибрация при нажатии (только на мобильных устройствах)
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {
        // Игнорируем ошибки haptics на устройствах, где они не поддерживаются
      });
    }
    
    console.log('FloatingActionButton: нажатие обработано, переход на /transaction/new');
    
    // Используем прямую навигацию вместо Link
    try {
      router.push('/transaction/new');
    } catch (error) {
      console.error('Ошибка при навигации:', error);
      
      // Резервный вариант навигации
      setTimeout(() => {
        router.push('/transaction/new');
      }, 100);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Plus size={24} color={colors.background} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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