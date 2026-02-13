import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { register } from '../../services/auth';
import { showToast } from '../../services/toast';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { full_name, username, password, confirmPassword } = formData;

    if (!full_name || !username || !password || !confirmPassword) {
      showToast('error', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    if (password !== confirmPassword) {
      showToast('error', 'รหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);
    try {
      await register({ full_name, username, password });
      showToast('success', 'ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ');
      router.replace('../auth/login');
    } catch (error : any) {
      showToast('error', error.error || 'ลงทะเบียนไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-center">
      <TouchableOpacity 
        className="absolute top-12 left-6 z-10 bg-white p-2 rounded-full shadow-sm"
        onPress={() => router.back()}>
        <Text className="text-blue-600 font-bold">← กลับ</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View className="bg-white p-8 rounded-2xl shadow-lg">
          <Text className="text-3xl font-bold text-center text-blue-600 mb-8">
            สร้างบัญชีใหม่
          </Text>

          <View>
            <View className="mb-4">
              <Text className="text-gray-600 mb-2 font-semibold">ชื่อ-นามสกุล</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
                placeholder="ระบุชื่อ-นามสกุล"
                value={formData.full_name}
                onChangeText={(text) => setFormData({ ...formData, full_name: text })}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2 font-semibold">ชื่อผู้ใช้งาน</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
                placeholder="ระบุชื่อผู้ใช้งาน"
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
                autoCapitalize="none"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2 font-semibold">รหัสผ่าน</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
                placeholder="ระบุรหัสผ่าน"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2 font-semibold">ยืนยันรหัสผ่าน</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800"
                placeholder="ระบุรหัสผ่านอีกครั้ง"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className={`mt-6 p-4 rounded-xl items-center shadow-md ${
                loading ? 'bg-blue-300' : 'bg-blue-600'
              }`}
              onPress={handleRegister}
              disabled={loading}>
              <Text className="text-white font-bold text-lg">
                {loading ? 'กำลังประมวลผล...' : 'ลงทะเบียน'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-4" onPress={() => router.replace('../auth/login')}>
              <Text className="text-center text-blue-500">
                มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}