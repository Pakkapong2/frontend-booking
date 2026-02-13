import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function UserLayout() {
  const { user, logout } = useAuth();

  return (
    <Tabs screenOptions={{
      header: () => (
        <View className="bg-blue-600 p-6 pt-12 flex-row justify-between items-center">
          <View>
            <Text className="text-white font-bold text-xl">My Library</Text>
            <Text className="text-blue-100 text-xs">{user?.username} (สมาชิก)</Text>
          </View>
          <TouchableOpacity 
            className="bg-white/20 px-4 py-2 rounded-lg"
            onPress={logout}>
            <Text className="text-white font-semibold">ออกจากระบบ</Text>
          </TouchableOpacity>
        </View>
      ),
      tabBarActiveTintColor: '#2563eb',
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'หนังสือ',
        }} 
      />
      <Tabs.Screen 
        name="borrowing" 
        options={{ 
          title: 'การยืม',
        }} 
      />
      <Tabs.Screen 
        name="history" 
        options={{ 
          title: 'ประวัติ',
        }} 
      />
    </Tabs>
  );
}