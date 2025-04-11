import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useBaxikStore } from '@/store/baxik-store';
import { useFinanceStore } from '@/store/finance-store';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { calculateAverageAmount } from '@/utils/finance-utils';

const BaxikAssistant = () => {
  const { 
    getRandomTip, 
    getGreeting, 
    getTransactionReaction, 
    updateLastInteraction, 
    lastTransactionId, 
    setLastTransactionId,
    showBaxikForTransaction
  } = useBaxikStore();
  const { settings, transactions } = useFinanceStore();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [bubbleAnimation] = useState(new Animated.Value(0));
  const initialRenderRef = useRef(true);
  
  // Проверяем новые транзакции при каждом рендере
  useEffect(() => {
    if (!settings.showBaxik || transactions.length === 0) return;
    
    // Получаем последнюю транзакцию
    const latestTransaction = [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    
    // Если это новая транзакция и она не совпадает с последней отслеженной
    // или если флаг showBaxikForTransaction установлен
    if ((latestTransaction && latestTransaction.id !== lastTransactionId) || showBaxikForTransaction) {
      // Вычисляем среднюю сумму для транзакций этого типа
      const averageAmount = calculateAverageAmount(
        transactions.filter(t => t.type === latestTransaction.type)
      );
      
      // Получаем реакцию на транзакцию
      const reaction = getTransactionReaction(latestTransaction, averageAmount);
      
      // Показываем Баксика с реакцией
      setMessage(reaction);
      setVisible(true);
      animateBubble(1);
      updateLastInteraction();
      
      // Запоминаем ID этой транзакции, чтобы не реагировать на неё повторно
      setLastTransactionId(latestTransaction.id);
    }
  }, [transactions, lastTransactionId, settings.showBaxik, showBaxikForTransaction]);
  
  // Показываем Баксика при первой загрузке
  useEffect(() => {
    if (!settings.showBaxik) return;
    
    // Показываем Баксика после короткой задержки при монтировании компонента
    // Но только при первом рендере
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      
      const timer = setTimeout(() => {
        if (!visible) {
          setMessage(getGreeting());
          setVisible(true);
          animateBubble(1);
          updateLastInteraction();
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [settings.showBaxik]);
  
  const animateBubble = (toValue: number) => {
    Animated.spring(bubbleAnimation, {
      toValue,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  const handleClose = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    animateBubble(0);
    setTimeout(() => setVisible(false), 300);
  };
  
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setMessage(getRandomTip());
    updateLastInteraction();
    
    // Анимируем пузырь
    Animated.sequence([
      Animated.timing(bubbleAnimation, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(bubbleAnimation, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  if (!visible || !settings.showBaxik) return null;
  
  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [
            { scale: bubbleAnimation },
            { translateY: bubbleAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            })},
          ],
          opacity: bubbleAnimation,
        },
      ]}
    >
      <View style={styles.bubbleContainer}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={handleClose}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <X size={16} color={colors.textLight} />
        </TouchableOpacity>
        
        <View style={styles.bubble}>
          <Text style={styles.message}>{message}</Text>
        </View>
        
        <View style={styles.bubbleTip} />
      </View>
      
      <TouchableOpacity onPress={handlePress} style={styles.catContainer}>
        <Image 
          source={{ uri: 'https://github.com/genji1451/baxik/blob/main/2025-04-10%2019.28.22.jpg?raw=true' }} 
          style={styles.catImage} 
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  bubbleContainer: {
    marginBottom: 10,
    alignItems: 'flex-end',
    maxWidth: 250,
  },
  bubble: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleTip: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
    alignSelf: 'flex-end',
    marginRight: 20,
    transform: [{ rotate: '180deg' }],
  },
  message: {
    color: colors.background,
    fontSize: 14,
    lineHeight: 20,
  },
  catContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  catImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  closeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.card,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default BaxikAssistant;