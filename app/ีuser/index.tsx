import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { getAllBooks } from '../../services/book';
import { borrowBook } from '../../services/borrowing';
import { showToast } from '../../services/toast';
import { CustomModal } from '../../components/CustomModal';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function UserBookScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getAllBooks();
      setBooks(data);
    } catch (error) {
      showToast('error', 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const openBorrowModal = (book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  const handleConfirmBorrow = async () => {
    if (!selectedBook) return;

    try {
      await borrowBook(selectedBook.book_id, returnDate);
      showToast('success', 'Book borrowed successfully!');
      setModalVisible(false);
      fetchBooks();
    } catch (error : any) {
      showToast('error', error.error || 'Failed to borrow book');
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || returnDate;
    setShowDatePicker(Platform.OS === 'ios');
    setReturnDate(currentDate);
  };

  const renderBookItem = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
          <Text className="text-gray-500">Author: {item.author}</Text>
          <Text className="text-blue-500 text-xs mt-1">
            Category: {item.BookType?.book_type_name || 'N/A'}
          </Text>
        </View>
        <View className="items-end">
          <View className={`px-3 py-1 rounded-full mb-2 ${
            item.status === 'available' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <Text className={`text-xs font-semibold ${
              item.status === 'available' ? 'text-green-700' : 'text-red-700'
            }`}>
              {item.status.toUpperCase()}
            </Text>
          </View>
          {item.status === 'available' && (
            <TouchableOpacity 
              className="bg-blue-600 px-4 py-2 rounded-lg"
              onPress={() => openBorrowModal(item)}>
              <Text className="text-white font-bold text-xs">Borrow</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-6 flex-1">
        <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">Library Books</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => item.book_id.toString()}
            renderItem={renderBookItem}
            ListEmptyComponent={
              <Text className="text-center text-gray-500 mt-10">No books found</Text>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Confirm Borrowing"
        footer={
          <View className="flex-row">
            <TouchableOpacity 
              className="flex-1 bg-gray-200 p-4 rounded-xl mr-2"
              onPress={() => setModalVisible(false)}>
              <Text className="text-gray-700 text-center font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-blue-600 p-4 rounded-xl"
              onPress={handleConfirmBorrow}>
              <Text className="text-white text-center font-bold">Confirm</Text>
            </TouchableOpacity>
          </View>
        }
      >
        <Text className="text-gray-600 mb-2 font-semibold text-center">
          You are borrowing:
        </Text>
        <Text className="text-xl font-bold text-blue-600 text-center mb-6">
          {selectedBook?.title}
        </Text>

        <Text className="text-gray-600 mb-2 font-semibold">Expected Return Date:</Text>
        
        {Platform.OS === 'web' ? (
          <input
            type="date"
            value={returnDate.toISOString().split('T')[0]}
            onChange={(e) => setReturnDate(new Date(e.target.value))}
            style={{
              padding: 12,
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              width: '100%',
              fontSize: 16
            }}
            min={new Date().toISOString().split('T')[0]}
          />
        ) : (
          <>
            <TouchableOpacity 
              className="bg-gray-100 p-4 rounded-xl border border-gray-200"
              onPress={() => setShowDatePicker(true)}>
              <Text className="text-gray-800 text-center">
                {returnDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={returnDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </>
        )}
      </CustomModal>
    </View>
  );
}