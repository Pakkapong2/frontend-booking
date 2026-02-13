import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { AuthProvider } from '../context/AuthContext';
import '../global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}