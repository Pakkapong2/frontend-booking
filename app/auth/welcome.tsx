import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-between py-12">
        <View className="items-center mt-10">
          <View className="w-32 h-32 bg-blue-600 rounded-3xl items-center justify-center shadow-xl shadow-blue-300">
            <Text className="text-white text-6xl font-bold">B</Text>
          </View>
          <Text className="text-4xl font-extrabold text-gray-900 mt-8 tracking-tight">
            My Library
          </Text>
          <Text className="text-gray-500 text-center mt-4 text-lg px-4 leading-6">
            ยินดีต้อนรับสู่ระบบจัดการห้องสมุดยุคใหม่ ง่าย สะดวก และรวดเร็ว
          </Text>
        </View>

        <View className="w-full mb-6">
          <TouchableOpacity 
            className="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-200 mb-4"
            onPress={() => router.push('../auth/login')}>
            <Text className="text-white text-center font-bold text-xl">เข้าสู่ระบบ</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-white border-2 border-blue-600 p-5 rounded-2xl"
            onPress={() => router.push('../auth/register')}>
            <Text className="text-blue-600 text-center font-bold text-xl">ลงทะเบียนสมาชิก</Text>
          </TouchableOpacity>
          
          <Text className="text-gray-400 text-center mt-8 text-xs">
            © 2026 EIEI Library Project. All rights reserved.
          </Text>
        </View>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}