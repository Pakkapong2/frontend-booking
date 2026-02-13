import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getMyBorrowings, returnBook } from '../../services/borrowing';
import { showToast } from '../../services/toast';
import { getItem } from '../../services/storage';

export default function BorrowingScreen() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      const data = await getMyBorrowings();
      const userStr = await getItem('user');
      const user = JSON.parse(userStr);
      const myData = data.filter(b => b.member_id === user.id && !b.return_date);
      setBorrowings(myData);
    } catch (error) {
      showToast('error', 'Failed to fetch borrowing history');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrow_id) => {
    try {
      await returnBook(borrow_id);
      showToast('success', 'Book returned successfully');
      fetchBorrowings();
    } catch (error) {
      showToast('error', error.error || 'Failed to return book');
    }
  };

  const renderBorrowItem = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.Book?.title}</Text>
          <Text className="text-gray-500">Borrowed: {new Date(item.borrow_date).toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity 
          className="bg-orange-500 px-4 py-2 rounded-lg"
          onPress={() => handleReturn(item.borrow_id)}>
          <Text className="text-white font-bold">Return</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">My Borrowed Books</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
      ) : (
        <FlatList
          data={borrowings}
          keyExtractor={(item) => item.borrow_id.toString()}
          renderItem={renderBorrowItem}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">You have no borrowed books</Text>
          }
        />
      )}
    </View>
  );
}