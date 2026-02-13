import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { login as loginApi } from '../../services/auth';
import { showToast } from '../../services/toast';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      showToast('error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const data = await loginApi(username, password);
      await login(data);
      showToast('success', 'Login successful!');
    } catch (error : any) {
      showToast('error', error.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-center px-6">
      <TouchableOpacity 
        className="absolute top-12 left-6 z-10 bg-white p-2 rounded-full shadow-sm"
        onPress={() => router.back()}>
        <Text className="text-blue-600 font-bold">← กลับ</Text>
      </TouchableOpacity>

      <View className="bg-white p-8 rounded-2xl shadow-lg">
        <Text className="text-3xl font-bold text-center text-blue-600 mb-8">
          Welcome Back
        </Text>
        
        <View>
          <View className="mb-4">
            <Text className="text-gray-600 mb-2 font-semibold">Username</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 mb-2 font-semibold">Password</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className={`mt-8 p-4 rounded-xl items-center shadow-md ${
              loading ? 'bg-blue-300' : 'bg-blue-600'
            }`}
            onPress={handleLogin}
            disabled={loading}>
            <Text className="text-white font-bold text-lg">
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="mt-4" onPress={() => router.push('../auth/register')}>
            <Text className="text-center text-blue-500">
              Dont have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}