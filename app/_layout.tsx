import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { colors } from "@/constants/colors";
import { 
  isRunningInTelegram, 
  getTelegramColorScheme, 
  expandTelegramWebApp 
} from "@/utils/telegram-utils";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Проверяем, запущено ли приложение в Telegram
  const runningInTelegram = Platform.OS === 'web' && isRunningInTelegram();
  
  // Если приложение запущено в Telegram, адаптируем интерфейс
  useEffect(() => {
    if (runningInTelegram) {
      console.log('Приложение запущено в Telegram Web App');
      
      // Можно получить цветовую схему из Telegram
      const colorScheme = getTelegramColorScheme();
      console.log('Telegram color scheme:', colorScheme);
      
      // Принудительно расширяем приложение на весь экран
      expandTelegramWebApp();
      
      // Повторяем расширение через небольшую задержку для мобильных устройств
      const expandTimer = setTimeout(() => {
        expandTelegramWebApp();
      }, 1000);
      
      return () => clearTimeout(expandTimer);
    }
  }, [runningInTelegram]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
        animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'default',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="transaction/new" 
        options={{ 
          presentation: 'modal',
          title: 'Новая транзакция',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="transaction/[id]" 
        options={{ 
          presentation: 'card',
          title: 'Детали транзакции',
          headerShown: true,
        }} 
      />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}