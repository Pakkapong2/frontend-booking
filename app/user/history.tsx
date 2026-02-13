import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { getMyBorrowings } from '../../services/borrowing';
import { showToast } from '../../services/toast';
import { getItem } from '../../services/storage';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getMyBorrowings();
      const userStr = await getItem('user');
      const user = JSON.parse(userStr);
      
      const myData = data
        .filter(b => b.member_id === user.id)
        .sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date));
        
      setHistory(myData);
    } catch (error) {
      showToast('error', 'โหลดประวัติไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const renderHistoryItem = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.Book?.title}</Text>
          <Text className="text-gray-500 text-xs mt-1">
            วันที่ยืม: {new Date(item.borrow_date).toLocaleDateString('th-TH')}
          </Text>
          {item.return_date ? (
            <Text className="text-green-600 text-xs font-semibold">
              คืนเมื่อ: {new Date(item.return_date).toLocaleDateString('th-TH')}
            </Text>
          ) : (
            <Text className="text-orange-500 text-xs font-semibold">
              ยังไม่ได้คืน
            </Text>
          )}
        </View>
        <View className={`px-2 py-1 rounded-md ${item.return_date ? 'bg-green-100' : 'bg-orange-100'}`}>
          <Text className={`text-[10px] font-bold ${item.return_date ? 'text-green-700' : 'text-orange-700'}`}>
            {item.return_date ? 'คืนแล้ว' : 'กำลังยืม'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">ประวัติการยืม-คืน</Text>
      
      {loading && history.length === 0 ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.borrow_id.toString()}
          renderItem={renderHistoryItem}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">ไม่พบประวัติการยืม</Text>
          }
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchHistory} />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}