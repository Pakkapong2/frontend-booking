import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAllBorrowings, returnBook } from '../../services/borrowing';
import { showToast, showConfirm } from '../../services/toast';

export default function AdminBorrowedBooksScreen() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    setLoading(true);
    try {
      const data = await getAllBorrowings();
      const activeBorrowings = data.filter(b => !b.return_date);
      setBorrowings(activeBorrowings);
    } catch (error) {
      showToast('error', 'โหลดข้อมูลการยืมไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrow_id) => {
    const confirmed = await showConfirm(
      "ยืนยันการคืนหนังสือ",
      "คุณต้องการยืนยันว่าได้รับหนังสือคืนแล้วใช่หรือไม่?",
      "ยืนยัน"
    );

    if (confirmed) {
      try {
        await returnBook(borrow_id);
        showToast('success', 'คืนหนังสือสำเร็จ');
        fetchBorrowings();
      } catch (error : any) {
        showToast('error', error.error || 'การคืนหนังสือผิดพลาด');
      }
    }
  };

  const renderBorrowItem = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.Book?.title}</Text>
          <View className="mt-1">
            <Text className="text-blue-600 font-semibold">ผู้ยืม: {item.Member?.full_name}</Text>
            <Text className="text-gray-500 text-xs">Username: {item.Member?.username}</Text>
            <Text className="text-gray-400 text-[10px] mt-1">
              วันที่ยืม: {new Date(item.borrow_date).toLocaleString('th-TH')}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          className="bg-green-600 px-4 py-2 rounded-lg"
          onPress={() => handleReturn(item.borrow_id)}>
          <Text className="text-white font-bold">รับคืน</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">รายการที่ถูกยืมอยู่</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
      ) : (
        <FlatList
          data={borrowings}
          keyExtractor={(item) => item.borrow_id.toString()}
          renderItem={renderBorrowItem}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">ไม่มีหนังสือที่ถูกยืมในขณะนี้</Text>
          }
          onRefresh={fetchBorrowings}
          refreshing={loading}
        />
      )}
    </View>
  );
}