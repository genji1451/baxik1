import { Redirect } from 'expo-router';

export default function Index() {
  // Редирект на главный экран
  return <Redirect href="/(tabs)" />;
}