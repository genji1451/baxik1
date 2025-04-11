import { Platform } from 'react-native';

// Интерфейс для типизации Telegram Web App API
interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  themeParams: {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
  };
  colorScheme: 'light' | 'dark';
  initDataUnsafe: any;
  initData: string;
  version: string;
  platform: string;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
}

// Получение объекта Telegram Web App
export const getTelegramWebApp = (): TelegramWebApp | null => {
  if (Platform.OS !== 'web') {
    return null;
  }
  
  // @ts-ignore - доступ к глобальному объекту window
  return window.telegramWebApp || null;
};

// Проверка, запущено ли приложение в Telegram
export const isRunningInTelegram = (): boolean => {
  return getTelegramWebApp() !== null;
};

// Получение цветовой схемы из Telegram
export const getTelegramColorScheme = (): 'light' | 'dark' => {
  const tg = getTelegramWebApp();
  return tg?.colorScheme || 'dark';
};

// Получение цветов темы из Telegram
export const getTelegramThemeColors = () => {
  const tg = getTelegramWebApp();
  return tg?.themeParams || null;
};

// Показать кнопку назад в Telegram
export const showTelegramBackButton = (callback?: () => void) => {
  const tg = getTelegramWebApp();
  if (!tg) return;
  
  if (callback) {
    tg.BackButton.onClick(callback);
  }
  tg.BackButton.show();
};

// Скрыть кнопку назад в Telegram
export const hideTelegramBackButton = () => {
  const tg = getTelegramWebApp();
  if (!tg) return;
  
  tg.BackButton.hide();
};

// Показать главную кнопку в Telegram
export const showTelegramMainButton = (text: string, callback?: () => void) => {
  const tg = getTelegramWebApp();
  if (!tg) return;
  
  tg.MainButton.setText(text);
  
  if (callback) {
    tg.MainButton.onClick(callback);
  }
  
  tg.MainButton.show();
};

// Скрыть главную кнопку в Telegram
export const hideTelegramMainButton = () => {
  const tg = getTelegramWebApp();
  if (!tg) return;
  
  tg.MainButton.hide();
};

// Принудительно расширить приложение на весь экран
export const expandTelegramWebApp = () => {
  const tg = getTelegramWebApp();
  if (!tg) return;
  
  // Сообщаем Telegram, что всё готово
  tg.ready();
  
  // Расширяем веб-приложение на весь экран
  tg.expand();
};